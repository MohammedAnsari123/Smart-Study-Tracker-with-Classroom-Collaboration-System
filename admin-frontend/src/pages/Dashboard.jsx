import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Database, Users, ListTree, Settings, Server, Activity, TrendingUp, BookOpen, HelpCircle, Terminal } from 'lucide-react';

const Dashboard = () => {
    const { admin } = useContext(AdminAuthContext);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalClassrooms: 0,
        totalSubjects: 0,
        totalTopics: 0,
        totalAssignments: 0,
        activeToday: 0
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
        }
    }, [admin]);

    const statCards = [
        {
            title: 'Total Students',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            title: 'Active Today',
            value: stats.activeToday,
            icon: Activity,
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            title: 'Classrooms',
            value: stats.totalClassrooms,
            icon: Database,
            color: 'bg-rose-500',
            textColor: 'text-rose-600',
            bgColor: 'bg-rose-50'
        },
        {
            title: 'Subjects',
            value: stats.totalSubjects,
            icon: ListTree,
            color: 'bg-red-600',
            textColor: 'text-red-700',
            bgColor: 'bg-red-50'
        },
        {
            title: 'Topics',
            value: stats.totalTopics,
            icon: Server,
            color: 'bg-red-400',
            textColor: 'text-red-500',
            bgColor: 'bg-red-50'
        },
        {
            title: 'Assignments',
            value: stats.totalAssignments,
            icon: Settings,
            color: 'bg-orange-400',
            textColor: 'text-orange-500',
            bgColor: 'bg-orange-50'
        }
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-red-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Initializing Control Center...</p>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-10 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Control</h1>
                        <p className="text-gray-500 mt-1 flex items-center font-medium">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            Professional Administrative Governance Tier
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
                            Export Report
                        </button>
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg">
                            System Logs
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${stat.bgColor} opacity-40 group-hover:scale-150 transition-transform duration-700`}></div>

                                <div className="relative z-10 flex items-start justify-between mb-8">
                                    <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-inner`}>
                                        <Icon className={`w-10 h-10 ${stat.textColor}`} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.title}</p>
                                        <h3 className="text-4xl font-black text-gray-900 mt-1">{stat.value}</h3>
                                    </div>
                                </div>

                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                        <TrendingUp className="w-3 h-3 mr-1" /> +Live
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">System Real-time</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                    {/* System Status Panel */}
                    <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-50"></div>

                        <h2 className="text-xl font-black flex items-center text-gray-900 mb-8 relative z-10">
                            <Server className="w-6 h-6 mr-3 text-red-600" />
                            Infrastructure Health
                        </h2>

                        <div className="space-y-4 relative z-10">
                            {[
                                { name: 'Core API Server', status: 'Online', ms: '12ms' },
                                { name: 'Database Cluster', status: 'Online', ms: '8ms' },
                                { name: 'AI Processing Engine', status: 'Online', ms: '145ms' },
                                { name: 'File Storage Service', status: 'Online', ms: '42ms' }
                            ].map((service, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-green-500 mr-4 shrink-0 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse"></div>
                                        <span className="font-bold text-gray-700 tracking-tight">{service.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                                        <span className="text-gray-400">{service.ms}</span>
                                        <span className="text-green-600 bg-green-100/50 px-3 py-1.5 rounded-lg border border-green-200">Active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="bg-gray-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden border border-gray-800">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

                        <h2 className="text-xl font-black flex items-center mb-8 relative z-10">
                            <Settings className="w-6 h-6 mr-3 text-red-500" />
                            Command Hub
                        </h2>

                        <div className="grid grid-cols-2 gap-5 relative z-10">
                            {[
                                { to: '/users', icon: Users, label: 'Students', color: 'text-blue-400', desc: 'Manage access' },
                                { to: '/curriculum', icon: ListTree, label: 'Curriculum', color: 'text-red-400', desc: 'Sync syllabus' },
                                { to: '/materials', icon: BookOpen, label: 'Materials', color: 'text-green-400', desc: 'Asset library' },
                                { to: '/quizzes', icon: HelpCircle, label: 'Quizzes', color: 'text-purple-400', desc: 'Evaluations' }
                            ].map((btn, idx) => (
                                <NavLink key={idx} to={btn.to} className="text-left bg-gray-800/40 hover:bg-gray-800 border border-gray-700/50 p-5 rounded-2xl transition group hover:border-red-500/50">
                                    <btn.icon className={`w-8 h-8 ${btn.color} mb-3 group-hover:scale-110 transition-transform`} />
                                    <div className="font-black text-sm text-white tracking-tight">{btn.label}</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{btn.desc}</div>
                                </NavLink>
                            ))}
                            <NavLink to="/logs" className="text-left bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 p-5 rounded-2xl transition group col-span-2 shadow-lg shadow-red-600/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-black text-base text-white tracking-tight">System Audit & Logs</div>
                                        <div className="text-[10px] text-red-100 font-bold uppercase tracking-widest mt-1">Review platform activity history</div>
                                    </div>
                                    <Terminal className="w-8 h-8 text-white/50 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
