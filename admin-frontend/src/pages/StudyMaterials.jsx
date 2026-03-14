import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { BookOpen, Plus, Trash2, GraduationCap, Link as LinkIcon, FileText, Video, Globe } from 'lucide-react';

const StudyMaterials = () => {
    const { admin } = useContext(AdminAuthContext);
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [activeSubject, setActiveSubject] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newType, setNewType] = useState('pdf');
    const [newUrl, setNewUrl] = useState('');
    const [newTopic, setNewTopic] = useState('');

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [subRes, deptRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/subject', { headers }),
                axios.get('http://localhost:5000/api/admin/subject/departments', { headers })
            ]);
            setSubjects(subRes.data);
            setDepartments(deptRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMaterials = async (subjectId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/materials/${subjectId}`, { headers });
            setMaterials(res.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    useEffect(() => {
        if (admin) fetchData();
    }, [admin]);

    useEffect(() => {
        if (activeSubject) fetchMaterials(activeSubject._id);
    }, [activeSubject]);

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        if (!activeSubject) return;
        try {
            const res = await axios.post('http://localhost:5000/api/admin/materials', {
                title: newTitle,
                description: newDesc,
                type: newType,
                url: newUrl,
                subjectId: activeSubject._id,
                topicName: newTopic
            }, { headers });
            setMaterials([res.data, ...materials]);
            setShowAddForm(false);
            setNewTitle('');
            setNewDesc('');
            setNewUrl('');
            setNewTopic('');
        } catch (error) {
            alert('Failed to add material');
        }
    };

    const handleDeleteMaterial = async (id) => {
        if (!window.confirm('Delete this material?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/materials/${id}`, { headers });
            setMaterials(materials.filter(m => m._id !== id));
        } catch (error) {
            alert('Failed to delete material');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <Video className="w-4 h-4" />;
            case 'pdf': return <FileText className="w-4 h-4" />;
            default: return <Globe className="w-4 h-4" />;
        }
    };

    if (loading) return <div className="text-center py-10">Loading Repository...</div>;

    return (
        <div className="flex-1 flex min-h-0 bg-white">
            {/* Sidebar: Subject Selection */}
            <div className="w-72 flex flex-col border-r border-gray-100 bg-gray-50/30 flex-shrink-0">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Subject</span>
                    <div className="text-[9px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{subjects.length}</div>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
                    {subjects.map(subject => (
                        <button key={subject._id} onClick={() => setActiveSubject(subject)}
                            className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                                activeSubject?._id === subject._id 
                                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20' 
                                : 'text-gray-600 bg-white border-transparent hover:bg-white hover:border-gray-200'
                            }`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                activeSubject?._id === subject._id ? 'bg-white/20' : 'bg-red-50 text-red-600'
                            }`}>
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-bold truncate leading-tight uppercase tracking-tight">{subject.subjectName}</div>
                                <div className="text-[9px] font-bold uppercase mt-1 opacity-60">
                                    {subject.department} • SEM {subject.semester}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-50/20">
                {activeSubject ? (
                    <>
                        <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-black text-gray-900 tracking-tight">{activeSubject.subjectName}</h1>
                                <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mt-1">Resource Repository</p>
                            </div>
                            <button onClick={() => setShowAddForm(!showAddForm)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-xs hover:bg-red-700 transition shadow-lg shadow-red-600/20 active:scale-95">
                                <Plus className="w-4 h-4" /> {showAddForm ? 'Cancel' : 'Add Material'}
                            </button>
                        </div>

                        {showAddForm && (
                            <div className="p-8 bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
                                <form onSubmit={handleAddMaterial} className="max-w-4xl grid grid-cols-2 gap-4">
                                    <div className="col-span-2 grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Title</label>
                                            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500" placeholder="e.g. Unit 1 Notes" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Topic</label>
                                            <select value={newTopic} onChange={(e) => setNewTopic(e.target.value)} required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500">
                                                <option value="">Select Topic</option>
                                                {activeSubject.topics.map(t => <option key={t._id} value={t.topicName}>{t.topicName}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Type</label>
                                            <select value={newType} onChange={(e) => setNewType(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500">
                                                <option value="pdf">PDF Document</option>
                                                <option value="video">Video Lecture</option>
                                                <option value="link">Web Resource</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Resource URL</label>
                                        <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500" placeholder="https://..." />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Description (Optional)</label>
                                        <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500" rows="2" placeholder="Brief details about the resource..." />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <button type="submit" className="px-8 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all">
                                            Publish Resource
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {materials.map(material => (
                                    <div key={material._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                                {getTypeIcon(material.type)}
                                            </div>
                                            <button onClick={() => handleDeleteMaterial(material._id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{material.title}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{material.topicName}</p>
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-gray-300 uppercase">{material.type}</span>
                                            <a href={material.url} target="_blank" rel="noopener noreferrer" 
                                                className="flex items-center gap-1.5 text-[10px] font-black text-red-600 uppercase hover:underline">
                                                View <LinkIcon className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {materials.length === 0 && (
                                <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                                    <BookOpen className="w-12 h-12 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Materials Found</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
                        <GraduationCap className="w-16 h-16 mb-4" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em]">Select a Subject to Manage Assets</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyMaterials;
