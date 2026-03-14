import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { HelpCircle, Plus, Trash2, GraduationCap, Clock, Brain, Target, ChevronRight, X } from 'lucide-react';

const Quizzes = () => {
    const { admin } = useContext(AdminAuthContext);
    const [subjects, setSubjects] = useState([]);
    const [activeSubject, setActiveSubject] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newTopic, setNewTopic] = useState('');
    const [timeLimit, setTimeLimit] = useState(30);
    const [difficulty, setDifficulty] = useState('medium');
    const [passingScore, setPassingScore] = useState(40);
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }]);

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const subRes = await axios.get('http://localhost:5000/api/admin/subject', { headers });
            setSubjects(subRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizzes = async (subjectId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/quizzes/${subjectId}`, { headers });
            setQuizzes(res.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    useEffect(() => {
        if (admin) fetchData();
    }, [admin]);

    useEffect(() => {
        if (activeSubject) fetchQuizzes(activeSubject._id);
    }, [activeSubject]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }]);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const handleAddQuiz = async (e) => {
        e.preventDefault();
        if (!activeSubject) return;
        try {
            const res = await axios.post('http://localhost:5000/api/admin/quizzes', {
                title: newTitle,
                description: newDesc,
                subjectId: activeSubject._id,
                topicName: newTopic,
                questions,
                timeLimit,
                difficulty,
                passingScore
            }, { headers });
            setQuizzes([res.data, ...quizzes]);
            setShowAddForm(false);
            resetForm();
        } catch (error) {
            alert('Failed to create quiz');
        }
    };

    const resetForm = () => {
        setNewTitle('');
        setNewDesc('');
        setNewTopic('');
        setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }]);
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm('Delete this quiz?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/quizzes/${id}`, { headers });
            setQuizzes(quizzes.filter(q => q._id !== id));
        } catch (error) {
            alert('Failed to delete quiz');
        }
    };

    if (loading) return <div className="text-center py-10">Loading Assessments...</div>;

    return (
        <div className="flex-1 flex min-h-0 bg-white">
            {/* Subject Selector Sidebar */}
            <div className="w-72 flex flex-col border-r border-gray-100 bg-gray-50/30 flex-shrink-0">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assessment Scope</span>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
                    {subjects.map(subject => (
                        <button key={subject._id} onClick={() => setActiveSubject(subject)}
                            className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                                activeSubject?._id === subject._id 
                                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20' 
                                : 'text-gray-600 bg-white border-transparent hover:bg-white hover:border-gray-200'
                            }`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                activeSubject?._id === subject._id ? 'bg-white/20' : 'bg-red-50 text-red-600'
                            }`}>
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-bold truncate tracking-tight uppercase">{subject.subjectName}</div>
                                <div className="text-[9px] font-bold uppercase mt-1 opacity-60">{subject.courseCode}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-50/20">
                {activeSubject ? (
                    <>
                        <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-black text-gray-900 tracking-tight">{activeSubject.subjectName}</h1>
                                <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mt-1">Quiz Builder & Evaluator</p>
                            </div>
                            <button onClick={() => setShowAddForm(!showAddForm)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition shadow-lg shadow-red-600/20 active:scale-95">
                                <Plus className="w-4 h-4" /> {showAddForm ? 'Close Builder' : 'Create New Quiz'}
                            </button>
                        </div>

                        {showAddForm && (
                            <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar animate-in slide-in-from-top duration-500">
                                <form onSubmit={handleAddQuiz} className="max-w-5xl mx-auto space-y-8 pb-10">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Quiz Title</label>
                                            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Midterm 1" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Topic</label>
                                            <select value={newTopic} onChange={(e) => setNewTopic(e.target.value)} required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500">
                                                <option value="">Select Topic</option>
                                                {activeSubject.topics.map(t => <option key={t._id} value={t.topicName}>{t.topicName}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Difficulty</label>
                                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500">
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Question Builder */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Question Bank ({questions.length})</h3>
                                            <button type="button" onClick={handleAddQuestion}
                                                className="text-[10px] font-black text-red-600 uppercase flex items-center gap-1 hover:underline">
                                                <Plus className="w-3 h-3" /> Add Question
                                            </button>
                                        </div>
                                        
                                        {questions.map((q, qIndex) => (
                                            <div key={qIndex} className="p-6 bg-gray-50 rounded-3xl border border-gray-200 relative group">
                                                <button type="button" onClick={() => handleRemoveQuestion(qIndex)}
                                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="grid grid-cols-4 gap-6">
                                                    <div className="col-span-4 lg:col-span-2 space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase">Question {qIndex + 1}</label>
                                                        <textarea value={q.question} onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)} required
                                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" rows="3" placeholder="Enter question text..." />
                                                    </div>
                                                    <div className="col-span-4 lg:col-span-2 grid grid-cols-2 gap-4">
                                                        {q.options.map((opt, oIndex) => (
                                                            <div key={oIndex} className="space-y-1">
                                                                <label className="text-[10px] font-black text-gray-400">Option {String.fromCharCode(65 + oIndex)}</label>
                                                                <input type="text" value={opt} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} required
                                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase">Correct Answer</label>
                                                        <select value={q.correctAnswer} onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)} required
                                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500">
                                                            <option value="">Select Option</option>
                                                            {q.options.map((opt, oIdx) => opt && <option key={oIdx} value={opt}>{String.fromCharCode(65 + oIdx)}: {opt}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase">Explanation (Optional)</label>
                                                        <input type="text" value={q.explanation} onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="Why is this correct?" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-8 border-t border-gray-100">
                                        <button type="submit" className="px-12 py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">
                                            Publish Evaluation Suite
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {!showAddForm && (
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {quizzes.map(quiz => (
                                        <div key={quiz._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                                                    <Brain className="w-6 h-6" />
                                                </div>
                                                <button onClick={() => handleDeleteQuiz(quiz._id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <h3 className="text-base font-black text-gray-900 mb-1">{quiz.title}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{quiz.topicName}</p>
                                            
                                            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
                                                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                                                    <Clock className="w-4 h-4 text-gray-400 mb-1" />
                                                    <span className="text-[10px] font-black text-gray-900">{quiz.timeLimit}m</span>
                                                </div>
                                                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                                                    <HelpCircle className="w-4 h-4 text-gray-400 mb-1" />
                                                    <span className="text-[10px] font-black text-gray-900">{quiz.questions.length} Qs</span>
                                                </div>
                                                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                                                    <Target className="w-4 h-4 text-gray-400 mb-1" />
                                                    <span className="text-[10px] font-black text-gray-900">{quiz.passingScore}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {quizzes.length === 0 && (
                                    <div className="h-96 flex flex-col items-center justify-center text-center opacity-20">
                                        <HelpCircle className="w-16 h-16 mb-4" />
                                        <p className="text-xs font-black uppercase tracking-[0.3em]">No Evaluations Created Yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
                        <Brain className="w-20 h-20 mb-6" />
                        <h3 className="text-sm font-black uppercase tracking-[0.3em]">Initialize Evaluation Context</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quizzes;
