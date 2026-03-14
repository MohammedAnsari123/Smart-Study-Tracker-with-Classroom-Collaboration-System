const express = require('express');
const router = express.Router();
const { 
    createQuiz,
    getQuizzesBySubject,
    deleteQuiz
} = require('../controllers/quizController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/', protectAdmin, createQuiz);
router.get('/:subjectId', protectAdmin, getQuizzesBySubject);
router.delete('/:id', protectAdmin, deleteQuiz);

module.exports = router;
