const StudySession = require('../models/StudySession');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const ClassMember = require('../models/ClassMember');

const getPersonalAnalytics = async (req, res) => {
    try {
        const sessions = await StudySession.find({ userId: req.user._id });

        if (!sessions.length) {
            return res.json({
                totalStudyHours: 0,
                averageFocusScore: 0,
                productivityScore: 0,
                subjectDistribution: {},
                bestStudyDay: 'N/A'
            });
        }

        const totalDuration = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
        const averageFocusScore = sessions.reduce((sum, session) => sum + session.focusScore, 0) / sessions.length;

        // Calculate productivity score
        const totalStudyHours = (totalDuration / 60).toFixed(2);
        const productivityScore = (totalStudyHours * averageFocusScore).toFixed(2);

        // Subject distribution
        const subjectDistribution = {};
        sessions.forEach(session => {
            subjectDistribution[session.subject] = (subjectDistribution[session.subject] || 0) + session.durationMinutes;
        });

        res.json({
            totalStudyHours,
            averageFocusScore: averageFocusScore.toFixed(1),
            productivityScore,
            subjectDistribution,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getClassroomAnalytics = async (req, res) => {
    const classId = req.params.id; // From ownerMiddleware

    try {
        const students = await ClassMember.countDocuments({ classId, membershipStatus: 'active' }) - 1; // Exclude owner
        const assignments = await Assignment.find({ classId });

        let totalSubmissions = 0;
        let lateSubmissions = 0;
        const assignmentStats = [];

        for (let assignment of assignments) {
            const subs = await Submission.find({ assignmentId: assignment._id });
            totalSubmissions += subs.length;
            lateSubmissions += subs.filter(s => s.submissionStatus === 'late').length;

            const totalPossibleSubmissions = students > 0 ? students : 0;
            const submissionPercentage = totalPossibleSubmissions > 0 ? ((subs.length / totalPossibleSubmissions) * 100).toFixed(1) : 0;

            assignmentStats.push({
                title: assignment.title,
                submissionCount: subs.length,
                submissionPercentage,
                lateCount: subs.filter(s => s.submissionStatus === 'late').length
            });
        }

        const overallCompletionRate = assignments.length > 0 && students > 0
            ? ((totalSubmissions / (assignments.length * students)) * 100).toFixed(1) : 0;

        res.json({
            totalStudents: students,
            totalAssignments: assignments.length,
            overallCompletionRate,
            lateSubmissions,
            assignmentStats
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPersonalAnalytics, getClassroomAnalytics };
