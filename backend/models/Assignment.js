const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    pdfURL: { type: String, required: true },
    maxMarks: { type: Number, default: 100 },
    deadline: { type: Date, required: true },
    assignmentStatus: { type: String, enum: ['active', 'closed'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
