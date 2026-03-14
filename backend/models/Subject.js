const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    courseCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    topics: [
        {
            topicName: { type: String, required: true },
            subtopics: [{ type: String }]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
