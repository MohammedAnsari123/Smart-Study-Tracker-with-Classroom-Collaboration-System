import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
    Users, 
    Award, 
    Target, 
    TrendingUp, 
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from 'lucide-react';

const Analytics = () => {
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5000/api/admin/performance', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPerformance(res.data);
            } catch (error) {
                console.error('Error fetching performance:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    const filteredData = performance.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const avgFocus = performance.length > 0 
        ? (performance.reduce((acc, p) => acc + parseFloat(p.academicFocus), 0) / performance.length).toFixed(1)
        : 0;

    const distribution = [
        { name: 'Excellent (90+)', value: performance.filter(p => p.academicFocus >= 90).length },
        { name: 'Good (75-89)', value: performance.filter(p => p.academicFocus >= 75 && p.academicFocus < 90).length },
        { name: 'Average (50-74)', value: performance.filter(p => p.academicFocus >= 50 && p.academicFocus < 75).length },
        { name: 'Improvement (<50)', value: performance.filter(p => p.academicFocus < 50).length },
    ];

    const COLORS = ['#ef4444', '#f87171', '#fca5a5', '#fee2e2'];

    if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading Academic Intelligence...</div>;

    return (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Academic Intelligence</h2>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1 opacity-60">Performance & Focus Analytics</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-red-600/20 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-black text-xs uppercase tracking-widest">Global Focus: {avgFocus}%</span>
                    </div>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Enrolled Students', value: performance.length, icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Avg Test Score', value: performance.length > 0 ? (performance.reduce((acc, p) => acc + (p.avgTestScore !== 'N/A' ? parseFloat(p.avgTestScore) : 0), 0) / performance.filter(p => p.avgTestScore !== 'N/A').length || 0).toFixed(1) : 0, icon: Target, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Top Performers', value: performance.filter(p => p.academicFocus >= 85).length, icon: Award, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Critical Attention', value: performance.filter(p => p.academicFocus < 40).length, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Distribution Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                        <BarChart className="w-6 h-6 text-red-600" />
                        Focus Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={distribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-sm font-medium text-gray-500" />
                            <YAxis axisLine={false} tickLine={false} className="text-sm font-medium text-gray-500" />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Score Summary */}
                <div className="bg-gray-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                    <h3 className="text-xl font-black mb-8">Performance Insights</h3>
                    <div className="space-y-6">
                        {distribution.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <span className="text-gray-400 font-bold">{item.name}</span>
                                </div>
                                <span className="font-black">{item.value} Students</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-sm text-gray-400 font-bold mb-2 uppercase tracking-widest">Growth Recommendation</p>
                        <p className="text-sm font-medium leading-relaxed">
                            {avgFocus > 75 
                                ? "System status is healthy. Recommended to increase complexity of AI-generated quizzes for top performers."
                                : "Focus levels are below target. Suggesting intervention for students in the 'Improvement' category via targeted materials."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
