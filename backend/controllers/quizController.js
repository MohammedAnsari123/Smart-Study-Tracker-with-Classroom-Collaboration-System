const Quiz = require('../models/Quiz');
const Subject = require('../models/Subject');

// @desc    Create a new quiz
// @route   POST /api/admin/quizzes
// @access  Admin
const createQuiz = async (req, res) => {
    try {
        const { title, subjectId, topicName, description, questions, timeLimit, difficulty, passingScore } = req.body;

        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const quiz = await Quiz.create({
            title,
            subjectId,
            topicName,
            description,
            questions,
            timeLimit,
            difficulty,
            passingScore,
            addedBy: req.admin._id
        });

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get quizzes by subject
// @route   GET /api/admin/quizzes/:subjectId
// @access  Admin/Private
const getQuizzesBySubject = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ subjectId: req.params.subjectId })
            .sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete quiz
// @route   DELETE /api/admin/quizzes/:id
// @access  Admin
const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        await quiz.deleteOne();
        res.json({ message: 'Quiz removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createQuiz,
    getQuizzesBySubject,
    deleteQuiz
};
