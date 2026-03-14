const express = require('express');
const router = express.Router();
const { logStudySession, getUserStudySessions, getStudyStats, updateTestScore, getSingleStudySession } = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, logStudySession);
router.get('/', protect, getUserStudySessions);
router.get('/stats', protect, getStudyStats);
router.get('/:id', protect, getSingleStudySession);
router.patch('/:id/score', protect, updateTestScore);

module.exports = router;
