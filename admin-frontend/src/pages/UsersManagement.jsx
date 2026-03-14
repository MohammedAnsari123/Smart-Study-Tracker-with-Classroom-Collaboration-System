import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Users as UsersIcon, Search, Trash2, Mail, Calendar, ShieldAlert } from 'lucide-react';

const UsersManagement = () => {
    const { admin } = useContext(AdminAuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (admin) {
            fetchUsers();
        }
    }, [admin]);

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you absolutely sure you want to delete user ${userName}? This action cannot be undone.`)) return;
        
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-10 text-gray-400 font-medium animate-pulse">Loading users payload...</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center">
                        <UsersIcon className="w-8 h-8 mr-3 text-red-500" />
                        User Management
                    </h1>
                    <p className="text-gray-500 mt-1">View, search, and manage registered student accounts.</p>
                </div>
                
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64 bg-white"
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-red-100 to-orange-100 flex items-center justify-center text-red-700 font-bold mr-3 shrink-0">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{user.fullName}</div>
                                                    <div className="text-xs text-gray-400 mt-0.5 font-medium flex items-center">
                                                        ID: {user._id.substring(user._id.length - 6)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                user.accountStatus === 'active' 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'bg-red-50 text-red-700'
                                            }`}>
                                                {user.accountStatus === 'active' ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button 
                                                onClick={() => handleDeleteUser(user._id, user.fullName)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="font-medium text-lg text-gray-500">No users found</p>
                                            <p className="text-sm">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
