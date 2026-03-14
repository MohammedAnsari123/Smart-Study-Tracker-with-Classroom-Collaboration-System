const Material = require('../models/Material');
const Subject = require('../models/Subject');

// @desc    Add study material
// @route   POST /api/admin/materials
// @access  Admin
const addMaterial = async (req, res) => {
    try {
        const { title, description, type, url, subjectId, topicName } = req.body;

        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const material = await Material.create({
            title,
            description,
            type,
            url,
            subjectId,
            topicName,
            addedBy: req.admin._id
        });

        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get materials by subject
// @route   GET /api/admin/materials/:subjectId
// @access  Admin/Private
const getMaterialsBySubject = async (req, res) => {
    try {
        const materials = await Material.find({ subjectId: req.params.subjectId })
            .sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete material
// @route   DELETE /api/admin/materials/:id
// @access  Admin
const deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });

        await material.deleteOne();
        res.json({ message: 'Material removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addMaterial,
    getMaterialsBySubject,
    deleteMaterial
};
