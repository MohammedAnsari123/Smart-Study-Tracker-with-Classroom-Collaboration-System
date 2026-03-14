const Department = require('../models/Department');

// Get all departments (public - no auth needed for registration page)
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}).sort('name');
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a department (admin only)
const createDepartment = async (req, res) => {
    try {
        const { name, fullName, semesters } = req.body;

        const exists = await Department.findOne({ name: name.toUpperCase() });
        if (exists) return res.status(400).json({ message: 'Department already exists' });

        const department = await Department.create({
            name: name.toUpperCase(),
            fullName,
            semesters: semesters || [1, 2, 3, 4, 5, 6]
        });
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a department (admin only)
const deleteDepartment = async (req, res) => {
    try {
        const dept = await Department.findByIdAndDelete(req.params.id);
        if (!dept) return res.status(404).json({ message: 'Department not found' });
        res.json({ message: 'Department deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDepartments, createDepartment, deleteDepartment };
