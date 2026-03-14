import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Search, Filter, ShieldAlert, Terminal } from 'lucide-react';

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5000/api/admin/logs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(res.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in fade-in duration-500">
            <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Audit Logs</h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1 opacity-60">Governance Archive & Event Stream</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none w-64 font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Admin</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        No system logs recorded yet
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50/10 transition-colors">
                                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-sm mr-3">
                                                    {log.adminId?.name?.[0] || 'A'}
                                                </div>
                                                <span className="font-bold text-gray-900">{log.adminId?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-tight text-gray-700 border border-gray-200">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-gray-600 font-medium max-w-xs truncate">
                                            {log.details}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </div>
    );
};

export default SystemLogs;
