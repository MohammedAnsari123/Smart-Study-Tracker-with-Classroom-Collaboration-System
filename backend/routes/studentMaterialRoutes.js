const express = require('express');
const router = express.Router();
const { getStudentMaterials } = require('../controllers/studentMaterialController');
const { protect } = require('../middleware/authMiddleware');

// Route is mounted at /api/materials/student
router.get('/student', protect, getStudentMaterials);

module.exports = router;
