const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    topics: [
        {
            name: { type: String, required: true },
            subtopics: [{ type: String }]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
