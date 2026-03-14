const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    profileImage: { type: String, default: '' },
    accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active' },
    lastLogin: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
