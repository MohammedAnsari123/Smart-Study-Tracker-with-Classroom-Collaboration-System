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

        // Build detailed 5-level syllabus tree
        let syllabusContext = `SUBJECT: ${subject.subjectName} (${subject.courseCode || 'N/A'})\n`;
        let topics = [];
        
        if (subject.chapters) {
            subject.chapters.forEach(chap => {
                syllabusContext += `Chapter: ${chap.chapterName}\n`;
                chap.topics?.forEach(top => {
                    topics.push(top.topicName);
                    syllabusContext += `  - Topic: ${top.topicName}\n`;
                    top.subtopics?.forEach(sub => {
                        syllabusContext += `    - Subtopic: ${sub.name}\n`;
                        if (sub.details) syllabusContext += `      Content/Details: ${sub.details}\n`;
                    });
                });
            });
        }

        console.log(`Generating flashcards for Subject: ${subject.subjectName} using detailed curriculum context.`);

        // Call Python AI Service
        const aiResponse = await axios.post('http://127.0.0.1:8000/api/generate-flashcards', {
            subject: subject.subjectName,
            topics: topics,
            syllabus_context: syllabusContext
        });

        console.log('AI Service Response status:', aiResponse.status);
        const generatedCards = aiResponse.data.flashcards;
        console.log(`AI generated ${generatedCards?.length || 0} cards`);

        if (!generatedCards || generatedCards.length === 0) {
            console.error('AI failed to generate cards or returned empty array');
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
        console.log(`Successfully saved ${savedCards.length} flashcards to DB`);
        res.status(201).json(savedCards);
    } catch (error) {
        console.error('Flashcard Generation Error:', error.message);
        if (error.response) {
            console.error('AI Service Error Data:', error.response.data);
        }
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

