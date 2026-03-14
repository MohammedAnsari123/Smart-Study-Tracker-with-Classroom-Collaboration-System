const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, mostly unused for global admin curriculum
    name: { type: String, required: true },
    topics: [
        {
            name: { type: String, required: true },
            subtopics: [{ type: String }]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
