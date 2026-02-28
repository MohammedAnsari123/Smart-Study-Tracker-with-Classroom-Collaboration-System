const express = require('express');
const router = express.Router();
const {
    createSubject,
    getUserSubjects,
    addTopicToSubject,
    addSubtopicToTopic,
    deleteSubject,
    deleteTopic,
    deleteSubtopic
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createSubject);
router.get('/', getUserSubjects);
router.delete('/:id', deleteSubject);
router.post('/:id/topic', addTopicToSubject);
router.delete('/:id/topic/:topicId', deleteTopic);
router.post('/:id/subtopic', addSubtopicToTopic);
router.delete('/:id/topic/:topicId/subtopic', deleteSubtopic);

module.exports = router;
