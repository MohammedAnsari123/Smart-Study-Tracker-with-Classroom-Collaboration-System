const express = require('express');
const router = express.Router();
const {
    updateProgress,
    getMyClassProgress,
    getClassProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// Update my progress for an assignment
router.post('/update', protect, updateProgress);

// Get my progress for all assignments in a class
router.get('/my/:classId', protect, getMyClassProgress);

// Get all student progress for a class (Owner/Teacher only)
router.get('/class/:classId', protect, getClassProgress);

module.exports = router;
