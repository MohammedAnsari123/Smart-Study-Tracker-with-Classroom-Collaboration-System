const axios = require('axios');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const ClassMember = require('../models/ClassMember');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');

// Removed local uploadToCloudinary, using helper instead

const createAssignment = async (req, res) => {
    const { title, description, maxMarks, deadline } = req.body;
    const classId = req.params.classId;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

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

const updateAssignmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        assignment.status = status;
        await assignment.save();

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const proxyPDF = async (req, res) => {
    const { url, token: queryToken } = req.query;
    const token = queryToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) return res.status(401).json({ message: 'Authentication required' });

    try {
        // Verify token manually since we might be bypassing the 'protect' middleware for query-param access
        jwt.verify(token, process.env.JWT_SECRET);

        if (!url) return res.status(400).json({ message: 'URL is required' });

        // More robust Cloudinary URL parsing
        // Format: https://res.cloudinary.com/cloud_name/resource_type/type/vVersion/PublicID.ext
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/');
        
        // Parts will look like ["", "cloud_name", "image", "upload", "v123", "folder", "id.pdf"]
        const cloudName = parts[1];
        const resourceType = parts[2];
        const type = parts[3];
        
        // Find where the publicId starts (it's after the version, which starts with 'v')
        let versionIdx = -1;
        for (let i = 4; i < parts.length; i++) {
            if (parts[i].startsWith('v') && /^\d+$/.test(parts[i].substring(1))) {
                versionIdx = i;
                break;
            }
        }
        
        let publicId = '';
        if (versionIdx !== -1) {
            // Join everything after version and remove extension
            const idWithExt = parts.slice(versionIdx + 1).join('/');
            publicId = idWithExt.substring(0, idWithExt.lastIndexOf('.'));
        } else {
            // No version? Skip type and join
            const idWithExt = parts.slice(4).join('/');
            publicId = idWithExt.substring(0, idWithExt.lastIndexOf('.'));
        }

        console.log(`[PDF Proxy] Parsed PublicId: ${publicId}, ResourceType: ${resourceType}`);

        // Generate an authenticated download URL using the SDK's private_download_url
        // This is the most formal way to get a signed URL for a protected asset
        const signedUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
            resource_type: resourceType,
            type: type,
            expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
        });

        console.log(`[PDF Proxy] Generated Signed URL: ${signedUrl}`);

        const response = await axios.get(signedUrl, { 
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const contentType = response.headers['content-type'] || 'application/pdf';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        // Handle download parameter
        if (req.query.download === 'true') {
            const fileName = publicId.split('/').pop() + '.pdf';
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        } else {
            res.setHeader('Content-Disposition', 'inline');
        }
        
        response.data.pipe(res);
    } catch (error) {
        console.error('PDF Proxy Error:', error.message);
        res.status(500).json({ message: 'Failed to access document for preview' });
    }
};

module.exports = {
    createAssignment,
    getClassAssignments,
    submitAssignment,
    gradeSubmission,
    getAssignmentSubmissions,
    updateAssignmentStatus,
    proxyPDF
};
