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
        const Assignment = require('../models/Assignment');

        const [totalUsers, totalClassrooms, subjects, totalAssignments] = await Promise.all([
            User.countDocuments(),
            Classroom.countDocuments(),
            Subject.find({}),
            Assignment.countDocuments()
        ]);

        const totalTopics = subjects.reduce((acc, sub) => acc + (sub.topics?.length || 0), 0);
        
        // Active today (last 24 hours)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const activeToday = await User.countDocuments({ lastLogin: { $gte: dayAgo } });

        // --- Real-time Analytics for Charts ---
        
        // 1. Enrollment Trend (Last 7 Days)
        const enrollmentTrend = [];
        for (let i = 6; i >= 0; i--) {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() - i);
            
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            
            const count = await User.countDocuments({ 
                createdAt: { $gte: start, $lt: end },
                role: 'student'
            });
            
            enrollmentTrend.push({
                name: start.toLocaleDateString('en-US', { weekday: 'short' }),
                students: count
            });
        }

        // 2. Subject Distribution per Department
        const depts = [...new Set(subjects.map(s => s.department))];
        const subjectDistribution = depts.map(dept => {
            const count = subjects.filter(s => s.department === dept).length;
            const colors = ['#EF4444', '#F97316', '#F43F5E', '#DC2626', '#B91C1C'];
            return {
                name: dept,
                count: Math.round((count / subjects.length) * 100),
                color: colors[depts.indexOf(dept) % colors.length]
            };
        });

        res.json({
            totalUsers,
            totalClassrooms,
            totalSubjects: subjects.length,
            totalTopics,
            totalAssignments,
            activeToday,
            enrollmentTrend,
            subjectDistribution
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



// @desc    Get detailed student performance analytics
// @route   GET /api/admin/performance
// @access  Admin
const getStudentPerformance = async (req, res) => {
    try {
        const StudySession = require('../models/StudySession');
        const Submission = require('../models/Submission');
        const User = require('../models/User');

        // Get test scores from study sessions
        const testScores = await StudySession.aggregate([
            { $match: { testScore: { $exists: true, $ne: null } } },
            { $group: {
                _id: '$userId',
                avgTestScore: { $avg: '$testScore' },
                totalTests: { $sum: 1 }
            }}
        ]);

        // Get assignment marks from submissions
        const assignmentMarks = await Submission.aggregate([
            { $match: { marks: { $exists: true, $ne: null } } },
            { $group: {
                _id: '$userId',
                avgAssignmentMarks: { $avg: '$marks' },
                totalAssignments: { $sum: 1 }
            }}
        ]);

        // Merge and enrich with user data
        const users = await User.find({ role: 'student' }).select('name email department semester');

        const performanceData = users.map(user => {
            const tScore = testScores.find(s => s._id.toString() === user._id.toString());
            const aMarks = assignmentMarks.find(m => m._id.toString() === user._id.toString());

            // Calculate overall Academic Focus Score (out of 100)
            const baseTest = tScore ? tScore.avgTestScore : 0;
            const baseAssign = aMarks ? aMarks.avgAssignmentMarks : 0;

            let academicFocus;
            if (tScore && aMarks) academicFocus = (baseTest + baseAssign) / 2;
            else if (tScore) academicFocus = baseTest;
            else if (aMarks) academicFocus = baseAssign;
            else academicFocus = 0;

            return {
                userId: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                semester: user.semester,
                avgTestScore: tScore ? tScore.avgTestScore.toFixed(1) : 'N/A',
                avgAssignmentMarks: aMarks ? aMarks.avgAssignmentMarks.toFixed(1) : 'N/A',
                totalTests: tScore ? tScore.totalTests : 0,
                totalAssignments: aMarks ? aMarks.totalAssignments : 0,
                academicFocus: academicFocus.toFixed(1)
            };
        });

        res.json(performanceData);
    } catch (error) {
        console.error('Error in getStudentPerformance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllClassrooms = async (req, res) => {
    try {
        const Classroom = require('../models/Classroom');
        const classrooms = await Classroom.find({}).populate('ownerId', 'name email').sort({ createdAt: -1 });
        res.json(classrooms);
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
    deleteUser,
    getStudentPerformance,
    getAllClassrooms
};
