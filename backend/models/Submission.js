const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileURL: { type: String, required: true },
    comment: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    submissionStatus: { type: String, enum: ['on-time', 'late'], required: true },
    marks: { type: Number, default: null },
    feedback: { type: String, default: '' },
});

// One submission per student per assignment
submissionSchema.index({ assignmentId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
