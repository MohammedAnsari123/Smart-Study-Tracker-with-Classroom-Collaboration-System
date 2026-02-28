const express = require('express');
const router = express.Router();
const { createAnnouncement, getClassAnnouncements } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { requireOwner } = require('../middleware/ownerMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/class/:classId/create', protect, requireOwner, upload.single('file'), createAnnouncement);
router.get('/class/:classId', protect, getClassAnnouncements);

module.exports = router;
