const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const Department = require('../models/Department');
const Subject = require('../models/Subject');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const departmentsData = require('./departments.json');
const subjectsData = require('./subjects.json');

const seed = async () => {
    try {
        await connectDB();

        // --- Seed Departments ---
        console.log('\n🏫 Seeding Departments...');
        await Department.deleteMany({});
        const deptResults = await Department.insertMany(departmentsData);
        console.log(`   ✅ Inserted ${deptResults.length} departments`);

        // --- Seed Subjects ---
        console.log('\n📚 Seeding Subjects...');
        await Subject.deleteMany({});
        const subResults = await Subject.insertMany(subjectsData);
        console.log(`   ✅ Inserted ${subResults.length} subjects`);

        // --- Summary ---
        console.log('\n========================================');
        console.log('🎉 Seed completed successfully!');
        console.log('========================================');
        for (const dept of deptResults) {
            const count = subResults.filter(s => s.department === dept.name).length;
            console.log(`   ${dept.name} (${dept.fullName}): ${count} subjects`);
        }
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seed();
