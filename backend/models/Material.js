const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { 
        type: String, 
        enum: ['pdf', 'video', 'link', 'slide', 'code', 'other'],
        required: true 
    },
    url: { type: String, required: true }, // Cloudinary/Local URL
    subjectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject',
        required: true 
    },
    topicName: { type: String }, // Optional link to specific topic
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
