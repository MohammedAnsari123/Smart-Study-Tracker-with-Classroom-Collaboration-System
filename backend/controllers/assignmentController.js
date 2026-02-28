const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const ClassMember = require('../models/ClassMember');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'raw', format: 'pdf' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

const createAssignment = async (req, res) => {
    const { title, description, maxMarks, deadline } = req.body;
    const classId = req.params.classId;

    try {
        if (!req.file) return res.status(400).json({ message: 'PDF file is required' });

        const result = await uploadToCloudinary(req.file.buffer);

        const assignment = await Assignment.create({
            classId,
            title,
            description,
            pdfURL: result.secure_url,
            maxMarks: maxMarks || 100,
            deadline,
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getClassAssignments = async (req, res) => {
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

        const assignments = await Assignment.find({ classId }).sort('-createdAt').lean();

        // Attach current user's submission to each assignment
        const assignmentsWithStatus = await Promise.all(assignments.map(async (assign) => {
            const mySubmission = await Submission.findOne({
                assignmentId: assign._id,
                userId: req.user._id
            });
            return { ...assign, mySubmission };
        }));

        res.json(assignmentsWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitAssignment = async (req, res) => {
    const assignmentId = req.params.id;
    const { comment } = req.body;

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        const membership = await ClassMember.findOne({ classId: assignment.classId, userId: req.user._id });
        if (!membership) return res.status(403).json({ message: 'You are not a member of this class' });

        if (!req.file) return res.status(400).json({ message: 'PDF submission file is required' });

        const alreadySubmitted = await Submission.findOne({ assignmentId, userId: req.user._id });
        if (alreadySubmitted) return res.status(400).json({ message: 'You have already submitted this assignment' });

        const result = await uploadToCloudinary(req.file.buffer);
        const isLate = new Date() > new Date(assignment.deadline);

        const submission = await Submission.create({
            assignmentId,
            userId: req.user._id,
            fileURL: result.secure_url,
            comment,
            submissionStatus: isLate ? 'late' : 'on-time',
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const gradeSubmission = async (req, res) => {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.marks = marks;
        submission.feedback = feedback;
        await submission.save();

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAssignmentSubmissions = async (req, res) => {
    const assignmentId = req.params.id;

    try {
        const submissions = await Submission.find({ assignmentId }).populate('userId', 'fullName email profileImage');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAssignment,
    getClassAssignments,
    submitAssignment,
    gradeSubmission,
    getAssignmentSubmissions
};
