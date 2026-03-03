const Classroom = require('../models/Classroom');
const ClassMember = require('../models/ClassMember');

const createClassroom = async (req, res) => {
    const { className, subject, description, section } = req.body;

    try {
        const classroom = await Classroom.create({
            className,
            subject,
            description,
            section,
            ownerId: req.user._id,
        });

        // Owner automatically added as member
        await ClassMember.create({
            classId: classroom._id,
            userId: req.user._id,
        });

        res.status(201).json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const joinClassroom = async (req, res) => {
    const { classCode } = req.body;

    try {
        const classroom = await Classroom.findOne({ classCode });
        if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
        if (classroom.classStatus !== 'active') return res.status(400).json({ message: 'Classroom is archived' });

        const alreadyJoined = await ClassMember.findOne({ classId: classroom._id, userId: req.user._id });
        if (alreadyJoined) return res.status(400).json({ message: 'You have already joined this class' });

        const membership = await ClassMember.create({
            classId: classroom._id,
            userId: req.user._id,
        });

        res.status(201).json({ message: 'Classroom joined successfully', membership });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserClassrooms = async (req, res) => {
    try {
        const memberships = await ClassMember.find({ userId: req.user._id, membershipStatus: 'active' })
            .populate('classId')
            .exec();

        const classrooms = memberships.map(m => m.classId);
        res.json(classrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getClassroomDetails = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id).populate('ownerId', 'fullName email profileImage');
        if (!classroom) return res.status(404).json({ message: 'Classroom not found' });

        res.json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteClassroom = async (req, res) => {
    try {
        await req.classroom.remove(); // req.classroom set by ownerMiddleware
        // Also remove memberships associated
        await ClassMember.deleteMany({ classId: req.classroom._id });

        res.json({ message: 'Classroom deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeMember = async (req, res) => {
    const { memberId } = req.body; // memberId refers to User ID here, or ClassMember ID
    try {
        const membership = await ClassMember.findOne({ classId: req.classroom._id, userId: memberId });
        if (!membership) return res.status(404).json({ message: 'Member not found in class' });
        if (memberId === req.user._id.toString()) return res.status(400).json({ message: 'Owner cannot be removed' });

        membership.membershipStatus = 'removed';
        await membership.save();

        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getClassMembers = async (req, res) => {
    try {
        const members = await ClassMember.find({ classId: req.params.id, membershipStatus: 'active' })
            .populate('userId', 'fullName email profileImage')
            .exec();

        // Optionally filter out the owner if you only want students
        const classroom = await Classroom.findById(req.params.id);
        const students = members.filter(m => m.userId._id.toString() !== classroom.ownerId.toString());

        res.json(students.map(s => s.userId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createClassroom, joinClassroom, getUserClassrooms, getClassroomDetails, deleteClassroom, removeMember, getClassMembers };
