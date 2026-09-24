const express = require('express');
const router = express.Router();
const { logStudySession, getUserStudySessions, getStudyStats, updateTestScore, getSingleStudySession } = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, logStudySession);
router.post('/session', protect, logStudySession);
router.get('/', protect, getUserStudySessions);
router.get('/stats', protect, getStudyStats);
router.get('/:id', protect, getSingleStudySession);
router.patch('/:id/score', protect, updateTestScore);
router.put('/:id/score', protect, updateTestScore);
router.put('/:id/test-score', protect, updateTestScore);
router.patch('/:id/test-score', protect, updateTestScore);

module.exports = router;

