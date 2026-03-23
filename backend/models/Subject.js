const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    courseCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    description: { type: String },
    chapters: [
        {
            chapterName: { type: String, required: true },
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
