const Flashcard = require('../models/Flashcard');
const Subject = require('../models/Subject');
const axios = require('axios');


const createFlashcard = async (req, res) => {
    const { subjectId, question, answer, difficulty } = req.body;
    try {
        const flashcard = await Flashcard.create({
            userId: req.user._id,
            subjectId,
            question,
            answer,
            difficulty: difficulty || 'medium'
        });
        res.status(201).json(flashcard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFlashcardsBySubject = async (req, res) => {
    const { subjectId } = req.params;
    try {
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            subjectId
        }).sort('nextReviewDate');
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFlashcardDifficulty = async (req, res) => {
    const { id } = req.params;
    const { difficulty } = req.body;

    // Simple Spaced Repetition Logic
    let daysToAdd = 1;
    if (difficulty === 'easy') daysToAdd = 7;
    else if (difficulty === 'medium') daysToAdd = 3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysToAdd);

    try {
        const flashcard = await Flashcard.findById(id);
        if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });

        flashcard.difficulty = difficulty;
        flashcard.nextReviewDate = nextReview;
        await flashcard.save();

        res.json(flashcard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFlashcard = async (req, res) => {
    const { id } = req.params;
    try {
        await Flashcard.findByIdAndDelete(id);
        res.json({ message: 'Flashcard deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateAIFlashcards = async (req, res) => {
    const { subjectId } = req.params;
    try {
        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const topics = subject.topics.map(t => t.name);

        // Call Python AI Service
        const aiResponse = await axios.post('http://localhost:8000/api/generate-flashcards', {
            subject: subject.name,
            topics: topics
        });

        const generatedCards = aiResponse.data.flashcards;

        if (!generatedCards || generatedCards.length === 0) {
            return res.status(500).json({ message: 'AI failed to generate cards' });
        }

        // Prepare cards for bulk insertion
        const cardsToInsert = generatedCards.map(card => ({
            userId: req.user._id,
            subjectId,
            question: card.question,
            answer: card.answer,
            difficulty: 'medium'
        }));

        const savedCards = await Flashcard.insertMany(cardsToInsert);
        res.status(201).json(savedCards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFlashcard,
    getFlashcardsBySubject,
    updateFlashcardDifficulty,
    deleteFlashcard,
    generateAIFlashcards
};

