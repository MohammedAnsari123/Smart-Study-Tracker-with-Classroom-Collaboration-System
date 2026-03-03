const Progress = require('../models/Progress');
const Classroom = require('../models/Classroom');
const ClassMember = require('../models/ClassMember');

// Update or create progress for a student
const updateProgress = async (req, res) => {
    try {
        const { assignmentId, classId, status } = req.body;
        const userId = req.user._id;

        const progress = await Progress.findOneAndUpdate(
            { userId, assignmentId },
            { classId, status },
            { new: true, upsert: true }
        );

        res.status(200).json(progress);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get progress for all assignments in a class for the logged-in student
const getMyClassProgress = async (req, res) => {
    try {
        const { classId } = req.params;
        const userId = req.user._id;

        const progress = await Progress.find({ userId, classId });
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error fetching my progress:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all student progress for a classroom (Owner Only)
const getClassProgress = async (req, res) => {
    try {
        const { classId } = req.params;
        const userId = req.user._id;

        // Verify ownership
        const classroom = await Classroom.findById(classId);
        if (!classroom || classroom.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Access denied: Classroom ownership required' });
        }

        const classProgress = await Progress.find({ classId })
            .populate('userId', 'fullName email')
            .populate('assignmentId', 'title');

        res.status(200).json(classProgress);
    } catch (error) {
        console.error('Error fetching class progress:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    updateProgress,
    getMyClassProgress,
    getClassProgress
};
