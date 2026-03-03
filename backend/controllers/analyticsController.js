const StudySession = require('../models/StudySession');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const ClassMember = require('../models/ClassMember');
const Flashcard = require('../models/Flashcard');
const { analyzeWeaknesses } = require('../utils/ai');

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

        // Subject Mastery (Average Focus per subject)
        const subjectMastery = Object.keys(subjectDistribution).map(subject => {
            const subjectSessions = sessions.filter(s => s.subject === subject);
            const avgFocus = subjectSessions.reduce((sum, s) => sum + s.focusScore, 0) / subjectSessions.length;
            return {
                subject,
                score: parseFloat(avgFocus.toFixed(1))
            };
        });

        // Weekly Consistency (Last 7 days)
        const weeklyConsistency = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dayName = days[d.getDay()];
            const dayMinutes = sessions
                .filter(s => new Date(s.sessionDate).toDateString() === d.toDateString())
                .reduce((sum, s) => sum + s.durationMinutes, 0);

            weeklyConsistency.push({
                day: dayName,
                minutes: dayMinutes
            });
        }

        res.json({
            totalDuration: totalDuration, // Frontend expects this for 'Total Time'
            totalStudyHours,
            averageFocus: averageFocusScore.toFixed(1), // Frontend expects averageFocus
            productivityScore,
            subjectDistribution,
            subjectMastery,
            weeklyConsistency
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

const getWeaknessDetectionData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all relevant data for the AI engine
        const [sessions, flashcards, submissions] = await Promise.all([
            StudySession.find({ userId }).sort('-createdAt').limit(50),
            Flashcard.find({ userId }),
            Submission.find({ userId, marks: { $ne: null } }).populate('assignmentId')
        ]);

        // Format data for simple AI consumption
        const formattedSessions = sessions.map(s => ({
            subject: s.subject,
            topic: s.topic,
            duration: s.durationMinutes,
            focus: s.focusScore,
            distractions: s.distractionsCount || 0
        }));

        const formattedFlashcards = flashcards.map(f => ({
            subjectId: f.subjectId,
            question: f.question,
            difficulty: f.difficulty
        }));

        const formattedSubmissions = submissions.map(sub => ({
            title: sub.assignmentId?.title,
            marks: sub.marks,
            maxMarks: sub.assignmentId?.maxMarks
        }));

        res.json({
            sessions: formattedSessions,
            flashcards: formattedFlashcards,
            submissions: formattedSubmissions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWeaknessReport = async (req, res) => {
    try {
        const userId = req.user._id;
        const { subject } = req.query;

        if (!subject) {
            return res.status(400).json({ message: "Please select a subject for weakness analysis." });
        }

        // 1. Fetch study time for this specific subject
        const sessions = await StudySession.find({ userId, subject });
        const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

        if (totalMinutes < 60) {
            return res.json({
                thresholdMet: false,
                minutesNeeded: 60 - totalMinutes,
                message: `You need at least 60 minutes of study for ${subject} to unlock AI analysis. Currently at ${totalMinutes} minutes.`
            });
        }

        // 2. Fetch other relevant data for this subject
        const [flashcards, submissions] = await Promise.all([
            Flashcard.find({ userId, subject }), // Assuming Flashcard model has subject field or linked via subjectId
            Submission.find({ userId, marks: { $ne: null } }).populate({
                path: 'assignmentId',
                match: { subject: subject }
            })
        ]);

        const filteredSubmissions = submissions.filter(s => s.assignmentId !== null);

        const studyData = {
            subject,
            thresholdMet: true,
            sessions: sessions.map(s => ({
                topic: s.topic,
                duration: s.durationMinutes,
                focus: s.focusScore
            })),
            flashcards: flashcards.map(f => ({
                question: f.question,
                difficulty: f.difficulty
            })),
            submissions: filteredSubmissions.map(sub => ({
                title: sub.assignmentId?.title,
                marks: sub.marks,
                maxMarks: sub.assignmentId?.maxMarks
            }))
        };

        // 3. Call AI Service
        const report = await analyzeWeaknesses(studyData);

        res.json({
            ...report,
            thresholdMet: true,
            subjectStudyTime: totalMinutes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getTimeOptimizationData = async (req, res) => {
    try {
        const userId = req.user._id;
        const sessions = await StudySession.find({ userId });

        // Group by hour of day (0-23)
        const hourlyStats = {};
        for (let i = 0; i < 24; i++) hourlyStats[i] = { totalFocus: 0, count: 0 };

        sessions.forEach(session => {
            const hour = new Date(session.sessionDate).getHours();
            hourlyStats[hour].totalFocus += session.focusScore;
            hourlyStats[hour].count += 1;
        });

        const recommendations = Object.keys(hourlyStats).map(hour => ({
            hour: parseInt(hour),
            avgFocus: hourlyStats[hour].count > 0 ? (hourlyStats[hour].totalFocus / hourlyStats[hour].count).toFixed(1) : 0
        })).filter(h => h.avgFocus > 0);

        // Find best hour
        const bestHour = recommendations.reduce((prev, current) =>
            (parseFloat(current.avgFocus) > parseFloat(prev?.avgFocus || 0)) ? current : prev
            , { hour: 'N/A', avgFocus: 0 });

        res.json({
            hourlyAnalysis: recommendations,
            bestHour: bestHour.hour,
            bestFocus: bestHour.avgFocus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAssignmentRisk = async (req, res) => {
    try {
        const userId = req.user._id;
        const assignments = await Assignment.find({
            userId,
            status: { $ne: 'done' },
            deadline: { $gte: new Date() }
        });

        const sessions = await StudySession.find({ userId });

        // Calculate subject difficulty based on focus scores (inverse: low focus = high difficulty)
        const subjectStats = {};
        sessions.forEach(s => {
            if (!subjectStats[s.subject]) subjectStats[s.subject] = { totalFocus: 0, count: 0 };
            subjectStats[s.subject].totalFocus += s.focusScore;
            subjectStats[s.subject].count += 1;
        });

        const risks = assignments.map(a => {
            const dueDate = new Date(a.deadline);
            const today = new Date();
            const timeDiff = dueDate - today;
            const daysLeft = Math.max(timeDiff / (1000 * 60 * 60 * 24), 0.1);

            const stats = subjectStats[a.subject];
            const avgFocus = stats ? stats.totalFocus / stats.count : 3; // default medium difficulty
            const difficultyScale = (6 - avgFocus); // Low focus (1) -> 5 (Hard), High focus (5) -> 1 (Easy)

            const riskScore = (difficultyScale / daysLeft) * 10;

            let riskLevel = 'Low';
            if (riskScore > 15) riskLevel = 'High';
            else if (riskScore > 7) riskLevel = 'Medium';

            return {
                id: a._id,
                title: a.title,
                subject: a.subject,
                dueDate: a.deadline,
                daysLeft: Math.round(daysLeft),
                riskLevel,
                riskScore: Math.round(riskScore)
            };
        });

        res.json(risks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHeatmapData = async (req, res) => {
    try {
        const userId = req.user._id;
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const sessions = await StudySession.find({
            userId,
            sessionDate: { $gte: oneYearAgo }
        });

        const dailyStats = {};

        sessions.forEach(session => {
            const dateStr = new Date(session.sessionDate).toISOString().split('T')[0];
            if (!dailyStats[dateStr]) {
                dailyStats[dateStr] = {
                    date: dateStr,
                    minutes: 0,
                    totalFocus: 0,
                    count: 0
                };
            }
            dailyStats[dateStr].minutes += session.durationMinutes;
            dailyStats[dateStr].totalFocus += session.focusScore;
            dailyStats[dateStr].count += 1;
        });

        const heatmapData = Object.values(dailyStats).map(day => ({
            date: day.date,
            minutes: day.minutes,
            intensity: Math.min(Math.ceil(day.minutes / 60), 4), // Level 1-4 based on hours
            avgFocus: (day.totalFocus / day.count).toFixed(1)
        }));

        res.json(heatmapData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBurnoutAnalysis = async (req, res) => {
    try {
        const userId = req.user._id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const sessions = await StudySession.find({
            userId,
            sessionDate: { $gte: sevenDaysAgo }
        }).sort({ sessionDate: 1 });

        if (sessions.length < 3) {
            return res.json({
                riskLevel: 'Low',
                message: 'Keep going! More data needed for detailed fatigue analysis.'
            });
        }

        const totalHours = sessions.reduce((sum, s) => sum + (s.durationMinutes / 60), 0);
        const avgFocus = sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length;

        // Check for declining focus trend
        const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2));
        const secondHalf = sessions.slice(Math.floor(sessions.length / 2));
        const focus1 = firstHalf.reduce((sum, s) => sum + s.focusScore, 0) / firstHalf.length;
        const focus2 = secondHalf.reduce((sum, s) => sum + s.focusScore, 0) / secondHalf.length;
        const focusDecline = focus1 - focus2;

        let riskLevel = 'Low';
        let message = 'Your study balance looks healthy. Keep it up!';

        if (totalHours > 40 || (focusDecline > 1 && totalHours > 20)) {
            riskLevel = 'High';
            message = 'Fatigue detected. We recommend taking a 24-hour break to reset.';
        } else if (totalHours > 25 || focusDecline > 0.5) {
            riskLevel = 'Medium';
            message = 'Consistency is good, but focus is slipping. Try a shorter Pomodoro session.';
        }

        res.json({
            riskLevel,
            message,
            stats: {
                weeklyHours: totalHours.toFixed(1),
                avgFocus: avgFocus.toFixed(1),
                focusTrend: focusDecline > 0 ? 'Declining' : 'Stable'
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getPersonalAnalytics,
    getClassroomAnalytics,
    getWeaknessDetectionData,
    getWeaknessReport,
    getTimeOptimizationData,
    getAssignmentRisk,
    getHeatmapData,
    getBurnoutAnalysis
};
