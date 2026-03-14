import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Plus, Layout, ListTree, ChevronRight, Trash2, X, Upload, FileJson, Building2, GraduationCap, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

const CurriculumManagement = () => {
    const { admin } = useContext(AdminAuthContext);
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterDept, setFilterDept] = useState('');
    const [filterSem, setFilterSem] = useState('');

    // Create subject form
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newDept, setNewDept] = useState('');
    const [newSem, setNewSem] = useState('');

    // Create department form
    const [newDeptName, setNewDeptName] = useState('');
    const [newDeptFullName, setNewDeptFullName] = useState('');
    const [showDeptForm, setShowDeptForm] = useState(false);

    // Active subject for editing topics
    const [activeSubject, setActiveSubject] = useState(null);
    const [newTopicName, setNewTopicName] = useState('');
    const [newSubtopicName, setNewSubtopicName] = useState('');
    const [activeTopicId, setActiveTopicId] = useState(null);

    // JSON import
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [importStatus, setImportStatus] = useState('');

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchSubjects = async () => {
        try {
            let url = 'http://localhost:5000/api/admin/subject';
            const params = [];
            if (filterDept) params.push(`department=${filterDept}`);
            if (filterSem) params.push(`semester=${filterSem}`);
            if (params.length > 0) url += '?' + params.join('&');

            const res = await axios.get(url, { headers });
            setSubjects(res.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/subject/departments', { headers });
            setDepartments(res.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        if (admin) {
            fetchDepartments();
            fetchSubjects();
        }
    }, [admin]);

    useEffect(() => {
        if (admin) fetchSubjects();
    }, [filterDept, filterSem]);

    // --- Department Management ---
    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        if (!newDeptName.trim() || !newDeptFullName.trim()) return;
        try {
            await axios.post('http://localhost:5000/api/admin/subject/departments', {
                name: newDeptName,
                fullName: newDeptFullName,
                semesters: [1, 2, 3, 4, 5, 6]
            }, { headers });
            setNewDeptName('');
            setNewDeptFullName('');
            setShowDeptForm(false);
            fetchDepartments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create department');
        }
    };

    const handleDeleteDepartment = async (id) => {
        if (!window.confirm('Delete this department?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/subject/departments/${id}`, { headers });
            fetchDepartments();
        } catch (error) {
            alert('Failed to delete department');
        }
    };

    // --- Subject CRUD ---
    const handleCreateSubject = async (e) => {
        e.preventDefault();
        if (!newSubjectName.trim() || !newCourseCode.trim() || !newDept || !newSem) return;
        try {
            const res = await axios.post('http://localhost:5000/api/admin/subject', {
                subjectName: newSubjectName,
                courseCode: newCourseCode,
                department: newDept,
                semester: Number(newSem)
            }, { headers });
            setNewSubjectName('');
            setNewCourseCode('');
            fetchSubjects();
            setActiveSubject(res.data);
        } catch (error) {
            alert('Failed to create subject');
        }
    };

    const handleDeleteSubject = async () => {
        if (!activeSubject) return;
        if (!window.confirm(`Delete "${activeSubject.subjectName}"?`)) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/subject/${activeSubject._id}`, { headers });
            setActiveSubject(null);
            fetchSubjects();
        } catch (error) {
            alert('Failed to delete subject');
        }
    };

    // --- Topics & Subtopics ---
    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (!newTopicName.trim() || !activeSubject) return;
        try {
            const res = await axios.post(`http://localhost:5000/api/admin/subject/${activeSubject._id}/topic`, { topicName: newTopicName }, { headers });
            const updated = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updated);
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
            const res = await axios.post(`http://localhost:5000/api/admin/subject/${activeSubject._id}/subtopic`, {
                topicId: activeTopicId,
                subtopicName: newSubtopicName
            }, { headers });
            const updated = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updated);
            setActiveSubject(res.data);
            setNewSubtopicName('');
        } catch (error) {
            alert('Failed to add subtopic');
        }
    };

    const handleDeleteTopic = async (topicId) => {
        if (!activeSubject || !window.confirm('Delete this topic?')) return;
        try {
            const res = await axios.delete(`http://localhost:5000/api/admin/subject/${activeSubject._id}/topic/${topicId}`, { headers });
            const updated = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updated);
            setActiveSubject(res.data);
            if (activeTopicId === topicId) setActiveTopicId(null);
        } catch (error) {
            alert('Failed to delete topic');
        }
    };

    const handleDeleteSubtopic = async (topicId, subName) => {
        if (!activeSubject) return;
        try {
            const res = await axios.delete(`http://localhost:5000/api/admin/subject/${activeSubject._id}/topic/${topicId}/subtopic`, {
                headers,
                data: { subtopicName: subName }
            });
            const updated = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updated);
            setActiveSubject(res.data);
        } catch (error) {
            alert('Failed to delete subtopic');
        }
    };

    // --- JSON Bulk Import ---
    const handleJsonImport = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const subjectsArray = Array.isArray(parsed) ? parsed : parsed.subjects ? parsed.subjects : [parsed];

            setImportStatus('Importing...');
            const res = await axios.post('http://localhost:5000/api/admin/subject/bulk-import', {
                subjects: subjectsArray
            }, { headers });
            setImportStatus(`✅ ${res.data.message}`);
            setJsonInput('');
            fetchSubjects();
            setTimeout(() => { setShowJsonModal(false); setImportStatus(''); }, 2000);
        } catch (error) {
            if (error instanceof SyntaxError) {
                setImportStatus('❌ Invalid JSON format');
            } else {
                setImportStatus(`❌ ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setJsonInput(ev.target.result);
        reader.readAsText(file);
    };

    // Semesters for the selected filter department
    const filterSemesters = filterDept
        ? departments.find(d => d.name === filterDept)?.semesters || []
        : [];

    const formSemesters = newDept
        ? departments.find(d => d.name === newDept)?.semesters || []
        : [];

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Action Bar */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <ListTree className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-none">Curriculum Console</h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 opacity-70">Syllabus & Academic Structure</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowDeptForm(!showDeptForm)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors border ${
                            showDeptForm ? 'bg-red-600 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}>
                        <Building2 className="w-4 h-4" /> Depts
                    </button>
                    <button onClick={() => setShowJsonModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-black transition-colors">
                        <Upload className="w-4 h-4" /> Bulk Import
                    </button>
                </div>
            </div>

            {/* Department Shelf */}
            {showDeptForm && (
                <div className="bg-gray-50 border-b border-gray-100 p-6 animate-in slide-in-from-top duration-300">
                    <div className="max-w-5xl mx-auto space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest">Manage Departments</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {departments.map(dept => (
                                <div key={dept._id} className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:border-red-200 group">
                                    <span className="text-red-600">{dept.name}</span>
                                    <span className="opacity-60">{dept.fullName}</span>
                                    <button onClick={() => handleDeleteDepartment(dept._id)} className="ml-1 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleCreateDepartment} className="flex gap-2 max-w-xl">
                            <input type="text" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)}
                                placeholder="Code" className="w-20 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500" />
                            <input type="text" value={newDeptFullName} onChange={(e) => setNewDeptFullName(e.target.value)}
                                placeholder="Department Full Name" className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500" />
                            <button type="submit" className="px-4 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700">Add</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Workspace */}
            <div className="flex-1 flex min-h-0">
                {/* Left: Subjects List */}
                <div className="w-72 flex flex-col border-r border-gray-100 bg-gray-50/30 flex-shrink-0">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Syllabus</span>
                        <div className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{subjects.length}</div>
                    </div>
                    
                    <div className="p-4 space-y-3 bg-white border-b border-gray-100">
                        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
                            <option value="">All Departments</option>
                            {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                        </select>
                        <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)} disabled={!filterDept}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none disabled:opacity-50">
                            <option value="">All Semesters</option>
                            {filterSemesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
                        {subjects.map(subject => (
                            <button key={subject._id} onClick={() => { setActiveSubject(subject); setActiveTopicId(null); }}
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
                                    <div className={`text-[10px] font-bold uppercase mt-1 opacity-60`}>
                                        {subject.department} • <span className={activeSubject?._id === subject._id ? 'text-white' : 'text-red-600'}>Sem {subject.semester}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleCreateSubject} className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <select value={newDept} onChange={(e) => setNewDept(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500">
                                    <option value="">Dept</option>
                                    {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                </select>
                                <select value={newSem} onChange={(e) => setNewSem(e.target.value)} disabled={!newDept}
                                    className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500">
                                    <option value="">Sem</option>
                                    {formSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <input type="text" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)}
                                placeholder="Code" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none" />
                            <div className="flex gap-2">
                                <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)}
                                    placeholder="Subject" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none" />
                                <button type="submit" className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-transform active:scale-95">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Detailed Content */}
                <div className="flex-1 flex flex-col min-h-0 bg-gray-50/20">
                    {activeSubject ? (
                        <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-500">
                            {/* Detailed Header */}
                            <div className="px-10 py-8 border-b border-gray-100 bg-white flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/20">
                                        <BookOpen className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{activeSubject.subjectName}</h2>
                                            <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-200">
                                                {activeSubject.courseCode}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1.5">
                                            <div className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                <Building2 className="w-3.5 h-3.5 mr-1.5" /> {activeSubject.department}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                            <div className="flex items-center text-[11px] font-bold text-red-500 uppercase tracking-wider">
                                                <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Semester {activeSubject.semester}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleDeleteSubject} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Dual Hierarchy Editor */}
                            <div className="flex-1 flex min-h-0 divide-x divide-gray-100 overflow-hidden">
                                {/* Left: Topics List */}
                                <div className="w-2/5 flex flex-col overflow-hidden min-h-0">
                                    <div className="px-8 py-6 border-b border-gray-50 bg-white flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                            <Layout className="w-4 h-4 mr-2" /> Learning Units
                                        </h3>
                                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">{activeSubject.topics.length} Units</span>
                                    </div>
                                    
                                    <div className="p-6 bg-white border-b border-gray-50">
                                        <form onSubmit={handleAddTopic} className="relative group">
                                            <input type="text" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)}
                                                placeholder="New Academic Unit..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 pr-12 text-sm font-bold focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all" />
                                            <button type="submit" className="absolute right-1.5 top-1.5 p-2 bg-gray-900 text-white rounded-lg hover:bg-black shadow-sm group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar bg-gray-50/30">
                                        {activeSubject.topics.map((topic, idx) => (
                                            <div key={topic._id} onClick={() => setActiveTopicId(topic._id)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                                                    activeTopicId === topic._id 
                                                    ? 'bg-white border-red-200 shadow-sm ring-1 ring-red-500/10' 
                                                    : 'bg-white/40 border-transparent hover:bg-white hover:border-gray-200'
                                                }`}>
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                                        activeTopicId === topic._id ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                        {idx + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className={`text-sm font-bold truncate ${activeTopicId === topic._id ? 'text-gray-900' : 'text-gray-500'}`}>{topic.topicName}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{topic.subtopics.length} Chapters</div>
                                                    </div>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic._id); }}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-opacity">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Chapters Detail */}
                                <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white">
                                    {activeTopicId ? (
                                        <div className="flex flex-col h-full overflow-hidden animate-in slide-in-from-right-4 duration-300">
                                            <div className="px-8 py-6 border-b border-gray-50 bg-white">
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Content Breakdown</h3>
                                                <div className="flex items-center justify-between">
                                                    <div className="bg-red-50/50 px-4 py-2 rounded-xl border border-red-50 shrink-0">
                                                        <div className="text-[9px] font-black text-red-400 uppercase leading-none mb-1">Editing Unit:</div>
                                                        <h4 className="text-sm font-bold text-gray-900 leading-none">
                                                            {activeSubject.topics.find(t => t._id === activeTopicId)?.topicName}
                                                        </h4>
                                                    </div>
                                                    <div className="flex-1 ml-4 max-w-sm">
                                                        <form onSubmit={handleAddSubtopic} className="flex gap-2">
                                                            <input type="text" value={newSubtopicName} onChange={(e) => setNewSubtopicName(e.target.value)}
                                                                placeholder="Add Chapter Objective..." className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-red-500/10 outline-none transition-all" />
                                                            <button type="submit" className="p-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition shadow-sm shrink-0">
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-8 space-y-2 custom-scrollbar">
                                                {activeSubject.topics.find(t => t._id === activeTopicId)?.subtopics.map((sub, idx) => (
                                                    <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-[13px] font-semibold text-gray-600 flex items-center justify-between group hover:bg-white hover:border-red-100 transition-all">
                                                        <div className="flex items-center">
                                                            <span className="text-[10px] text-red-400 mr-3 opacity-40 italic">{idx + 1}.</span>
                                                            {sub}
                                                        </div>
                                                        <button onClick={() => handleDeleteSubtopic(activeTopicId, sub)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-opacity">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {activeSubject.topics.find(t => t._id === activeTopicId)?.subtopics.length === 0 && (
                                                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-50 rounded-[2rem] opacity-30 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                                        Null Content Detected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
                                            <ListTree className="w-16 h-16 mb-6" />
                                            <h3 className="text-sm font-black uppercase tracking-[0.3em]">Select Unit Hierarchy</h3>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 animate-in fade-in zoom-in-95">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8 border border-gray-100 shadow-inner">
                                <BookOpen className="w-10 h-10 text-gray-200" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Management Console Offline</h2>
                            <p className="max-w-xs mx-auto text-xs text-gray-400 font-bold uppercase tracking-widest mt-3 leading-relaxed">
                                Deploy a master subject from the centralized registry to authorize syllabus modifications and structural audits.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Import Modal - Standardized Scale */}
            {showJsonModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <FileJson className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Bulk Sync System</h2>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">JSON Structural Deployment</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowJsonModal(false); setImportStatus(''); }} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
                            <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                                <input type="file" accept=".json" onChange={handleFileUpload}
                                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white hover:file:bg-red-700 transition cursor-pointer" />
                            </div>

                            <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} rows={8}
                                placeholder="[ { 'department': 'CO', ... } ]"
                                className="w-full bg-gray-900 text-red-400 font-mono text-[11px] p-6 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 transition-all shadow-inner" />

                            {importStatus && (
                                <div className={`p-4 rounded-xl text-xs font-bold ${
                                    importStatus.startsWith('✅') ? 'bg-green-100 text-green-700' : 
                                    importStatus.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {importStatus}
                                </div>
                            )}
                        </div>

                        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
                            <button onClick={() => { setShowJsonModal(false); setImportStatus(''); }}
                                className="px-6 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-white rounded-xl transition">Cancel</button>
                            <button onClick={handleJsonImport} disabled={!jsonInput.trim()}
                                className="px-8 py-2.5 bg-red-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 disabled:opacity-50 transition shadow-lg shadow-red-500/20 active:scale-95">Initiate Sync</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurriculumManagement;
