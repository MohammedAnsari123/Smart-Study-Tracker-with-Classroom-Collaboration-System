import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import { Settings, Plus, Layout, ListTree, ChevronRight, Trash2, Edit3, Save, X } from 'lucide-react';

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [activeSubject, setActiveSubject] = useState(null);
    const [newTopicName, setNewTopicName] = useState('');
    const [newSubtopicName, setNewSubtopicName] = useState('');
    const [activeTopicId, setActiveTopicId] = useState(null);

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/subject', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(res.data);
            if (res.data.length > 0 && !activeSubject) {
                setActiveSubject(res.data[0]);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/subject', { name: newSubjectName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects([...subjects, res.data]);
            setNewSubjectName('');
            setActiveSubject(res.data);
        } catch (error) {
            alert('Failed to create subject');
        }
    };

    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (!newTopicName.trim() || !activeSubject) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/subject/${activeSubject._id}/topic`, { topicName: newTopicName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedSubjects = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updatedSubjects);
            setActiveSubject(res.data);
            setNewTopicName('');
        } catch (error) {
            alert('Failed to add topic');
        }
    };

    const handleAddSubtopic = async (e) => {
        e.preventDefault();
        if (!newSubtopicName.trim() || !activeTopicId || !activeSubject) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/subject/${activeSubject._id}/subtopic`, {
                topicId: activeTopicId,
                subtopicName: newSubtopicName
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedSubjects = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updatedSubjects);
            setActiveSubject(res.data);
            setNewSubtopicName('');
        } catch (error) {
            alert('Failed to add subtopic');
        }
    };

    const handleDeleteSubject = async (e) => {
        if (e) e.stopPropagation();
        if (!activeSubject) return;
        if (!window.confirm(`Are you sure you want to delete "${activeSubject.name}" and all its contents?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/subject/${activeSubject._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedSubjects = subjects.filter(s => s._id !== activeSubject._id);
            setSubjects(updatedSubjects);
            if (updatedSubjects.length > 0) {
                setActiveSubject(updatedSubjects[0]);
            } else {
                setActiveSubject(null);
            }
            setActiveTopicId(null);
        } catch (error) {
            alert('Failed to delete subject');
        }
    };

    const handleDeleteTopic = async (topicId) => {
        if (!activeSubject) return;
        if (!window.confirm('Delete this topic?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`http://localhost:5000/subject/${activeSubject._id}/topic/${topicId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedSubjects = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updatedSubjects);
            setActiveSubject(res.data);
            if (activeTopicId === topicId) setActiveTopicId(null);
        } catch (error) {
            alert('Failed to delete topic');
        }
    };

    const handleDeleteSubtopic = async (topicId, subName) => {
        if (!activeSubject) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`http://localhost:5000/subject/${activeSubject._id}/topic/${topicId}/subtopic`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { subtopicName: subName }
            });
            const updatedSubjects = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updatedSubjects);
            setActiveSubject(res.data);
        } catch (error) {
            alert('Failed to delete subtopic');
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg pb-12">
            <TopBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                        <ListTree className="w-8 h-8 mr-3 text-primary-500" />
                        Subjects & Curriculum
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Organize your study goals by subjects, topics, and subtopics.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: Subjects List */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Subjects</h3>
                            <div className="space-y-2">
                                {subjects.map(subject => (
                                    <button
                                        key={subject._id}
                                        onClick={() => {
                                            setActiveSubject(subject);
                                            setActiveTopicId(null);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-between group ${activeSubject?._id === subject._id
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <span className="truncate">{subject.name}</span>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeSubject?._id === subject._id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleCreateSubject} className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">New Subject</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                        placeholder="e.g. Physics"
                                        className="flex-1 min-w-0 bg-gray-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"
                                    />
                                    <button type="submit" className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Main Content: Topics & Subtopics */}
                    <div className="lg:col-span-3">
                        {activeSubject ? (
                            <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{activeSubject.name}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activeSubject.topics.length} Topics defined</p>
                                    </div>
                                    <button
                                        onClick={handleDeleteSubject}
                                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Topics List */}
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                                <Layout className="w-4 h-4 mr-2" /> Topics
                                            </h3>
                                            <div className="space-y-4">
                                                {activeSubject.topics.map(topic => (
                                                    <div key={topic._id} className="group">
                                                        <div
                                                            onClick={() => setActiveTopicId(topic._id)}
                                                            className={`p-4 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer transition-all flex items-center justify-between ${activeTopicId === topic._id
                                                                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 shadow-sm'
                                                                : 'bg-white dark:bg-slate-800 hover:border-primary-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className={`w-2 h-2 rounded-full mr-3 ${activeTopicId === topic._id ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                                                                <span className={`font-bold ${activeTopicId === topic._id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                    {topic.name}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                                                    {topic.subtopics.length} Subtopics
                                                                </span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteTopic(topic._id);
                                                                    }}
                                                                    className="p-1 text-gray-400 hover:text-red-500 transition"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <form onSubmit={handleAddTopic} className="flex gap-3 mt-4">
                                                    <input
                                                        type="text"
                                                        value={newTopicName}
                                                        onChange={(e) => setNewTopicName(e.target.value)}
                                                        placeholder="New topic name..."
                                                        className="flex-1 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"
                                                    />
                                                    <button type="submit" className="px-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold">
                                                        Add
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        {/* Subtopics List */}
                                        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                                                {activeTopicId
                                                    ? `Subtopics for ${activeSubject.topics.find(t => t._id === activeTopicId)?.name}`
                                                    : 'Select a topic to view subtopics'}
                                            </h3>

                                            {activeTopicId ? (
                                                <div className="space-y-3">
                                                    {activeSubject.topics.find(t => t._id === activeTopicId)?.subtopics.map((sub, idx) => (
                                                        <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between group/sub">
                                                            <div className="flex items-center">
                                                                <ChevronRight className="w-3 h-3 mr-2 text-primary-400" />
                                                                {sub}
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteSubtopic(activeTopicId, sub)}
                                                                className="opacity-0 group-hover/sub:opacity-100 p-1 text-gray-400 hover:text-red-500 transition"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <form onSubmit={handleAddSubtopic} className="flex gap-2 mt-6">
                                                        <input
                                                            type="text"
                                                            value={newSubtopicName}
                                                            onChange={(e) => setNewSubtopicName(e.target.value)}
                                                            placeholder="Add subtopic..."
                                                            className="flex-1 bg-white dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"
                                                        />
                                                        <button type="submit" className="p-2 text-primary-600 hover:text-primary-700 transition">
                                                            <Plus className="w-6 h-6" />
                                                        </button>
                                                    </form>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                                    <Layout className="w-10 h-10 mb-4 opacity-20" />
                                                    <p className="text-sm font-medium uppercase tracking-tighter">No topic selected</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-20 text-center">
                                <div className="bg-gray-50 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <ListTree className="w-10 h-10 text-gray-300" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">No active subject selected</h2>
                                <p className="text-gray-500 mt-4 max-w-sm mx-auto">Select a subject from the sidebar or create a new one to start organizing your curriculum.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectManagement;
