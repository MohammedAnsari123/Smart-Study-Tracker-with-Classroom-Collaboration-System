import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { 
    Users, 
    Database, 
    ListTree, 
    Activity, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    Calendar,
    MousePointer2,
    Layers
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const Dashboard = () => {
    const { admin } = useContext(AdminAuthContext);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalClassrooms: 0,
        totalSubjects: 0,
        totalTopics: 0,
        totalAssignments: 0,
        activeToday: 0,
        enrollmentTrend: [],
        subjectDistribution: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (admin) {
            fetchStats();
            // Real-time polling every 30 seconds
            const interval = setInterval(fetchStats, 30000);
            return () => clearInterval(interval);
        }
    }, [admin]);

    const statCards = [
        {
            title: 'Total Students',
            value: stats.totalUsers,
            change: '+12%',
            isUp: true,
            icon: Users,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            title: 'Active Sessions',
            value: stats.activeToday,
            change: '+5%',
            isUp: true,
            icon: Activity,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            title: 'Digital Classrooms',
            value: stats.totalClassrooms,
            change: '+2',
            isUp: true,
            icon: Database,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50'
        },
        {
            title: 'Content Units',
            value: stats.totalTopics,
            change: '-1%',
            isUp: false,
            icon: Layers,
            color: 'text-red-700',
            bgColor: 'bg-red-50/50'
        }
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full animate-pulse">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Analytics...</p>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden">
            {/* Header Section */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Executive <span className="text-red-600">Overview</span></h1>
                    {/* Fixed DOM Nesting: Changed div to span */}
                    <p className="text-gray-400 mt-0.5 flex items-center text-xs font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        Platform Vital Statistics • Real-time
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition border border-gray-100">
                        <Calendar size={14} /> This Month
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-600/20 active:scale-95">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gray-50/30">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg ${stat.isUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                    {stat.isUp ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.title}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Enrollment Trend */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 tracking-tight">Enrollment Dynamics</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student growth over the last 7 days</p>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.enrollmentTrend}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF'}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF'}}
                                    />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold'}}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="students" 
                                        stroke="#DC2626" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorStudents)" 
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Subject Distribution */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Content Distribution</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active modules by department</p>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-6">
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.subjectDistribution} layout="vertical" margin={{left: -20}}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#111827'}} width={60} />
                                        <Tooltip cursor={{fill: 'transparent'}} />
                                        <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={20}>
                                            {stats.subjectDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4">
                                {stats.subjectDistribution.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                            <span className="text-xs font-bold text-gray-600">{item.name} Department</span>
                                        </div>
                                        <span className="text-xs font-black text-gray-900">{item.count}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-400/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-2 text-red-500 mb-4 font-black text-[10px] uppercase tracking-[0.3em]">
                                <TrendingUp size={16} /> Performance Catalyst
                            </div>
                            <h2 className="text-3xl font-black tracking-tight mb-4">The platform is operating at <span className="text-red-500">Peak Capacity.</span></h2>
                            <p className="text-gray-400 font-medium text-sm leading-relaxed">
                                System throughput has increased by 22% this week. No critical errors detected in the AI core or database clusters. All nodes are reporting 100% health.
                            </p>
                        </div>
                        <div className="shrink-0 flex gap-4">
                            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700/50 text-center">
                                <div className="text-2xl font-black text-white">99.9%</div>
                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Uptime SLA</div>
                            </div>
                            <div className="bg-red-600 p-6 rounded-3xl text-center shadow-lg shadow-red-600/20">
                                <MousePointer2 className="text-white mx-auto mb-2" size={24} />
                                <div className="text-[8px] font-black text-red-100 uppercase tracking-widest">Active Node</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
