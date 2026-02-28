const mongoose = require('mongoose');

const classMemberSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
    membershipStatus: { type: String, enum: ['active', 'removed'], default: 'active' },
});

// Compound index to ensure one user cannot join the same class twice
classMemberSchema.index({ classId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ClassMember', classMemberSchema);
