const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "CO"
    fullName: { type: String, required: true }, // e.g. "Computer Engineering"
    semesters: [{ type: Number }] // e.g. [1, 2, 3, 4, 5, 6]
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
