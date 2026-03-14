const Subject = require('../models/Subject');

// Create a subject (admin)
const createSubject = async (req, res) => {
    try {
        const { department, semester, courseCode, subjectName } = req.body;
        if (!department || !semester || !courseCode || !subjectName) {
            return res.status(400).json({ message: 'department, semester, courseCode, and subjectName are required' });
        }
        const subject = await Subject.create({
            department: department.toUpperCase(),
            semester,
            courseCode,
            subjectName,
            topics: []
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bulk import subjects from JSON (admin)
const bulkImportSubjects = async (req, res) => {
    try {
        const { subjects } = req.body; // Array of subject objects

        if (!Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of subjects' });
        }

        const results = [];
        for (const sub of subjects) {
            if (!sub.department || !sub.semester || !sub.courseCode || !sub.subjectName) {
                continue; // Skip invalid entries
            }
            const created = await Subject.create({
                department: sub.department.toUpperCase(),
                semester: sub.semester,
                courseCode: sub.courseCode,
                subjectName: sub.subjectName,
                topics: sub.topics || []
            });
            results.push(created);
        }

        res.status(201).json({ message: `${results.length} subjects imported successfully`, subjects: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get subjects — for students: auto-filter by user's dept/semester. Supports query params for admin.
const getUserSubjects = async (req, res) => {
    try {
        const filter = {};

        // If query params are provided (admin filtering), use them
        if (req.query.department) filter.department = req.query.department.toUpperCase();
        if (req.query.semester) filter.semester = Number(req.query.semester);

        // If no query params and user is a student, auto-filter by their profile
        if (!req.query.department && !req.query.semester && req.user && req.user.department) {
            filter.department = req.user.department;
            filter.semester = req.user.semester;
        }

        const subjects = await Subject.find(filter).sort('subjectName');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get ALL subjects (admin — no filtering)
const getAllSubjects = async (req, res) => {
    try {
        const filter = {};
        if (req.query.department) filter.department = req.query.department.toUpperCase();
        if (req.query.semester) filter.semester = Number(req.query.semester);

        const subjects = await Subject.find(filter).sort('department semester subjectName');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addTopicToSubject = async (req, res) => {
    try {
        const { topicName } = req.body;
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { topics: { topicName, subtopics: [] } } },
            { new: true }
        );
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addSubtopicToTopic = async (req, res) => {
    try {
        const { topicId, subtopicName } = req.body;
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id, "topics._id": topicId },
            { $push: { "topics.$.subtopics": subtopicName } },
            { new: true }
        );
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({ _id: req.params.id });
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { topics: { _id: topicId } } },
            { new: true }
        );
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubtopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { subtopicName } = req.body;
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id, "topics._id": topicId },
            { $pull: { "topics.$.subtopics": subtopicName } },
            { new: true }
        );
        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubject,
    bulkImportSubjects,
    getUserSubjects,
    getAllSubjects,
    addTopicToSubject,
    addSubtopicToTopic,
    deleteSubject,
    deleteTopic,
    deleteSubtopic
};
