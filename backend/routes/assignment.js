const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getClassAssignments,
    submitAssignment,
    gradeSubmission,
    getAssignmentSubmissions,
    updateAssignmentStatus,
    proxyPDF
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { requireOwner } = require('../middleware/ownerMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Create assignment for class
router.post('/class/:classId/create', protect, requireOwner, upload.single('file'), createAssignment);

// Update assignment status (Kanban)
router.patch('/:id/status', protect, updateAssignmentStatus);

// Proxy PDF for preview (resolves 401/CORS issues)
// No middleware here because we handle token verification inside for query-param support
router.get('/proxy-pdf', proxyPDF);


// Get all assignments for a class
router.get('/class/:classId', protect, getClassAssignments);

// Student: Submit assignment
router.post('/:id/submit', protect, upload.single('file'), submitAssignment);

// Teacher: Get submissions for an assignment
// requires ?classId=... in query for requireOwner
router.get('/:id/submissions', protect, requireOwner, getAssignmentSubmissions);

// Teacher: Grade a specific submission
// requires ?classId=... in query for requireOwner
router.post('/submission/:submissionId/grade', protect, requireOwner, gradeSubmission);

module.exports = router;
