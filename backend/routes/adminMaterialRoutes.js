const express = require('express');
const router = express.Router();
const { 
    addMaterial,
    getMaterialsBySubject,
    deleteMaterial
} = require('../controllers/materialController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/', protectAdmin, addMaterial);
router.get('/:subjectId', protectAdmin, getMaterialsBySubject);
router.delete('/:id', protectAdmin, deleteMaterial);

module.exports = router;
