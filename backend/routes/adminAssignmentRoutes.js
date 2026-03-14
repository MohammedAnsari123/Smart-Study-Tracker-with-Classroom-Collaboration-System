const express = require('express');
const router = express.Router();
const { 
    createAdminAssignment,
    getAdminAssignments,
    deleteAdminAssignment
} = require('../controllers/adminAssignmentController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/', protectAdmin, createAdminAssignment);
router.get('/:classId', protectAdmin, getAdminAssignments);
router.delete('/:id', protectAdmin, deleteAdminAssignment);

module.exports = router;
