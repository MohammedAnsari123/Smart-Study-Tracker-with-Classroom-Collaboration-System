const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { extractTextFromPDF, generateTest } = require('../controllers/aiController');
const upload = require('../middleware/uploadMiddleware');

router.post('/extract-pdf', protect, upload.single('file'), extractTextFromPDF);
router.post('/generate-test', protect, generateTest);

module.exports = router;
