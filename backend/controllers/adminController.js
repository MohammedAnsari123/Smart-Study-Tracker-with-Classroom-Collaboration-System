const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            name,
            email,
            password
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select('-password');
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSystemStats = async (req, res) => {
    try {
        const User = require('../models/User');
        const Classroom = require('../models/Classroom');
        const Subject = require('../models/Subject');

        const totalUsers = await User.countDocuments();
        const totalClassrooms = await Classroom.countDocuments();
        const totalSubjects = await Subject.countDocuments();

        res.json({
            totalUsers,
            totalClassrooms,
            totalSubjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const User = require('../models/User');
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.params.id);

        if (user) {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    registerAdmin, 
    loginAdmin, 
    getAdminProfile,
    getSystemStats,
    getAllUsers,
    deleteUser
};
