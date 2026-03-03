const express = require('express');
const router = express.Router();
const {
    createFlashcard,
    getFlashcardsBySubject,
    updateFlashcardDifficulty,
    deleteFlashcard,
    generateAIFlashcards
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createFlashcard);
router.get('/subject/:subjectId', protect, getFlashcardsBySubject);
router.patch('/:id/difficulty', protect, updateFlashcardDifficulty);
router.delete('/:id', protect, deleteFlashcard);
router.post('/ai-generate/:subjectId', protect, generateAIFlashcards);


module.exports = router;
