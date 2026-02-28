const Announcement = require('../models/Announcement');
const ClassMember = require('../models/ClassMember');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' }, // Allow images or pdfs
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

const createAnnouncement = async (req, res) => {
    const { message } = req.body;
    const classId = req.params.classId;

    try {
        let attachmentURL = '';

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            attachmentURL = result.secure_url;
        }

        const announcement = await Announcement.create({
            classId,
            userId: req.user._id,
            message,
            attachmentURL,
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getClassAnnouncements = async (req, res) => {
    const classId = req.params.classId;

    try {
        const membership = await ClassMember.findOne({ classId, userId: req.user._id });
        const isOwner = req.classroom && req.classroom.ownerId.toString() === req.user._id.toString();

        // if not owner and not member
        if (!membership && !isOwner) {
            // Need to verify if user is owner from Classroom model if req.classroom is not set
            const fromDb = await require('../models/Classroom').findById(classId);
            if (!fromDb || fromDb.ownerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const announcements = await Announcement.find({ classId }).sort('-createdAt').populate('userId', 'fullName profileImage');
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createAnnouncement, getClassAnnouncements };
