const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subjectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject',
        required: true 
    },
    topicName: { type: String },
    description: { type: String },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true },
            explanation: { type: String }
        }
    ],
    timeLimit: { type: Number, default: 30 }, // in minutes
    difficulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    passingScore: { type: Number, default: 40 },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
