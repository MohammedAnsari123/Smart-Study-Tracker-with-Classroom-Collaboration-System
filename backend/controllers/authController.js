const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { fullName, email, password, department, semester } = req.body;

    try {
        if (!department || !semester) {
            return res.status(400).json({ message: 'Department and semester are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            department: department.toUpperCase(),
            semester: Number(semester)
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                department: user.department,
                semester: user.semester,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            user.lastLogin = Date.now();
            await user.save();

            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                department: user.department,
                semester: user.semester,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { department, semester, fullName } = req.body;
        const updateData = {};
        if (department) updateData.department = department.toUpperCase();
        if (semester) updateData.semester = Number(semester);
        if (fullName) updateData.fullName = fullName;

        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            department: user.department,
            semester: user.semester
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
