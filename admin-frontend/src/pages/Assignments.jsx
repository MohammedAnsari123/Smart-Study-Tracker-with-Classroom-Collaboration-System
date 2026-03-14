import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { FileText, Plus, Trash2, Users, Calendar, Award, CheckCircle, Clock } from 'lucide-react';

const Assignments = () => {
    const { admin } = useContext(AdminAuthContext);
    const [classrooms, setClassrooms] = useState([]);
    const [activeClass, setActiveClass] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [pdfURL, setPdfURL] = useState('');
    const [maxMarks, setMaxMarks] = useState(100);
    const [deadline, setDeadline] = useState('');

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchClasses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/classrooms', { headers });
            setClassrooms(res.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async (classId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/assignments/${classId}`, { headers });
            setAssignments(res.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    useEffect(() => {
        if (admin) fetchClasses();
    }, [admin]);

    useEffect(() => {
        if (activeClass) fetchAssignments(activeClass._id);
    }, [activeClass]);

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        if (!activeClass) return;
        try {
            const res = await axios.post('http://localhost:5000/api/admin/assignments', {
                title: newTitle,
                description: newDesc,
                pdfURL,
                maxMarks,
                deadline,
                classId: activeClass._id
            }, { headers });
            setAssignments([res.data, ...assignments]);
            setShowAddForm(false);
            resetForm();
        } catch (error) {
            alert('Failed to create assignment');
        }
    };

    const resetForm = () => {
        setNewTitle('');
        setNewDesc('');
        setPdfURL('');
        setMaxMarks(100);
        setDeadline('');
    };

    const handleDeleteAssignment = async (id) => {
        if (!window.confirm('Remove this assignment?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/assignments/${id}`, { headers });
            setAssignments(assignments.filter(a => a._id !== id));
        } catch (error) {
            alert('Failed to delete assignment');
        }
    };

    if (loading) return <div className="text-center py-10 font-bold text-gray-400">Loading Academic Streams...</div>;

    return (
        <div className="flex-1 flex min-h-0 bg-white">
            {/* Class Sidebar */}
            <div className="w-72 flex flex-col border-r border-gray-100 bg-gray-50/30 flex-shrink-0">
                <div className="p-4 border-b border-gray-100 bg-white/50 backdrop-blur">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Classroom</span>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
                    {classrooms.map(cls => (
                        <button key={cls._id} onClick={() => setActiveClass(cls)}
                            className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                                activeClass?._id === cls._id 
                                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20' 
                                : 'text-gray-600 bg-white border-transparent hover:bg-white hover:border-gray-200'
                            }`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                activeClass?._id === cls._id ? 'bg-white/20' : 'bg-red-50 text-red-600'
                            }`}>
                                <Users className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-bold truncate tracking-tight uppercase">{cls.className}</div>
                                <div className="text-[9px] font-bold uppercase mt-1 opacity-60">{cls.subject}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-50/20">
                {activeClass ? (
                    <>
                        <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-black text-gray-900 tracking-tight">{activeClass.className}</h1>
                                <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mt-1">Assignment Command Center</p>
                            </div>
                            <button onClick={() => setShowAddForm(!showAddForm)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition shadow-lg shadow-red-600/20 active:scale-95">
                                <Plus className="w-4 h-4" /> {showAddForm ? 'Cancel' : 'Dispatch Assignment'}
                            </button>
                        </div>

                        {showAddForm && (
                            <div className="p-8 bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
                                <form onSubmit={handleAddAssignment} className="max-w-4xl grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Assignment Title</label>
                                        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Lab Report #1" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Deadline Date</label>
                                        <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Document Link (PDF/Resources)</label>
                                        <input type="url" value={pdfURL} onChange={(e) => setPdfURL(e.target.value)} required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="https://drive.google.com/..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Maximum Marks</label>
                                        <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Description & Instructions</label>
                                        <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" rows="3" placeholder="Explain the assignment requirements..." />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <button type="submit" className="px-10 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
                                            Deploy to Classroom
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="space-y-4">
                                {assignments.map(assignment => (
                                    <div key={assignment._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                                                <FileText className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-gray-900">{assignment.title}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tight">
                                                        <Calendar className="w-3.5 h-3.5" /> Due: {new Date(assignment.deadline).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tight">
                                                        <Award className="w-3.5 h-3.5" /> Max: {assignment.maxMarks}
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                                        assignment.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                        {assignment.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <a href={assignment.pdfURL} target="_blank" rel="noopener noreferrer"
                                                className="px-4 py-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                <Plus className="w-4 h-4 rotate-45" title="View Document" />
                                            </a>
                                            <button onClick={() => handleDeleteAssignment(assignment._id)}
                                                className="p-3 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {assignments.length === 0 && (
                                <div className="h-96 flex flex-col items-center justify-center text-center opacity-20">
                                    <FileText className="w-20 h-20 mb-6" />
                                    <p className="text-xs font-black uppercase tracking-[0.4em]">No Active Deployments</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
                        <Users className="w-24 h-24 mb-6" />
                        <h3 className="text-sm font-black uppercase tracking-[0.4em]">Select Target Classroom</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Assignments;
