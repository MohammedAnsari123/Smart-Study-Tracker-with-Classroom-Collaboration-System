const express = require('express');
const router = express.Router();
const { getPersonalAnalytics, getClassroomAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { requireOwner } = require('../middleware/ownerMiddleware');

router.get('/user', protect, getPersonalAnalytics);
router.get('/class/:id', protect, requireOwner, getClassroomAnalytics);

module.exports = router;
