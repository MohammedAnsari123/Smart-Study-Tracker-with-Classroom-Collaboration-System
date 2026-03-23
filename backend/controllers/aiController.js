const pdf = require('pdf-parse');
const axios = require('axios');

const extractTextFromPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const dataBuffer = req.file.buffer;
        if (!dataBuffer) {
            throw new Error('File buffer is empty');
        }

        // With pdf-parse@1.1.1, the package is a function
        const data = await pdf(dataBuffer);

        // Limit text length to avoid overloading LLM context
        const extractedText = data.text ? data.text.substring(0, 10000) : '';

        res.json({
            text: extractedText,
            pageCount: data.numpages,
            info: data.info
        });
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        res.status(500).json({ message: `Failed to extract text from PDF: ${error.message}` });
    }
};

const generateTest = async (req, res) => {
    try {
        const { subject, topic, subtopic, durationMinutes, notes } = req.body;
        
        // Inject 5-layer syllabus context from Database into the AI prompt
        const Subject = require('../models/Subject');
        const dbSubject = await Subject.findOne({ subjectName: subject });
        let enrichedNotes = notes || '';

        if (dbSubject) {
            // Find the specific subtopic details
            let foundDetails = '';
            for (const chap of dbSubject.chapters) {
                if (foundDetails) break;
                for (const top of chap.topics) {
                    if (foundDetails) break;
                    const subMatch = top.subtopics.find(s => s.name === subtopic);
                    if (subMatch) {
                        foundDetails = `Description: ${subMatch.description || 'N/A'}\nDetails: ${subMatch.details || 'N/A'}`;
                    }
                }
            }
            if (foundDetails) {
                enrichedNotes += `\n[MANDATORY SYLLABUS CONTEXT:\n${foundDetails}\n]`;
            }
        }

        // Dynamically point to the python service (typically driven by env in prod)
        // Default to port 8000/api to match utils/ai.js config
        const pyAIUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000/api';
        
        const fetchResponse = await axios.post(`${pyAIUrl}/test/generate`, {
            subject, topic, subtopic, durationMinutes, notes: enrichedNotes
        });
        
        res.json(fetchResponse.data);
    } catch (error) {
        console.error('Test Generation Error:', error);
        res.status(500).json({ message: `Failed to generate test: ${error.message}` });
    }
}

const getUserAIContext = async (req, res) => {
    try {
        const userId = req.user._id;
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Required Models
        const Subject = require('../models/Subject');
        const Department = require('../models/Department');
        const Announcement = require('../models/Announcement');
        const Assignment = require('../models/Assignment');
        const Flashcard = require('../models/Flashcard');
        const Progress = require('../models/Progress');
        const Quiz = require('../models/Quiz');
        const StudySession = require('../models/StudySession');
        const Submission = require('../models/Submission');
        const ClassMember = require('../models/ClassMember');
        
        // 1. Fetch Global/Shared Data
        const subjects = await Subject.find().lean();
        const departments = await Department.find().lean();
        
        // Formatted Curriculum Tree (Token Optimization)
        let curriculumMap = "📚 CURRICULUM SYLLABUS:\n";
        subjects.forEach(sub => {
            curriculumMap += `Subject: ${sub.subjectName} (${sub.courseCode})\n`;
            sub.chapters?.forEach(chap => {
                curriculumMap += `  - Chapter: ${chap.chapterName}\n`;
                chap.topics?.forEach(top => {
                    curriculumMap += `    - Topic: ${top.topicName} (Subtopics: ${top.subtopics?.map(s => s.name).join(', ') || 'None'})\n`;
                });
            });
        });

        const activeDepartments = `🏢 DEPARTMENTS: ${departments.map(d => d.name).join(', ')}\n`;

        // 2. Fetch User-Specific Classes to get relevant Announcements & Assignments
        const memberships = await ClassMember.find({ user: userId }).select('classroom').lean();
        const classroomIds = memberships.map(m => m.classroom);

        // Correct field: classId
        const announcements = await Announcement.find({ 
            classId: { $in: classroomIds },
            createdAt: { $gte: sixMonthsAgo } 
        }).select('message createdAt').lean();

        // Correct field: classId, deadline
        const assignments = await Assignment.find({ 
            classId: { $in: classroomIds },
            createdAt: { $gte: sixMonthsAgo }
        }).select('title description deadline maxMarks').lean();

        // 3. User-Specific Data (Corrected field names)
        const progress = await Progress.find({ userId }).populate('assignmentId', 'title').lean();
        const studySessions = await StudySession.find({ userId, sessionDate: { $gte: sixMonthsAgo } }).select('subject topic durationMinutes testScore sessionDate').lean();
        const flashcards = await Flashcard.find({ userId, createdAt: { $gte: sixMonthsAgo } }).select('question subjectId').lean();
        const submissions = await Submission.find({ userId, submittedAt: { $gte: sixMonthsAgo } }).populate('assignmentId', 'title').lean();
        
        const quizzes = await Quiz.find({ createdAt: { $gte: sixMonthsAgo } }).select('title subject duration timeLimit').lean();

        // 4. Construct the Compact Prompt String
        let contextString = `--- 🧠 AI ASSISTANT ACADEMIC PROFILE (Last 6 Months) ---\n\n`;
        contextString += `${curriculumMap}\n`;
        contextString += `${activeDepartments}\n`;
        
        contextString += `📢 ANNOUNCEMENTS:\n${announcements.map(a => `- ${a.message} (${new Date(a.createdAt).toLocaleDateString()})`).join('\n') || 'None'}\n\n`;
        
        contextString += `📝 ASSIGNMENTS:\n${assignments.map(a => `- ${a.title} (Due: ${new Date(a.deadline).toLocaleDateString()})`).join('\n') || 'None'}\n\n`;
        
        if (progress && progress.length > 0) {
            contextString += `📊 ASSIGNMENT PROGRESS:\n${progress.map(p => `- ${p.assignmentId?.title}: ${p.status}`).join('\n')}\n\n`;
        } else {
            contextString += `📊 ASSIGNMENT PROGRESS: No active assignment progress tracked yet.\n\n`;
        }

        contextString += `📖 RECENT STUDY SESSIONS:\n${studySessions.slice(-15).map(s => `- ${s.subject}: ${s.topic} (${s.durationMinutes}m) [Test Score: ${s.testScore || 'N/A'}]`).join('\n') || 'No recent sessions.'}\n\n`;
        
        contextString += `🗂️ ACTIVE FLASHCARDS:\n${flashcards.slice(-20).map(f => `- Q: ${f.question ? f.question.substring(0,50) : ''}`).join('\n') || 'No flashcards generated yet.'}\n\n`;
        
        contextString += `✅ USER SUBMISSIONS:\n${submissions.map(s => `- ${s.assignmentId?.title || 'Unknown'} (Marks: ${s.marks !== null ? s.marks : 'Pending Review'})`).join('\n') || 'No submissions found in last 6 months.'}\n`;

        res.json({ contextPayload: contextString });
    } catch (error) {
        console.error('Failed to construct User AI Context:', error);
        res.status(500).json({ message: 'Internal Server Error fetching AI context' });
    }
}

module.exports = { extractTextFromPDF, generateTest, getUserAIContext };
