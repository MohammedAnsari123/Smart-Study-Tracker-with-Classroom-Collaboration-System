import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import LogStudySessionModal from '../components/LogStudySessionModal';
import PomodoroTimer from '../components/PomodoroTimer';
import ConceptHeatmap from '../components/ConceptHeatmap';
import AITestModal from '../components/tracker/AITestModal';

import { TrendingUp, Clock, AlertCircle, PlusCircle, History, Calendar, Star, ChevronRight, BookOpen, Target, Activity, Brain, Zap, CheckCircle } from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState(null);
    const [weaknessReport, setWeaknessReport] = useState(null);
    const [timeOptimization, setTimeOptimization] = useState(null);
    const [assignmentRisks, setAssignmentRisks] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [burnoutRisk, setBurnoutRisk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAI, setLoadingAI] = useState(true);
    const [selectedWeaknessSubject, setSelectedWeaknessSubject] = useState('');
    const [fetchingWeakness, setFetchingWeakness] = useState(false);
    const [currentSessionPage, setCurrentSessionPage] = useState(1);
    const sessionsPerPage = 5;

    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [activeTestSession, setActiveTestSession] = useState(null);

    const fetchStudyData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Stage 1: Fast Core Data
        try {
            const [sessionsRes, statsRes, heatmapRes] = await Promise.all([
                axios.get('http://localhost:5000/study', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/analytics/user', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/analytics/heatmap', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSessions(sessionsRes.data);
            setStats(statsRes.data);
            setHeatmapData(heatmapRes.data);

            // Auto-select first subject if none selected
            if (!selectedWeaknessSubject && statsRes.data.subjectDistribution) {
                const firstSub = Object.keys(statsRes.data.subjectDistribution)[0];
                if (firstSub) {
                    setSelectedWeaknessSubject(firstSub);
                    fetchWeaknessReport(firstSub);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching core data:', error);
            setLoading(false);
        }

        // Stage 2: Heavy AI Data (Background)
        try {
            setLoadingAI(true);
            const [timeRes, riskRes, burnoutRes] = await Promise.all([
                axios.get('http://localhost:5000/analytics/time-optimization', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/analytics/assignment-risk', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/analytics/burnout-analysis', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setTimeOptimization(timeRes.data);
            setAssignmentRisks(riskRes.data);
            setBurnoutRisk(burnoutRes.data);
            setLoadingAI(false);
        } catch (error) {
            console.error('Error fetching AI analytics:', error);
            setLoadingAI(false);
        }
    };

    const fetchWeaknessReport = async (subject) => {
        if (!subject) return;
        const token = localStorage.getItem('token');
        setFetchingWeakness(true);
        try {
            const res = await axios.get(`http://localhost:5000/analytics/weakness-report?subject=${encodeURIComponent(subject)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWeaknessReport(res.data);
        } catch (error) {
            console.error('Error fetching weakness report:', error);
        } finally {
            setFetchingWeakness(false);
        }
    };

    useEffect(() => {
        fetchStudyData();
    }, []);

    const handleSessionLogged = (loggedSessionResponse) => {
        fetchStudyData();
        if (loggedSessionResponse && loggedSessionResponse._id) {
            setActiveTestSession(loggedSessionResponse);
        }
    };

    const handleTestComplete = () => {
        // Run fetch again to get updated sessions array containing the test score
        fetchStudyData(); 
    };

    const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const pieData = stats?.subjectDistribution ?
        Object.keys(stats.subjectDistribution).map((key) => ({
            name: key,
            value: stats.subjectDistribution[key]
        })) : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-darkBg">
                <TopBar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg pb-12">
            <TopBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Left & Middle Column (Main Content) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-darkCard p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    Welcome back, <span className="text-primary-600">{user?.fullName?.split(' ')[0]}</span>
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
                                    Your personal growth and subject mastery tracker.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsLogModalOpen(true)}
                                className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 flex items-center justify-center group"
                            >
                                <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                Log Session
                            </button>
                        </div>

                        {/* Urgent Assignment Alert */}
                        {assignmentRisks.some(r => r.isUrgent) && (
                            <div className="bg-red-600 text-white p-6 rounded-3xl shadow-xl shadow-red-500/20 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-2xl">
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase tracking-widest text-xs opacity-80">Deadline Alert</h3>
                                        <p className="font-bold text-lg">You have assignments due in less than 48 hours!</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        const urgent = assignmentRisks.find(r => r.isUrgent);
                                        if (urgent && urgent.classId) {
                                            navigate(`/class/${urgent.classId}`);
                                        } else {
                                            navigate('/classrooms');
                                        }
                                    }} 
                                    className="px-6 py-3 bg-white text-red-600 rounded-2xl font-black text-sm transition hover:bg-red-50 whitespace-nowrap"
                                >
                                    Review Now
                                </button>
                            </div>
                        )}

                        {/* Top Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: Clock, color: 'text-blue-500', value: `${(stats?.totalDuration / 60 || 0).toFixed(1)}h`, label: 'Total Time' },
                                { icon: Star, color: 'text-yellow-500', value: stats?.averageFocus || 0, label: 'Avg Mastery' },
                                { icon: TrendingUp, color: 'text-primary-500', value: stats?.productivityScore || 0, label: 'Prod. Score' },
                                { icon: Calendar, color: 'text-green-500', value: sessions.length, label: 'Sessions' }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-darkCard p-5 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-[1.02]">
                                    <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                                    <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* AI Weakness Detection */}
                        <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/30">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <h2 className="text-lg font-bold flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" /> AI Weakness Detection
                                </h2>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Subject:</span>
                                    <select
                                        value={selectedWeaknessSubject}
                                        onChange={(e) => {
                                            setSelectedWeaknessSubject(e.target.value);
                                            fetchWeaknessReport(e.target.value);
                                        }}
                                        className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    >
                                        {stats?.subjectDistribution && Object.keys(stats.subjectDistribution).map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {fetchingWeakness || loadingAI ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 dark:bg-slate-800/50 rounded-2xl"></div>)}
                                </div>
                            ) : weaknessReport?.thresholdMet === false ? (
                                <div className="p-10 text-center bg-gray-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4 shadow-sm">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analysis Locked</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                                        AI needs more data to detect patterns reliably. You need <span className="text-primary-600 font-black">{weaknessReport.minutesNeeded} more minutes</span> of study for <span className="text-gray-900 dark:text-white font-black">{selectedWeaknessSubject}</span> to unlock clinical-grade insights.
                                    </p>
                                    <div className="mt-6 w-full max-w-xs mx-auto bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary-600 h-full transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (1 - weaknessReport.minutesNeeded / 60) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : weaknessReport?.weaknesses?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                                    {weaknessReport.weaknesses.map((w, idx) => (
                                        <div key={idx} className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/20 group hover:shadow-lg hover:shadow-red-500/5 transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 dark:bg-red-900/30 text-red-600 px-2 py-0.5 rounded">
                                                    {w.subject}
                                                </span>
                                                <Brain className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{w.topic}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{w.reason}</p>
                                            <div className="pt-3 border-t border-red-100 dark:border-red-900/20">
                                                <p className="text-[10px] font-bold text-red-600 uppercase mb-1 flex items-center gap-1">
                                                    <Zap className="w-3 h-3" /> Recommendation
                                                </p>
                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{w.recommendation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">No significant weaknesses detected in {selectedWeaknessSubject}. Great job!</p>
                                </div>
                            )}
                        </div>

                        {/* Burnout Alert */}
                        {burnoutRisk && burnoutRisk.riskLevel !== 'Low' && (
                            <div className={`p-6 rounded-3xl border flex items-start gap-4 animate-in fade-in zoom-in duration-500 ${burnoutRisk.riskLevel === 'High'
                                ? 'bg-red-50 border-red-100 text-red-800 shadow-lg shadow-red-500/10'
                                : 'bg-orange-50 border-orange-100 text-orange-800 shadow-lg shadow-orange-500/10'
                                }`}>
                                <AlertCircle className={`w-8 h-8 flex-shrink-0 mt-1 ${burnoutRisk.riskLevel === 'High' ? 'text-red-500' : 'text-orange-500'}`} />
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-xs mb-1">Fatigue Warning: {burnoutRisk.riskLevel} Risk</h4>
                                    <p className="text-sm font-medium leading-relaxed">{burnoutRisk.message}</p>
                                    <div className="flex gap-4 mt-3">
                                        <div className="bg-white/50 px-3 py-1 rounded-lg text-[10px] font-bold">WEEKLY: {burnoutRisk.stats.weeklyHours}h</div>
                                        <div className="bg-white/50 px-3 py-1 rounded-lg text-[10px] font-bold">TREND: {burnoutRisk.stats.focusTrend}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <ConceptHeatmap data={heatmapData} />

                        <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold mb-6 flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                                <Activity className="w-5 h-5 mr-2 text-primary-500" /> Weekly Consistency
                            </h2>
                            <div className="h-64 w-full">
                                {stats?.weeklyConsistency?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <BarChart data={stats.weeklyConsistency}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} dy={10} fontSize={10} />
                                            <YAxis axisLine={false} tickLine={false} fontSize={10} />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                            />
                                            <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 italic text-sm font-medium">Start logging sessions to see your consistency!</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-1 space-y-8">
                        <PomodoroTimer onSessionComplete={fetchStudyData} />

                        {/* Optimal Study Time */}
                        <div className="bg-white dark:bg-darkCard p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-sm transition-all hover:scale-[1.01]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center mb-4">
                                <Clock className="w-5 h-5 mr-2 text-blue-500" /> Optimal Study Time
                            </h3>
                            {loadingAI ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-8 w-24 bg-gray-100 dark:bg-slate-800 rounded"></div>
                                    <div className="h-3 w-32 bg-gray-100 dark:bg-slate-800 rounded"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-3xl font-black text-blue-600">
                                                {timeOptimization?.bestHour !== 'N/A' ? `${timeOptimization?.bestHour}:00` : '--:--'}
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium uppercase mt-1">Peek Focus Window</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end text-yellow-500 mb-1">
                                                <Star className="w-4 h-4 fill-current mr-1" />
                                                <span className="font-bold">{timeOptimization?.bestFocus || 0}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Perf Score</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                        "Your concentration peaks around {timeOptimization?.bestHour}:00. Schedule your hardest subjects then!"
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Academic Assignments */}
                        <div className="bg-white dark:bg-darkCard p-8 rounded-3xl border border-primary-100 dark:border-primary-900/30 shadow-sm transition-all">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center mb-6">
                                <Target className="w-5 h-5 mr-2 text-primary-500" /> Academic Assignments
                            </h3>
                            {loadingAI ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/30 rounded-2xl">
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
                                                <div className="h-2 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                                            </div>
                                            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : assignmentRisks.length > 0 ? (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {assignmentRisks.sort((a, b) => a.isSubmitted - b.isSubmitted).map((assignment, idx) => (
                                        <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${assignment.isSubmitted ? 'bg-green-50/30 dark:bg-green-900/5 opacity-80' : 'bg-gray-50 dark:bg-slate-800/30 hover:bg-gray-100/50'}`}>
                                            <div className="flex-1 min-w-0 mr-4">
                                                <p className={`font-bold text-sm truncate ${assignment.isSubmitted ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                                    {assignment.title}
                                                </p>
                                                <p className="text-[10px] text-gray-500 uppercase font-black mt-0.5">
                                                    {assignment.subject} • {assignment.isSubmitted ? 'Completed' : `${assignment.daysLeft} days left`}
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${
                                                assignment.isSubmitted ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                (assignment.riskLevel === 'High' || assignment.riskLevel === 'Critical') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                assignment.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                                {assignment.isSubmitted ? 'Done' : (assignment.riskLevel === 'Critical' ? 'Urgent' : assignment.riskLevel)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">All caught up! No active assignments.</p>
                                </div>
                            )}
                        </div>

                        {/* Improvement Hub */}
                        <div className="bg-primary-600 rounded-3xl p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02]">
                            <div className="relative z-10">
                                <h3 className="font-black text-xl mb-2 flex items-center">
                                    <TrendingUp className="w-6 h-6 mr-2" /> Improvement
                                </h3>
                                <p className="text-primary-100 text-sm opacity-90 leading-relaxed mb-6">
                                    Complete one more study session to reach your weekly goal!
                                </p>
                                <button className="w-full py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold text-sm hover:bg-white/30 transition shadow-sm">
                                    View Detailed Stats
                                </button>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Additional Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                        <h2 className="text-lg font-bold mb-6 flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                            <BookOpen className="w-5 h-5 mr-2 text-green-500" /> Subject Breakdown
                        </h2>
                        <div className="h-64 w-full">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 italic text-sm font-medium">No subjects recorded yet.</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                        <h2 className="text-lg font-bold mb-6 flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                            <Target className="w-5 h-5 mr-2 text-purple-500" /> Subject Mastery
                        </h2>
                        <div className="h-64 w-full">
                            {stats?.subjectMastery?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.subjectMastery}>
                                        <PolarGrid strokeOpacity={0.1} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                                        <PolarRadiusAxis hide domain={[0, 5]} />
                                        <Radar name="Performance" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 italic text-sm font-medium">Log sessions to visualize mastery!</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent History Table */}
                <div className="bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                            <History className="w-5 h-5 mr-2 text-primary-500" /> Recent Study Sessions
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                    <th className="px-8 py-4">Subject / Topic</th>
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4 text-center">Duration</th>
                                    <th className="px-8 py-4 text-center">Performance</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {sessions.slice((currentSessionPage - 1) * sessionsPerPage, currentSessionPage * sessionsPerPage).map((session) => (
                                    <tr key={session._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-white">{session.subject}</span>
                                                <span className="text-[10px] text-gray-500 uppercase font-black">{session.topic || 'General'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(session.sessionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded text-xs font-bold mr-2">
                                                {session.durationMinutes}m
                                            </span>
                                            {session.testScore !== undefined && (
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold mt-1 md:mt-0 shadow-sm
                                                    ${session.testScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50' :
                                                    session.testScore >= 60 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50' :
                                                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50'}`}>
                                                    Lvl {session.testScore}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex justify-center items-center">
                                                {session.testScore !== undefined ? (
                                                    [...Array(5)].map((_, i) => (
                                                        <div key={i} className={`w-1.5 h-1.5 rounded-full mx-0.5 ${i < Math.round(session.testScore / 20) ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Pending Test</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${session.outcome === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {session.outcome || 'completed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-slate-800/10">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Page {currentSessionPage} of {Math.ceil(sessions.length / sessionsPerPage) || 1}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentSessionPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentSessionPage === 1}
                                className={`p-2 rounded-xl border transition-all ${currentSessionPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 shadow-sm'}`}
                            >
                                <ChevronRight className="w-5 h-5 rotate-180" />
                            </button>
                            <button
                                onClick={() => setCurrentSessionPage(prev => Math.min(prev + 1, Math.ceil(sessions.length / sessionsPerPage)))}
                                disabled={currentSessionPage === Math.ceil(sessions.length / sessionsPerPage) || sessions.length === 0}
                                className={`p-2 rounded-xl border transition-all ${currentSessionPage === Math.ceil(sessions.length / sessionsPerPage) || sessions.length === 0 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 shadow-sm'}`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <LogStudySessionModal
                    isOpen={isLogModalOpen}
                    onClose={() => setIsLogModalOpen(false)}
                    onSessionLogged={handleSessionLogged}
                />

                <AITestModal 
                    isOpen={!!activeTestSession}
                    onClose={() => setActiveTestSession(null)}
                    sessionData={activeTestSession}
                    onTestComplete={handleTestComplete}
                />
            </div>
        </div>
    );
};

export default Dashboard;
