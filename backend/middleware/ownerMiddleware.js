const Classroom = require('../models/Classroom');

const requireOwner = async (req, res, next) => {
    try {
        // Assuming the classroom ID is either in req.params.id, req.params.classId, or req.body.classId
        const classId = req.query.classId || req.params.classId || req.body.classId || req.params.id;

        if (!classId) {
            return res.status(400).json({ message: 'Classroom ID is required' });
        }

        const classroom = await Classroom.findById(classId);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        if (classroom.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied: You are not the owner of this class' });
        }

        req.classroom = classroom;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { requireOwner };
