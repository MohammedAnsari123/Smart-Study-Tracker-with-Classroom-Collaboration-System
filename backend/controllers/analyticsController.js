const StudySession = require('../models/StudySession');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const ClassMember = require('../models/ClassMember');
const Flashcard = require('../models/Flashcard');
const Subject = require('../models/Subject');
const Classroom = require('../models/Classroom');
const { analyzeWeaknesses } = require('../utils/ai');
const Notification = require('../models/Notification');

const getPersonalAnalytics = async (req, res) => {
    try {
        const sessions = await StudySession.find({ userId: req.user._id });

        if (!sessions.length) {
            return res.json({
                totalStudyHours: 0,
                averageFocusScore: 0,
                productivityScore: 0,
                subjectDistribution: {},
                bestStudyDay: 'N/A'
            });
        }

        const validTestSessions = sessions.filter(s => s.testScore !== undefined);
        const totalDuration = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
        const averageFocusScore = validTestSessions.length > 0 
            ? (validTestSessions.reduce((sum, session) => sum + (session.testScore / 20), 0) / validTestSessions.length)
            : 0;

        // Calculate productivity score
        const totalStudyHours = (totalDuration / 60).toFixed(2);
        const productivityScore = (totalStudyHours * averageFocusScore).toFixed(2);

        // Subject distribution
        const subjectDistribution = {};
        sessions.forEach(session => {
            subjectDistribution[session.subject] = (subjectDistribution[session.subject] || 0) + session.durationMinutes;
        });

        // Subject Mastery (Average Focus per subject)
        const subjectMastery = Object.keys(subjectDistribution).map(subject => {
            const subjectSessions = sessions.filter(s => s.subject === subject && s.testScore !== undefined);
            const avgFocus = subjectSessions.length > 0 
                ? (subjectSessions.reduce((sum, s) => sum + (s.testScore / 20), 0) / subjectSessions.length)
                : 0;
            return {
                subject,
                score: parseFloat(avgFocus.toFixed(1))
            };
        });

        // Weekly Consistency (Last 7 days)
        const weeklyConsistency = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dayName = days[d.getDay()];
            const dayMinutes = sessions
                .filter(s => new Date(s.sessionDate).toDateString() === d.toDateString())
                .reduce((sum, s) => sum + s.durationMinutes, 0);

            weeklyConsistency.push({
                day: dayName,
                minutes: dayMinutes
            });
        }

        res.json({
            totalDuration: totalDuration, // Frontend expects this for 'Total Time'
            totalStudyHours,
            averageFocus: averageFocusScore.toFixed(1), // Frontend expects averageFocus
            productivityScore,
            subjectDistribution,
            subjectMastery,
            weeklyConsistency
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getClassroomAnalytics = async (req, res) => {
    const classId = req.params.id; // From ownerMiddleware

    try {
        const students = await ClassMember.countDocuments({ classId, membershipStatus: 'active' }) - 1; // Exclude owner
        const assignments = await Assignment.find({ classId });

        let totalSubmissions = 0;
        let lateSubmissions = 0;
        const assignmentStats = [];

        for (let assignment of assignments) {
            const subs = await Submission.find({ assignmentId: assignment._id });
            totalSubmissions += subs.length;
            lateSubmissions += subs.filter(s => s.submissionStatus === 'late').length;

            const totalPossibleSubmissions = students > 0 ? students : 0;
            const submissionPercentage = totalPossibleSubmissions > 0 ? ((subs.length / totalPossibleSubmissions) * 100).toFixed(1) : 0;

            assignmentStats.push({
                title: assignment.title,
                submissionCount: subs.length,
                submissionPercentage,
                lateCount: subs.filter(s => s.submissionStatus === 'late').length
            });
        }

        const overallCompletionRate = assignments.length > 0 && students > 0
            ? ((totalSubmissions / (assignments.length * students)) * 100).toFixed(1) : 0;

        res.json({
            totalStudents: students,
            totalAssignments: assignments.length,
            overallCompletionRate,
            lateSubmissions,
            assignmentStats
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWeaknessDetectionData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all relevant data for the AI engine
        const [sessions, flashcards, submissions] = await Promise.all([
            StudySession.find({ userId }).sort('-createdAt').limit(50),
            Flashcard.find({ userId }),
            Submission.find({ userId, marks: { $ne: null } }).populate('assignmentId')
        ]);

        // Format data for simple AI consumption
        const formattedSessions = sessions.map(s => ({
            subject: s.subject,
            topic: s.topic,
            duration: s.durationMinutes,
            focus: s.testScore ? (s.testScore / 20) : 0,
            distractions: s.distractionsCount || 0
        }));

        const formattedFlashcards = flashcards.map(f => ({
            subjectId: f.subjectId,
            question: f.question,
            difficulty: f.difficulty
        }));

        const formattedSubmissions = submissions.map(sub => ({
            title: sub.assignmentId?.title,
            marks: sub.marks,
            maxMarks: sub.assignmentId?.maxMarks
        }));

        res.json({
            sessions: formattedSessions,
            flashcards: formattedFlashcards,
            submissions: formattedSubmissions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWeaknessReport = async (req, res) => {
    try {
        const userId = req.user._id;
        const { subject } = req.query;

        if (!subject) {
            return res.status(400).json({ message: "Please select a subject for weakness analysis." });
        }

        // 1. Fetch study time for this specific subject
        const sessions = await StudySession.find({ userId, subject });
        const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

        if (totalMinutes < 60) {
            return res.json({
                thresholdMet: false,
                minutesNeeded: 60 - totalMinutes,
                message: `You need at least 60 minutes of study for ${subject} to unlock AI analysis. Currently at ${totalMinutes} minutes.`
            });
        }

        // 2. Find the subject document to get its ID for flashcard querying
        const subjectDoc = await Subject.findOne({ subjectName: subject });
        
        // 3. Fetch other relevant data for this subject
        const [flashcards, submissions] = await Promise.all([
            subjectDoc ? Flashcard.find({ userId, subjectId: subjectDoc._id }) : [],
            Submission.find({ userId, marks: { $ne: null } }).populate({
                path: 'assignmentId',
                populate: {
                    path: 'classId',
                    model: 'Classroom',
                    match: { subject: subject }
                }
            })
        ]);

        const filteredSubmissions = submissions.filter(s => s.assignmentId?.classId !== null);

        const studyData = {
            subject,
            thresholdMet: true,
            sessions: sessions.map(s => ({
                topic: s.topic,
                duration: s.durationMinutes,
                focus: s.testScore ? (s.testScore / 20) : 0
            })),
            flashcards: flashcards.map(f => ({
                question: f.question,
                difficulty: f.difficulty
            })),
            submissions: filteredSubmissions.map(sub => ({
                title: sub.assignmentId?.title,
                marks: sub.marks,
                maxMarks: sub.assignmentId?.maxMarks
            }))
        };

        // 3. Call AI Service
        const report = await analyzeWeaknesses(studyData);

        res.json({
            ...report,
            thresholdMet: true,
            subjectStudyTime: totalMinutes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getTimeOptimizationData = async (req, res) => {
    try {
        const userId = req.user._id;
        const sessions = await StudySession.find({ userId });

        // Group by hour of day (0-23)
        const hourlyStats = {};
        for (let i = 0; i < 24; i++) hourlyStats[i] = { totalFocus: 0, count: 0 };

        sessions.forEach(session => {
            if (session.testScore !== undefined) {
                const hour = new Date(session.sessionDate).getHours();
                hourlyStats[hour].totalFocus += (session.testScore / 20);
                hourlyStats[hour].count += 1;
            }
        });

        const recommendations = Object.keys(hourlyStats).map(hour => ({
            hour: parseInt(hour),
            avgFocus: hourlyStats[hour].count > 0 ? (hourlyStats[hour].totalFocus / hourlyStats[hour].count).toFixed(1) : 0
        })).filter(h => h.avgFocus > 0);

        // Find best hour
        const bestHour = recommendations.reduce((prev, current) =>
            (parseFloat(current.avgFocus) > parseFloat(prev?.avgFocus || 0)) ? current : prev
            , { hour: 'N/A', avgFocus: 0 });

        res.json({
            hourlyAnalysis: recommendations,
            bestHour: bestHour.hour,
            bestFocus: bestHour.avgFocus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAssignmentRisk = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // 1. Find classes the user is a member of
        const memberships = await ClassMember.find({ userId: userId }).select('classId').lean();
        const classroomIds = memberships.map(m => m.classId);

        // 2. Find assignments in these classes and check if unsubmitted
        const assignments = await Assignment.find({
            classId: { $in: classroomIds },
            assignmentStatus: 'active'
        }).lean();

        const submissions = await Submission.find({ userId }).select('assignmentId').lean();
        const submittedAssignmentIds = submissions.map(s => s.assignmentId.toString());

        // 3. User study sessions for subject strength analysis
        const sessions = await StudySession.find({ userId });
        const subjectStats = {};
        sessions.forEach(s => {
            if (s.testScore !== undefined) {
                if (!subjectStats[s.subject]) subjectStats[s.subject] = { totalFocus: 0, count: 0 };
                subjectStats[s.subject].totalFocus += (s.testScore / 20);
                subjectStats[s.subject].count += 1;
            }
        });

        // 4. Calculate Risk & Status for ALL assignments
        const risks = await Promise.all(assignments.map(async (a) => {
            const isSubmitted = submittedAssignmentIds.includes(a._id.toString());
            const dueDate = new Date(a.deadline);
            const today = new Date();
            const timeDiff = dueDate - today;
            const daysLeft = Math.max(timeDiff / (1000 * 60 * 60 * 24), 0.1);

            const stats = subjectStats[a.subject];
            const avgFocus = stats ? stats.totalFocus / stats.count : 3; 
            const difficultyScale = (6 - avgFocus); 

            const riskScore = (difficultyScale / daysLeft) * 10;

            let riskLevel = 'Low';
            if (daysLeft <= 2) riskLevel = 'Critical';
            else if (riskScore > 15) riskLevel = 'High';
            else if (riskScore > 7) riskLevel = 'Medium';

            const isUrgent = daysLeft <= 2 && !isSubmitted;

            if (isUrgent) {
                try {
                    const existingNotif = await Notification.findOne({
                        userId: req.user._id,
                        message: { $regex: a.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') },
                        type: 'assignment'
                    });
                    
                    if (!existingNotif) {
                        await Notification.create({
                            userId: req.user._id,
                            message: `Urgent: Assignment "${a.title}" is due soon! (in ${daysLeft.toFixed(1)} days)`,
                            type: 'assignment',
                            link: `/class/${a.classId}`
                        });
                    }
                } catch (err) {
                    console.error("Auto-notification failed:", err);
                }
            }

            return {
                id: a._id,
                title: a.title,
                classId: a.classId,
                subject: a.subject || 'General',
                dueDate: a.deadline,
                daysLeft: Math.ceil(daysLeft),
                riskLevel,
                isUrgent: isUrgent,
                isSubmitted: isSubmitted
            };
        }));

        res.json(risks);
    } catch (error) {
        console.error('Assignment Risk Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getHeatmapData = async (req, res) => {
    try {
        const userId = req.user._id;
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const sessions = await StudySession.find({
            userId,
            sessionDate: { $gte: oneYearAgo }
        });

        const dailyStats = {};

        sessions.forEach(session => {
            const dateStr = new Date(session.sessionDate).toISOString().split('T')[0];
            if (!dailyStats[dateStr]) {
                dailyStats[dateStr] = {
                    date: dateStr,
                    minutes: 0,
                    totalFocus: 0,
                    count: 0
                };
            }
            dailyStats[dateStr].minutes += session.durationMinutes;
            if (session.testScore !== undefined) {
                dailyStats[dateStr].totalFocus += (session.testScore / 20);
                dailyStats[dateStr].count += 1;
            }
        });

        const heatmapData = Object.values(dailyStats).map(day => ({
            date: day.date,
            minutes: day.minutes,
            intensity: Math.min(Math.ceil(day.minutes / 60), 4), // Level 1-4 based on hours
            avgFocus: (day.totalFocus / day.count).toFixed(1)
        }));

        res.json(heatmapData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBurnoutAnalysis = async (req, res) => {
    try {
        const userId = req.user._id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const sessions = await StudySession.find({
            userId,
            sessionDate: { $gte: sevenDaysAgo }
        }).sort({ sessionDate: 1 });
        if (sessions.length < 3) {
            return res.json({
                riskLevel: 'Low',
                message: 'Keep going! More data needed for detailed fatigue analysis.'
            });
        }

        const totalHours = sessions.reduce((sum, s) => sum + (s.durationMinutes / 60), 0);
        const validPerformanceSessions = sessions.filter(s => s.testScore !== undefined);

        const avgScore = validPerformanceSessions.length > 0
            ? validPerformanceSessions.reduce((sum, s) => sum + (s.testScore / 20), 0) / validPerformanceSessions.length
            : 3; // Default neutral

        // Check for declining performance trend
        const firstHalf = validPerformanceSessions.slice(0, Math.floor(validPerformanceSessions.length / 2));
        const secondHalf = validPerformanceSessions.slice(Math.floor(validPerformanceSessions.length / 2));
        const score1 = firstHalf.length > 0 ? firstHalf.reduce((sum, s) => sum + (s.testScore / 20), 0) / firstHalf.length : 3;
        const score2 = secondHalf.length > 0 ? secondHalf.reduce((sum, s) => sum + (s.testScore / 20), 0) / secondHalf.length : 3;
        const scoreDecline = score1 - score2;

        let riskLevel = 'Low';
        let message = 'Your study balance looks healthy. Keep it up!';

        if (totalHours > 40 || (scoreDecline > 1 && totalHours > 20)) {
            riskLevel = 'High';
            message = 'Fatigue detected. We recommend taking a 24-hour break to reset.';
        } else if (totalHours > 25 || scoreDecline > 0.5) {
            riskLevel = 'Medium';
            message = 'Consistency is good, but performance is slipping. Try a shorter Pomodoro session.';
        }

        res.json({
            riskLevel,
            message,
            stats: {
                weeklyHours: totalHours.toFixed(1),
                avgPerformance: avgScore.toFixed(1),
                performanceTrend: scoreDecline > 0 ? 'Declining' : 'Stable'
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getPersonalAnalytics,
    getClassroomAnalytics,
    getWeaknessDetectionData,
    getWeaknessReport,
    getTimeOptimizationData,
    getAssignmentRisk,
    getHeatmapData,
    getBurnoutAnalysis
};
