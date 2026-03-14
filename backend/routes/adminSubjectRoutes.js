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
const { protectAdmin } = require('../middleware/authMiddleware');

router.use(protectAdmin);

router.get('/', getUserSubjects);
router.post('/', createSubject);
router.delete('/:id', deleteSubject);
router.post('/:id/topic', addTopicToSubject);
router.delete('/:id/topic/:topicId', deleteTopic);
router.post('/:id/subtopic', addSubtopicToTopic);
router.delete('/:id/topic/:topicId/subtopic', deleteSubtopic);

module.exports = router;
