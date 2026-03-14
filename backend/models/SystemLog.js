const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    action: {
        type: String,
        required: true // e.g., 'CREATE_SUBJECT', 'DELETE_USER', 'UPLOAD_MATERIAL'
    },
    targetType: {
        type: String,
        required: true // e.g., 'User', 'Subject', 'Material'
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: String
    },
    ip: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemLog', systemLogSchema);
