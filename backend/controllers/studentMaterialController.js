const Material = require('../models/Material');
const Subject = require('../models/Subject');

// @desc    Get materials for student based on department and semester
// @route   GET /api/materials/student
// @access  Private (Student)
const getStudentMaterials = async (req, res) => {
    try {
        const { department, semester } = req.user;

        // 1. Find all subjects matching the student's department and semester
        const subjects = await Subject.find({ department, semester }).select('_id subjectName courseCode');
        
        if (!subjects || subjects.length === 0) {
            return res.status(200).json([]); // No subjects, hence no materials
        }

        const subjectIds = subjects.map(sub => sub._id);

        // 2. Find materials mapped to these subjects
        const materials = await Material.find({ subjectId: { $in: subjectIds } })
            .populate('subjectId', 'subjectName courseCode')
            .sort({ createdAt: -1 });

        res.status(200).json(materials);
    } catch (error) {
        console.error('Error fetching student materials:', error);
        res.status(500).json({ message: 'Server error while fetching materials.' });
    }
};

module.exports = {
    getStudentMaterials
};
