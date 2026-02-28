const express = require('express');
const router = express.Router();
const {
    createClassroom,
    joinClassroom,
    getUserClassrooms,
    getClassroomDetails,
    deleteClassroom,
    removeMember
} = require('../controllers/classroomController');
const { protect } = require('../middleware/authMiddleware');
const { requireOwner } = require('../middleware/ownerMiddleware');

router.post('/create', protect, createClassroom);
router.post('/join', protect, joinClassroom);
router.get('/', protect, getUserClassrooms);
router.get('/:id', protect, getClassroomDetails);
router.delete('/:id', protect, requireOwner, deleteClassroom);
router.post('/:id/remove', protect, requireOwner, removeMember);

module.exports = router;
