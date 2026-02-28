const express = require('express');
const router = express.Router();
const { logStudySession, getUserStudySessions, getStudyStats } = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, logStudySession);
router.get('/', protect, getUserStudySessions);
router.get('/stats', protect, getStudyStats);

module.exports = router;
