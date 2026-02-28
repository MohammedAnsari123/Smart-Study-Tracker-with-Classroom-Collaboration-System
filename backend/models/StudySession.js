const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    topic: { type: String },
    subtopic: { type: String },
    durationMinutes: { type: Number, required: true },
    focusScore: { type: Number, min: 1, max: 5, required: true },
    sessionDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('StudySession', studySessionSchema);
