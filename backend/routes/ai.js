const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { extractTextFromPDF, generateTest, getUserAIContext } = require('../controllers/aiController');
const upload = require('../middleware/uploadMiddleware');

router.post('/extract-pdf', protect, upload.single('file'), extractTextFromPDF);
router.post('/generate-test', protect, generateTest);
router.get('/user-context', protect, getUserAIContext);

module.exports = router;
