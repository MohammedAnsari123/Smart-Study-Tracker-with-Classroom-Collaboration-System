const StudySession = require('../models/StudySession');

const logStudySession = async (req, res) => {
    const { subject, topic, subtopic, durationMinutes, focusScore, notes, sessionDate } = req.body;

    try {
        const session = await StudySession.create({
            userId: req.user._id,
            subject,
            topic,
            subtopic,
            durationMinutes,
            focusScore,
            notes,
            sessionDate: sessionDate || Date.now(),
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserStudySessions = async (req, res) => {
    try {
        const sessions = await StudySession.find({ userId: req.user._id }).sort('-sessionDate');
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudyStats = async (req, res) => {
    try {
        const sessions = await StudySession.find({ userId: req.user._id });

        if (!sessions.length) {
            return res.json({
                totalDuration: 0,
                averageFocus: 0,
                productivityScore: 0,
                subjectDistribution: {},
                weeklyConsistency: [],
                focusTrend: [],
                subjectMastery: []
            });
        }

        const totalDuration = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
        const averageFocus = sessions.reduce((acc, curr) => acc + curr.focusScore, 0) / sessions.length;
        const productivityScore = ((totalDuration / 60) * averageFocus).toFixed(2);

        // 1. Subject Distribution (Pie Chart)
        const subjectDistribution = {};
        sessions.forEach(s => {
            subjectDistribution[s.subject] = (subjectDistribution[s.subject] || 0) + s.durationMinutes;
        });

        // 2. Weekly Consistency (Bar Chart) - Minutes per day for last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);
            return d;
        }).reverse();

        const weeklyConsistency = last7Days.map(date => {
            const daySessions = sessions.filter(s => {
                const sDate = new Date(s.sessionDate);
                sDate.setHours(0, 0, 0, 0);
                return sDate.getTime() === date.getTime();
            });
            return {
                day: date.toLocaleDateString(undefined, { weekday: 'short' }),
                minutes: daySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0)
            };
        });

        // 3. Focus Trend (Line/Area Chart) - Focus score over sessions
        const focusTrend = sessions.slice(-10).map(s => ({
            date: new Date(s.sessionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            focus: s.focusScore
        }));

        // 4. Subject Mastery (Radar Chart) - Avg Focus per subject
        const subjectMasteryObj = {};
        sessions.forEach(s => {
            if (!subjectMasteryObj[s.subject]) {
                subjectMasteryObj[s.subject] = { sum: 0, count: 0 };
            }
            subjectMasteryObj[s.subject].sum += s.focusScore;
            subjectMasteryObj[s.subject].count += 1;
        });

        const subjectMastery = Object.keys(subjectMasteryObj).map(key => ({
            subject: key,
            score: (subjectMasteryObj[key].sum / subjectMasteryObj[key].count).toFixed(1)
        }));

        res.json({
            totalDuration,
            averageFocus: averageFocus.toFixed(1),
            productivityScore,
            totalSessions: sessions.length,
            subjectDistribution,
            weeklyConsistency,
            focusTrend,
            subjectMastery
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { logStudySession, getUserStudySessions, getStudyStats };
