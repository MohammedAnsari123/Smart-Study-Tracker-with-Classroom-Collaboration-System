const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    nextReviewDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);
