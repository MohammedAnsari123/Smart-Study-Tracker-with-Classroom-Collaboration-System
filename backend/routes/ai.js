const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { extractTextFromPDF } = require('../controllers/aiController');
const upload = require('../middleware/uploadMiddleware');

router.post('/extract-pdf', protect, upload.single('file'), extractTextFromPDF);

module.exports = router;
