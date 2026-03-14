const express = require('express');
const router = express.Router();
const { 
    registerAdmin, 
    loginAdmin, 
    getAdminProfile,
    getSystemStats,
    getAllUsers,
    deleteUser
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protectAdmin, getAdminProfile);

// System Stats & User Management
router.get('/stats', protectAdmin, getSystemStats);
router.get('/users', protectAdmin, getAllUsers);
router.delete('/users/:id', protectAdmin, deleteUser);

// Admin Curriculum Management
router.use('/subject', require('./adminSubjectRoutes'));

module.exports = router;
