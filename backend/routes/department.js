const express = require('express');
const router = express.Router();
const { getDepartments } = require('../controllers/departmentController');

// Public route - no auth required (used on registration page)
router.get('/', getDepartments);

module.exports = router;
