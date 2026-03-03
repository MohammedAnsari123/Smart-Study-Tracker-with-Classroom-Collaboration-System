const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    title: { type: String, required: true },
    description: { type: String },
    pdfURL: { type: String, required: true },
    maxMarks: { type: Number, default: 100 },
    deadline: { type: Date, required: true },
    status: {
        type: String,
        enum: ['todo', 'doing', 'done', 'active', 'closed'], // Merged status fields for simplicity or kept consistent
        default: 'todo'
    },
    assignmentStatus: { type: String, enum: ['active', 'closed'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
