const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner ID
    message: { type: String, required: true },
    attachmentURL: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
