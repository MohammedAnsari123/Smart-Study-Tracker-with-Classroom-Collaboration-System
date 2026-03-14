const Assignment = require('../models/Assignment');
const Subject = require('../models/Subject');

// @desc    Add a master assignment
// @route   POST /api/admin/assignments
// @access  Admin
const createAdminAssignment = async (req, res) => {
    try {
        const { title, description, pdfURL, maxMarks, deadline, subjectId, classId } = req.body;

        // Note: Admin might create a "Master" assignment that gets pushed to a class or subject
        // For now, aligning with the existing model which requires classId
        const assignment = await Assignment.create({
            title,
            description,
            pdfURL,
            maxMarks,
            deadline,
            classId, // In a real scenario, we might want to link to Subject and then distribute to classes
            status: 'active'
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assignments by subject/class
// @route   GET /api/admin/assignments/:classId
// @access  Admin
const getAdminAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ classId: req.params.classId })
            .sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete assignment
// @route   DELETE /api/admin/assignments/:id
// @access  Admin
const deleteAdminAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        await assignment.deleteOne();
        res.json({ message: 'Assignment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAdminAssignment,
    getAdminAssignments,
    deleteAdminAssignment
};
