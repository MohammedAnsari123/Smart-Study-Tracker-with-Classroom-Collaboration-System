const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const classroomSchema = new mongoose.Schema({
    className: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, default: '' },
    section: { type: String, default: '' },
    classCode: { type: String, unique: true, default: () => uuidv4().slice(0, 6).toUpperCase() },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classStatus: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Classroom', classroomSchema);
