const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    status: {
        type: String,
        enum: ['todo', 'doing', 'done'],
        default: 'todo'
    }
}, { timestamps: true });

// Ensure one progress record per user per assignment
progressSchema.index({ userId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
