const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    courseCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    credits: { type: Number },
    hours: {
        theoryHours: { type: Number, default: 0 },
        tutorialHours: { type: Number, default: 0 },
        practicalHours: { type: Number, default: 0 },
        totalHours: { type: Number, default: 0 }
    },
    scheme: { type: String, default: 'NEP 2020' },
    academicYear: { type: String, default: '2025-26' },
    university: { type: String, default: 'University of Mumbai' },
    programCode: { type: String, default: 'BE-ECS' },
    programName: { type: String, default: 'Bachelor of Engineering - Electronics and Computer Science' },
    courseOutcomes: [
        {
            code: { type: String },
            description: { type: String }
        }
    ],
    experiments: [
        {
            number: { type: Number },
            category: { type: String },
            title: { type: String },
            application: { type: String },
            options: [{ type: String }]
        }
    ],
    assessment: {
        internalAssessment1: { type: Number },
        internalAssessment2: { type: Number },
        endSemesterExam: { type: Number },
        termWork: { type: Number },
        oral: { type: Number },
        total: { type: Number }
    },
    chapters: [
        {
            moduleNumber: { type: Number },
            chapterName: { type: String, required: true },
            hours: { type: Number },
            description: { type: String },
            topics: [
                {
                    topicName: { type: String, required: true },
                    description: { type: String },
                    subtopics: [
                        {
                            name: { type: String, required: true },
                            description: { type: String },
                            details: { type: String }
                        }
                    ]
                }
            ]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);

