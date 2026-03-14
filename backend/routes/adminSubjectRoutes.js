const express = require('express');
const router = express.Router();
const {
    createSubject,
    bulkImportSubjects,
    getAllSubjects,
    addTopicToSubject,
    addSubtopicToTopic,
    deleteSubject,
    deleteTopic,
    deleteSubtopic
} = require('../controllers/subjectController');
const { createDepartment, getDepartments, deleteDepartment } = require('../controllers/departmentController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.use(protectAdmin);

// Subject CRUD
router.get('/', getAllSubjects);
router.post('/', createSubject);
router.post('/bulk-import', bulkImportSubjects);
router.delete('/:id', deleteSubject);
router.post('/:id/topic', addTopicToSubject);
router.delete('/:id/topic/:topicId', deleteTopic);
router.post('/:id/subtopic', addSubtopicToTopic);
router.delete('/:id/topic/:topicId/subtopic', deleteSubtopic);

// Department CRUD (admin manages departments)
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.delete('/departments/:id', deleteDepartment);

module.exports = router;
