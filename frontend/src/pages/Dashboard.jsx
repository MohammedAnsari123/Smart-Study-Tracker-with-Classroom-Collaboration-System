import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import LogStudySessionModal from '../components/LogStudySessionModal';
import { TrendingUp, Clock, AlertCircle, PlusCircle, History, Calendar, Star, ChevronRight, BookOpen, Target, Activity } from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    const fetchStudyData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [sessionsRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/study', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/study/stats', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSessions(sessionsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching study data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudyData();
    }, []);

    const handleSessionLogged = () => {
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

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                            Study <span className="text-primary-600">Analytics</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            Tracking your personal growth and subject mastery.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsLogModalOpen(true)}
                        className="w-full md:w-auto px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition shadow-xl shadow-primary-500/20 flex items-center justify-center group"
                    >
                        <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                        Log New Session
                    </button>
                </div>

                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-6 h-6 text-blue-500" />
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">Duration</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{(stats?.totalDuration / 60 || 0).toFixed(1)}h</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Time Logged</p>
                    </div>

                    <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <Star className="w-6 h-6 text-yellow-500" />
                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded">Focus</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{stats?.averageFocus || 0}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Average Focus Level</p>
                    </div>

                    <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-6 h-6 text-primary-500" />
                            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">Productivity</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{stats?.productivityScore || 0}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current Score</p>
                    </div>

                    <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-6 h-6 text-green-500" />
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">Sessions</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{sessions.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Logs Recorded</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* 1. Weekly Consistency (Bar Chart) */}
                    <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                            <Activity className="w-5 h-5 mr-2 text-primary-500" /> Weekly Consistency
                        </h2>
                        <div className="h-72 w-full relative">
                            {stats?.weeklyConsistency?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.weeklyConsistency}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                                        <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        />
                                        <Bar dataKey="minutes" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                            )}
                        </div>
                    </div>

                    {/* 2. Focus Trend (Area Chart) */}
                    <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                            <Star className="w-5 h-5 mr-2 text-yellow-500" /> Focus Progression
                        </h2>
                        <div className="h-72 w-full relative">
                            {stats?.focusTrend?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.focusTrend}>
                                        <defs>
                                            <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                                        <YAxis hide domain={[0, 5]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="focus" stroke="#f59e0b" fillOpacity={1} fill="url(#colorFocus)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                            )}
                        </div>
                    </div>

                    {/* 3. Subject Distribution (Pie Chart) */}
                    <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                            <BookOpen className="w-5 h-5 mr-2 text-green-500" /> Subject Breakdown
                        </h2>
                        <div className="h-72 w-full relative">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                            )}
                        </div>
                    </div>

                    {/* 4. Subject Mastery (Radar Chart) */}
                    <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                            <Target className="w-5 h-5 mr-2 text-purple-500" /> Subject Mastery
                        </h2>
                        <div className="h-72 w-full relative">
                            {stats?.subjectMastery?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.subjectMastery}>
                                        <PolarGrid strokeOpacity={0.1} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                                        <PolarRadiusAxis hide domain={[0, 5]} />
                                        <Radar
                                            name="Focus Score"
                                            dataKey="score"
                                            stroke="#8b5cf6"
                                            fill="#8b5cf6"
                                            fillOpacity={0.3}
                                            strokeWidth={2}
                                        />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent History Table */}
                <div className="bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white uppercase tracking-tighter">
                            <History className="w-5 h-5 mr-2 text-primary-500" /> Comprehensive Log History
                        </h2>
                        <button className="text-primary-600 text-sm font-bold hover:underline flex items-center">
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                    <th className="px-8 py-4">Hierarchy (Subject / Topic)</th>
                                    <th className="px-8 py-4 text-center">Subtopic</th>
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4 text-center">Mins</th>
                                    <th className="px-8 py-4 text-center">Focus</th>
                                    <th className="px-8 py-4">Note Snippet</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {sessions.slice(0, 10).map((session) => (
                                    <tr key={session._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-white">{session.subject}</span>
                                                <span className="text-[10px] text-gray-500 uppercase font-black">{session.topic || 'General'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                {session.subtopic || '-'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(session.sessionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded text-xs font-bold">
                                                {session.durationMinutes}m
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex justify-center items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-1.5 h-1.5 rounded-full mx-0.5 ${i < session.focusScore ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                                            {session.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {sessions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No activity logged in your tracker yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <LogStudySessionModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSessionLogged={handleSessionLogged}
            />
        </div>
    );
};

export default Dashboard;
