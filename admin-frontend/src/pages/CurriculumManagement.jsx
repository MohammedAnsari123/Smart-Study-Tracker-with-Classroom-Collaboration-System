import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Plus, Layout, ListTree, ChevronRight, ChevronDown, Trash2, X, Upload, FileJson, Building2, GraduationCap, BookOpen, Clock, CheckCircle2, Save, Type, AlignLeft, Layers } from 'lucide-react';

const CurriculumManagement = () => {
    const { admin } = useContext(AdminAuthContext);
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & Forms
    const [filterDept, setFilterDept] = useState('');
    const [filterSem, setFilterSem] = useState('');
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newDept, setNewDept] = useState('');
    const [newSem, setNewSem] = useState('');
    const [newDeptName, setNewDeptName] = useState('');
    const [newDeptFullName, setNewDeptFullName] = useState('');
    const [showDeptForm, setShowDeptForm] = useState(false);

    // Draft State for 5-level editing
    const [activeSubject, setActiveSubject] = useState(null);
    const [draftCurriculum, setDraftCurriculum] = useState(null); // { description, chapters }
    const [isSaving, setIsSaving] = useState(false);
    
    // UI State for Accordions
    const [expandedChapters, setExpandedChapters] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    
    // JSON Modal
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
            
            // Update active subject draft if it was open
            if (activeSubject) {
                const updatedActive = res.data.find(s => s._id === activeSubject._id);
                if (updatedActive) {
                    setActiveSubject(updatedActive);
                }
            }
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
        if (admin) { fetchDepartments(); fetchSubjects(); }
    }, [admin]);

    useEffect(() => {
        if (admin) fetchSubjects();
    }, [filterDept, filterSem]);

    // When active subject changes, clone its data into draft
    useEffect(() => {
        if (activeSubject) {
            setDraftCurriculum({
                description: activeSubject.description || '',
                chapters: JSON.parse(JSON.stringify(activeSubject.chapters || []))
            });
            setExpandedChapters({});
            setExpandedTopics({});
        } else {
            setDraftCurriculum(null);
        }
    }, [activeSubject]);

    // --- Department Management ---
    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        if (!newDeptName.trim() || !newDeptFullName.trim()) return;
        try {
            await axios.post('http://localhost:5000/api/admin/subject/departments', {
                name: newDeptName, fullName: newDeptFullName, semesters: [1, 2, 3, 4, 5, 6]
            }, { headers });
            setNewDeptName(''); setNewDeptFullName(''); setShowDeptForm(false); fetchDepartments();
        } catch (error) { alert(error.response?.data?.message || 'Failed to create department'); }
    };

    const handleDeleteDepartment = async (id) => {
        if (!window.confirm('Delete this department?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/subject/departments/${id}`, { headers });
            fetchDepartments();
        } catch (error) { alert('Failed to delete department'); }
    };

    // --- Subject Core CRUD ---
    const handleCreateSubject = async (e) => {
        e.preventDefault();
        if (!newSubjectName.trim() || !newCourseCode.trim() || !newDept || !newSem) return;
        try {
            const res = await axios.post('http://localhost:5000/api/admin/subject', {
                subjectName: newSubjectName, courseCode: newCourseCode, department: newDept, semester: Number(newSem)
            }, { headers });
            setNewSubjectName(''); setNewCourseCode(''); fetchSubjects(); setActiveSubject(res.data);
        } catch (error) { alert('Failed to create subject'); }
    };

    const handleDeleteSubject = async () => {
        if (!activeSubject || !window.confirm(`Delete "${activeSubject.subjectName}"?`)) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/subject/${activeSubject._id}`, { headers });
            setActiveSubject(null); fetchSubjects();
        } catch (error) { alert('Failed to delete subject'); }
    };

    // --- 5-Level Draft Mutators ---
    const saveCurriculum = async () => {
        if (!activeSubject || !draftCurriculum) return;
        setIsSaving(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/admin/subject/${activeSubject._id}`, draftCurriculum, { headers });
            setActiveSubject(res.data);
            const updated = subjects.map(s => s._id === res.data._id ? res.data : s);
            setSubjects(updated);
            alert('Curriculum Updated Successfully!');
        } catch (error) {
            alert('Failed to save curriculum');
        } finally {
            setIsSaving(false);
        }
    };

    const addChapter = () => {
        setDraftCurriculum(prev => ({
            ...prev,
            chapters: [...prev.chapters, { chapterName: 'New Chapter', description: '', topics: [] }]
        }));
    };

    const deleteChapter = (cIndex) => {
        if(!window.confirm('Delete Chapter?')) return;
        const newChapters = [...draftCurriculum.chapters];
        newChapters.splice(cIndex, 1);
        setDraftCurriculum({ ...draftCurriculum, chapters: newChapters });
    };

    const addTopic = (cIndex) => {
        const newChapters = [...draftCurriculum.chapters];
        newChapters[cIndex].topics.push({ topicName: 'New Topic', description: '', subtopics: [] });
        setDraftCurriculum({ ...draftCurriculum, chapters: newChapters });
        setExpandedChapters({ ...expandedChapters, [cIndex]: true });
    };

    const deleteTopic = (cIndex, tIndex) => {
        if(!window.confirm('Delete Topic?')) return;
        const newChapters = [...draftCurriculum.chapters];
        newChapters[cIndex].topics.splice(tIndex, 1);
        setDraftCurriculum({ ...draftCurriculum, chapters: newChapters });
    };

    const addSubtopic = (cIndex, tIndex) => {
        const newChapters = [...draftCurriculum.chapters];
        newChapters[cIndex].topics[tIndex].subtopics.push({ name: 'New Subtopic', description: '', details: '' });
        setDraftCurriculum({ ...draftCurriculum, chapters: newChapters });
        setExpandedTopics({ ...expandedTopics, [`${cIndex}-${tIndex}`]: true });
    };

    const deleteSubtopic = (cIndex, tIndex, sIndex) => {
        if(!window.confirm('Delete Subtopic?')) return;
        const newChapters = [...draftCurriculum.chapters];
        newChapters[cIndex].topics[tIndex].subtopics.splice(sIndex, 1);
        setDraftCurriculum({ ...draftCurriculum, chapters: newChapters });
    };

    const updateSubjectField = (field, value) => {
        setDraftCurriculum({ ...draftCurriculum, [field]: value });
    };

    const updateChapter = (cIndex, field, value) => {
        const newChapters = [...draftCurriculum.chapters];
        newChapters[cIndex][field] = value;
        setDraftCurriculum({ ...draftCurriculum, chapters: newChapters });
    };

    const updateTopic = (cIndex, tIndex, field, value) => {
        const newChapters = [...draftCurriculum.chapters];
        newChapters[cIndex].topics[tIndex][field] = value;
        setDraftCurriculum({ ...draftCurriculum, chapters: newChapters });
    };

    const updateSubtopic = (cIndex, tIndex, sIndex, field, value) => {
        const newChapters = [...draftCurriculum.chapters];
        newChapters[cIndex].topics[tIndex].subtopics[sIndex][field] = value;
        setDraftCurriculum({ ...draftCurriculum, chapters: newChapters });
    };

    const toggleChapter = (cIndex) => setExpandedChapters(prev => ({ ...prev, [cIndex]: !prev[cIndex] }));
    const toggleTopic = (key) => setExpandedTopics(prev => ({ ...prev, [key]: !prev[key] }));

    // --- JSON Bulk Import ---
    const handleJsonImport = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const subjectsArray = Array.isArray(parsed) ? parsed : parsed.subjects ? parsed.subjects : [parsed];
            setImportStatus('Importing...');
            const res = await axios.post('http://localhost:5000/api/admin/subject/bulk-import', { subjects: subjectsArray }, { headers });
            setImportStatus(`✅ ${res.data.message}`); setJsonInput(''); fetchSubjects();
            setTimeout(() => { setShowJsonModal(false); setImportStatus(''); }, 2000);
        } catch (error) {
            setImportStatus(error instanceof SyntaxError ? '❌ Invalid JSON format' : `❌ ${error.response?.data?.message || error.message}`);
        }
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader(); reader.onload = (ev) => setJsonInput(ev.target.result); reader.readAsText(file);
    };

    const filterSemesters = filterDept ? departments.find(d => d.name === filterDept)?.semesters || [] : [];
    const formSemesters = newDept ? departments.find(d => d.name === newDept)?.semesters || [] : [];

    if (loading) return <div className="text-center py-10">Loading...</div>;

    const hasUnsavedChanges = draftCurriculum && JSON.stringify(draftCurriculum) !== JSON.stringify({ description: activeSubject.description || '', chapters: activeSubject.chapters || [] });

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
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 opacity-70">5-Layer Structural Hierarchy</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowDeptForm(!showDeptForm)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors border ${showDeptForm ? 'bg-red-600 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
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
                        <div className="flex flex-wrap gap-2">
                            {departments?.map(dept => (
                                <div key={dept._id} className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:border-red-200 group">
                                    <span className="text-red-600">{dept.name}</span> <span className="opacity-60">{dept.fullName}</span>
                                    <button onClick={() => handleDeleteDepartment(dept._id)} className="ml-1 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity"><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleCreateDepartment} className="flex gap-2 max-w-xl">
                            <input type="text" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} placeholder="Code" className="w-20 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500" />
                            <input type="text" value={newDeptFullName} onChange={(e) => setNewDeptFullName(e.target.value)} placeholder="Department Full Name" className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500" />
                            <button type="submit" className="px-4 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700">Add</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Workspace */}
            <div className="flex-1 flex min-h-0 bg-gray-50">
                {/* Left: Subjects Sidebar */}
                <div className="w-72 flex flex-col border-r border-gray-100 bg-white flex-shrink-0 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                    <div className="p-4 space-y-3 border-b border-gray-100 bg-gray-50/50">
                        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-red-500">
                            <option value="">All Departments</option>
                            {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                        </select>
                        <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)} disabled={!filterDept} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none disabled:opacity-50 focus:ring-1 focus:ring-red-500">
                            <option value="">All Semesters</option>
                            {filterSemesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
                        {subjects.map(subject => (
                            <button key={subject._id} onClick={() => { 
                                    if(hasUnsavedChanges && !window.confirm('Discard unsaved changes?')) return;
                                    setActiveSubject(subject); 
                                }}
                                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${activeSubject?._id === subject._id ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' : 'text-gray-600 bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${activeSubject?._id === subject._id ? 'bg-white/20' : 'bg-red-50 text-red-600'}`}>
                                    <GraduationCap className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-bold truncate leading-tight tracking-tight">{subject.subjectName}</div>
                                    <div className={`text-[9px] font-bold uppercase mt-1 opacity-80 ${activeSubject?._id === subject._id ? 'text-white' : 'text-gray-400'}`}>
                                        {subject.department} • <span className={activeSubject?._id === subject._id ? "text-red-200" : "text-red-500"}>Sem {subject.semester}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                        <form onSubmit={handleCreateSubject} className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold outline-none">
                                    <option value="">Dept</option>{departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                </select>
                                <select value={newSem} onChange={(e) => setNewSem(e.target.value)} disabled={!newDept} className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold outline-none disabled:opacity-50">
                                    <option value="">Sem</option>{formSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <input type="text" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} placeholder="Course Code" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-bold outline-none" />
                            <div className="flex gap-2">
                                <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="Subject Name" className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none" />
                                <button type="submit" className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-transform active:scale-95"><Plus className="w-4 h-4" /></button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: 5-Layer Editor */}
                <div className="flex-1 flex flex-col min-h-0 relative">
                    {activeSubject && draftCurriculum ? (
                        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar animate-in fade-in duration-500 pb-24">
                            
                            {/* Sticky Header with Save Button */}
                            <div className="sticky top-0 z-20 px-10 py-6 border-b border-gray-200 bg-white/90 backdrop-blur-xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{activeSubject.subjectName}</h2>
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[10px] font-black tracking-widest uppercase border border-gray-200">{activeSubject.courseCode}</span>
                                        </div>
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-4">
                                            <span><Building2 className="w-3.5 h-3.5 inline mr-1" /> {activeSubject.department}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="text-red-500"><GraduationCap className="w-3.5 h-3.5 inline mr-1" /> Sem {activeSubject.semester}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="text-gray-400">{draftCurriculum.chapters?.length || 0} Chapters</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={handleDeleteSubject} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={saveCurriculum} 
                                        disabled={isSaving || !hasUnsavedChanges}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                            hasUnsavedChanges 
                                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20 hover:-translate-y-0.5' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}>
                                        <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                                    </button>
                                </div>
                            </div>

                            {/* Syllabus Editor Workspace */}
                            <div className="max-w-5xl w-full mx-auto p-10 space-y-8">
                                
                                {/* L1: Subject Level */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2"><AlignLeft className="w-3 h-3 text-red-500" /> Subject Description</label>
                                    <textarea 
                                        value={draftCurriculum.description} 
                                        onChange={(e) => updateSubjectField('description', e.target.value)}
                                        placeholder="Overview of the entire subject..."
                                        rows={3}
                                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                                        <ListTree className="w-5 h-5 text-red-600" /> Syllabus Chapters
                                    </h3>
                                    <button onClick={addChapter} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md">
                                        <Plus className="w-3.5 h-3.5" /> Add Chapter
                                    </button>
                                </div>

                                {/* L2: Chapters Level */}
                                <div className="space-y-6">
                                    {draftCurriculum.chapters.map((chapter, cIndex) => (
                                        <div key={cIndex} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-gray-300">
                                            
                                            {/* Chapter Header (Drag/Toggle) */}
                                            <div className={`p-4 ${expandedChapters[cIndex] ? 'bg-red-50/30 border-b border-gray-100' : ''} flex items-start gap-4 transition-colors`}>
                                                <button onClick={() => toggleChapter(cIndex)} className="mt-1 p-1 bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    {expandedChapters[cIndex] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                                </button>
                                                
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-black tracking-widest shrink-0">CH {cIndex + 1}</span>
                                                        <input 
                                                            type="text" 
                                                            value={chapter.chapterName} 
                                                            onChange={(e) => updateChapter(cIndex, 'chapterName', e.target.value)}
                                                            className="flex-1 bg-transparent border-none text-base font-bold text-gray-900 outline-none p-0 focus:ring-0 placeholder-gray-300"
                                                            placeholder="Chapter Name"
                                                        />
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 shrink-0">{chapter.topics?.length || 0} Topics</span>
                                                        <button onClick={() => deleteChapter(cIndex)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                    
                                                    {expandedChapters[cIndex] && (
                                                        <textarea 
                                                            value={chapter.description || ''} 
                                                            onChange={(e) => updateChapter(cIndex, 'description', e.target.value)}
                                                            placeholder="Chapter description..."
                                                            rows={2}
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-medium text-gray-600 outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-all resize-none"
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* L3: Topics Level */}
                                            {expandedChapters[cIndex] && (
                                                <div className="p-6 bg-gray-50/50 border-t border-dashed border-gray-200">
                                                    <div className="space-y-4">
                                                        {chapter.topics.map((topic, tIndex) => {
                                                            const tk = `${cIndex}-${tIndex}`;
                                                            return (
                                                                <div key={tIndex} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden pl-1 border-l-4 border-l-red-500">
                                                                    <div className={`p-4 ${expandedTopics[tk] ? 'border-b border-gray-100 bg-gray-50/30' : ''} flex items-start gap-3`}>
                                                                        <button onClick={() => toggleTopic(tk)} className="mt-1 p-0.5 text-gray-400 hover:text-red-600 transition-colors">
                                                                            {expandedTopics[tk] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                                        </button>
                                                                        
                                                                        <div className="flex-1 space-y-2">
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-[10px] font-black text-red-500 tracking-widest shrink-0">{cIndex + 1}.{tIndex + 1}</span>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={topic.topicName} 
                                                                                    onChange={(e) => updateTopic(cIndex, tIndex, 'topicName', e.target.value)}
                                                                                    className="flex-1 bg-transparent border-none text-sm font-bold text-gray-800 outline-none p-0 focus:ring-0 placeholder-gray-300"
                                                                                    placeholder="Topic Name"
                                                                                />
                                                                                <span className="text-[10px] font-bold text-gray-400 truncate w-16 text-right shrink-0">{topic.subtopics?.length || 0} Sub</span>
                                                                                <button onClick={() => deleteTopic(cIndex, tIndex)} className="p-1 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                            </div>
                                                                            
                                                                            {expandedTopics[tk] && (
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={topic.description || ''} 
                                                                                    onChange={(e) => updateTopic(cIndex, tIndex, 'description', e.target.value)}
                                                                                    placeholder="Topic description..."
                                                                                    className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 outline-none focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* L4 & L5: Subtopics Level (Name, Desc, Details) */}
                                                                    {expandedTopics[tk] && (
                                                                        <div className="p-4 bg-gray-50">
                                                                            <div className="space-y-3">
                                                                                {topic.subtopics.map((sub, sIndex) => (
                                                                                    <div key={sIndex} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                                                                                        <button onClick={() => deleteSubtopic(cIndex, tIndex, sIndex)} className="absolute right-3 top-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                                        </button>
                                                                                        
                                                                                        <div className="space-y-3 w-[95%]">
                                                                                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                                                                                <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[9px] font-black shrink-0">{String.fromCharCode(97 + sIndex)}</span>
                                                                                                <input 
                                                                                                    type="text" 
                                                                                                    value={sub.name} 
                                                                                                    onChange={(e) => updateSubtopic(cIndex, tIndex, sIndex, 'name', e.target.value)}
                                                                                                    placeholder="Subtopic Name"
                                                                                                    className="flex-1 bg-transparent border-none text-xs font-black text-gray-900 uppercase tracking-widest outline-none p-0 focus:ring-0"
                                                                                                />
                                                                                            </div>
                                                                                            
                                                                                            <div>
                                                                                                <label className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1 block">Brief Description</label>
                                                                                                <input 
                                                                                                    type="text" 
                                                                                                    value={sub.description || ''} 
                                                                                                    onChange={(e) => updateSubtopic(cIndex, tIndex, sIndex, 'description', e.target.value)}
                                                                                                    placeholder="Short context..."
                                                                                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:ring-1 focus:ring-red-500"
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Detailed Depth (AI Prompt Context)</label>
                                                                                                <textarea 
                                                                                                    value={sub.details || ''} 
                                                                                                    onChange={(e) => updateSubtopic(cIndex, tIndex, sIndex, 'details', e.target.value)}
                                                                                                    placeholder="Exhaustive details for AI learning..."
                                                                                                    rows={2}
                                                                                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 outline-none focus:ring-1 focus:ring-red-500 resize-y"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                                <button onClick={() => addSubtopic(cIndex, tIndex)} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-1">
                                                                                    <Plus className="w-3.5 h-3.5" /> Add Subtopic
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                        <button onClick={() => addTopic(cIndex)} className="w-full py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1 shadow-sm">
                                                            <Plus className="w-3.5 h-3.5" /> Add Topic
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {draftCurriculum.chapters.length === 0 && (
                                        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl opacity-50">
                                            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Chapters Found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 animate-in fade-in zoom-in-95 bg-gray-50">
                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                                <BookOpen className="w-12 h-12 text-gray-200" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Management Console Offline</h2>
                            <p className="max-w-sm mx-auto text-xs text-gray-400 font-bold tracking-widest mt-4 leading-relaxed bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                                Select a subject from the left panel to access the 5-Layer Syllabus Editor and manage deeply nested curriculum nodes.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Import Modal */}
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
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">5-Level JSON Deployment</p>
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
                                placeholder="[ { 'department': 'CO', 'chapters': [ ... ] } ]"
                                className="w-full bg-gray-900 text-red-400 font-mono text-[11px] p-6 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 transition-all shadow-inner" />

                            {importStatus && (
                                <div className={`p-4 rounded-xl text-xs font-bold ${importStatus.startsWith('✅') ? 'bg-green-100 text-green-700' : importStatus.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {importStatus}
                                </div>
                            )}
                        </div>

                        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
                            <button onClick={() => { setShowJsonModal(false); setImportStatus(''); }} className="px-6 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-white rounded-xl transition">Cancel</button>
                            <button onClick={handleJsonImport} disabled={!jsonInput.trim()} className="px-8 py-2.5 bg-red-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 disabled:opacity-50 transition shadow-lg shadow-red-500/20 active:scale-95">Initiate Sync</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurriculumManagement;
