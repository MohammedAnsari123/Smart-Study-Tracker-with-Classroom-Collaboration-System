const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    getSystemStats,
    getAllUsers,
    deleteUser,
    getStudentPerformance,
    getAllClassrooms
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protectAdmin, getAdminProfile);

// System Stats & User Management
router.get('/stats', protectAdmin, getSystemStats);
router.get('/performance', protectAdmin, getStudentPerformance);
router.get('/users', protectAdmin, getAllUsers);
router.delete('/users/:id', protectAdmin, deleteUser);
router.get('/classrooms', protectAdmin, getAllClassrooms);

// Admin Management
router.use('/subject', require('./adminSubjectRoutes'));
router.use('/materials', require('./adminMaterialRoutes'));

module.exports = router;
