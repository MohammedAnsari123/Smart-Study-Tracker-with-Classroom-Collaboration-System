import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import CreateClassroomModal from '../components/CreateClassroomModal';
import JoinClassroomModal from '../components/JoinClassroomModal';
import { Book, Users, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Classrooms = () => {
    const { user } = useContext(AuthContext);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const fetchClassrooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/class', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClassrooms(res.data);
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const handleClassCreated = (newClass) => {
        setClassrooms(prev => [newClass, ...prev]);
    };

    const handleClassJoined = () => {
        fetchClassrooms();
    };

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                            <Users className="w-8 h-8 mr-3 text-primary-600" />
                            Classrooms
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your academic collaborations and assignments.</p>
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm flex items-center justify-center"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Join Class
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Class
                        </button>
                    </div>
                </div>

                {classrooms.length === 0 ? (
                    <div className="bg-white dark:bg-darkCard rounded-2xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="bg-gray-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Book className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No classrooms yet</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            Start by creating your own classroom or joining one with a unique code provided by your teacher.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <button onClick={() => setIsJoinModalOpen(true)} className="text-primary-600 font-bold hover:underline">Join a class</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setIsCreateModalOpen(true)} className="text-primary-600 font-bold hover:underline">Create a class</button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classrooms.map((cls) => (
                            <Link
                                to={`/class/${cls._id}`}
                                key={cls._id}
                                className="group relative bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-green-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-xl">
                                        {cls.className[0].toUpperCase()}
                                    </div>
                                    {cls.ownerId === user._id && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-[10px] font-extrabold uppercase tracking-wider">
                                            Owner
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                                    {cls.className}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 line-clamp-2 min-h-[2.5rem]">
                                    {cls.description || `Subject: ${cls.subject}`}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                        {cls.section && <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded mr-2">Section {cls.section}</span>}
                                        <span className="font-medium">{cls.subject}</span>
                                    </div>
                                    {cls.ownerId === user._id && cls.classCode && (
                                        <div className="text-[10px] font-mono font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded select-all">
                                            CODE: {cls.classCode}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <CreateClassroomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onClassCreated={handleClassCreated}
            />
            <JoinClassroomModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onClassJoined={handleClassJoined}
            />
        </div>
    );
};

export default Classrooms;
