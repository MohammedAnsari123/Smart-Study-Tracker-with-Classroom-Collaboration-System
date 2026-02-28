const Subject = require('../models/Subject');

const createSubject = async (req, res) => {
    try {
        const { name } = req.body;
        const subject = await Subject.create({
            userId: req.user._id,
            name,
            topics: []
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.user._id });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addTopicToSubject = async (req, res) => {
    try {
        const { topicName } = req.body;
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { $push: { topics: { name: topicName, subtopics: [] } } },
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
            { _id: req.params.id, userId: req.user._id, "topics._id": topicId },
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
        const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
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
            { _id: req.params.id, userId: req.user._id },
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
            { _id: req.params.id, userId: req.user._id, "topics._id": topicId },
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
    getUserSubjects,
    addTopicToSubject,
    addSubtopicToTopic,
    deleteSubject,
    deleteTopic,
    deleteSubtopic
};
