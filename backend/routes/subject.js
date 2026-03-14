const express = require('express');
const router = express.Router();
const { getUserSubjects } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Students can only view the curriculum
router.get('/', getUserSubjects);

module.exports = router;
