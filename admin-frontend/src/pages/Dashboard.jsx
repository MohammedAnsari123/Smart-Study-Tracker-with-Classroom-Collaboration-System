import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Database, Users, ListTree, Settings, Server, Activity } from 'lucide-react';

const Dashboard = () => {
    const { admin } = useContext(AdminAuthContext);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalClassrooms: 0,
        totalSubjects: 0
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
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Active Classrooms',
            value: stats.totalClassrooms,
            icon: Database,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-500',
            bgColor: 'bg-indigo-50'
        },
        {
            title: 'Curriculum Subjects',
            value: stats.totalSubjects,
            icon: ListTree,
            color: 'bg-red-500',
            textColor: 'text-red-500',
            bgColor: 'bg-red-50'
        }
    ];

    if (loading) return <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Initializing dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">System Overview</h1>
                    <p className="text-gray-500 mt-1 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-green-500" />
                        All systems operational
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bgColor} opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
                            
                            <div className="relative z-10 flex items-center justify-between mb-4">
                                <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                                    <Icon className={`w-8 h-8 ${stat.textColor}`} />
                                </div>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.title}</span>
                            </div>
                            
                            <div className="relative z-10">
                                <h3 className="text-5xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                                <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                                    <span className="bg-green-100 px-2 py-0.5 rounded mr-2">+12%</span>
                                    <span className="text-gray-400">from last month</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* System Status Panel */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-left">
                    <h2 className="text-xl font-bold flex items-center text-gray-900 mb-6">
                        <Server className="w-6 h-6 mr-3 text-red-500" />
                        Services Health
                    </h2>
                    
                    <div className="space-y-4">
                        {[
                            { name: 'Core API Server', status: 'Online', ms: '12ms' },
                            { name: 'Database Cluster', status: 'Online', ms: '8ms' },
                            { name: 'AI Processing Engine', status: 'Online', ms: '145ms' },
                            { name: 'File Storage Service', status: 'Online', ms: '42ms' }
                        ].map((service, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-4 shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                                    <span className="font-bold text-gray-700">{service.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <span className="text-gray-400">{service.ms}</span>
                                    <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">Operational</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-left text-white bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    
                    <h2 className="text-xl font-bold flex items-center mb-6 relative z-10">
                        <Settings className="w-6 h-6 mr-3 text-red-400" />
                        Admin Quick Actions
                    </h2>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <button className="text-left bg-gray-800/80 hover:bg-gray-700 border border-gray-700 p-4 rounded-2xl transition group">
                            <Users className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-sm text-white">Manage Users</div>
                            <div className="text-xs text-gray-400 mt-1">Review & suspend accounts</div>
                        </button>
                        <button className="text-left bg-gray-800/80 hover:bg-gray-700 border border-gray-700 p-4 rounded-2xl transition group">
                            <ListTree className="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-sm text-white">Edit Curriculum</div>
                            <div className="text-xs text-gray-400 mt-1">Add subjects or topics</div>
                        </button>
                        <button className="text-left bg-gray-800/80 hover:bg-gray-700 border border-gray-700 p-4 rounded-2xl transition group col-span-2">
                            <Database className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-sm text-white">System Logs & Auditing</div>
                            <div className="text-xs text-gray-400 mt-1">View platform-wide activity and error logs</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
