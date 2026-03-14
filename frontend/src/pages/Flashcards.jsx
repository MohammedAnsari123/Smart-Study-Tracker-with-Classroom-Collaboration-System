import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import { Brain, Plus, ChevronLeft, Trash2, Sparkles, Loader2, Info } from 'lucide-react';

const Flashcards = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCard, setNewCard] = useState({ question: '', answer: '', difficulty: 'medium' });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/subject', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setLoading(false);
        }
    };

    const fetchFlashcards = async (subjectId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/flashcards/subject/${subjectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFlashcards(res.data);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        fetchFlashcards(subject._id);
    };

    const handleAddCard = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/flashcards/create',
                { ...newCard, subjectId: selectedSubject._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowAddModal(false);
            setNewCard({ question: '', answer: '', difficulty: 'medium' });
            fetchFlashcards(selectedSubject._id);
        } catch (error) {
            console.error('Error adding flashcard:', error);
        }
    };

    const handleAIGenerate = async () => {
        if (!selectedSubject) return;
        setGeneratingAI(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/flashcards/ai-generate/${selectedSubject._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchFlashcards(selectedSubject._id);
        } catch (error) {
            console.error('Error generating AI flashcards:', error);
            alert('Failed to generate cards. Make sure AI service is running.');
        } finally {
            setGeneratingAI(false);
        }
    };

    const deleteCard = async (id) => {
        if (!window.confirm("Delete this flashcard?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/flashcards/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchFlashcards(selectedSubject._id);
        } catch (error) {
            console.error('Error deleting flashcard:', error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg pb-12">
            <TopBar />
            <div className="max-w-6xl mx-auto px-4 py-8">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <Brain className="w-8 h-8 text-primary-500" /> Flashcard Vault
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Master your subjects with AI-powered active recall.</p>
                    </div>
                </div>

                {!selectedSubject ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subjects.map(sub => (
                            <button
                                key={sub._id}
                                onClick={() => handleSubjectSelect(sub)}
                                className="p-8 bg-white dark:bg-darkCard rounded-3xl border border-gray-100 dark:border-gray-800 text-left hover:border-primary-500 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary-500/5"
                            >
                                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{sub.subjectName}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {sub.topics?.length || 0} Core Topics • Click to manage cards
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-400 hover:text-primary-500"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{selectedSubject.subjectName}</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{flashcards.length} Total Cards</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAIGenerate}
                                    disabled={generatingAI}
                                    className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all ${generatingAI ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                                >
                                    {generatingAI ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                    ) : (
                                        <><Sparkles className="w-4 h-4" /> AI Generate</>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                                >
                                    <Plus className="w-4 h-4" /> Manual Add
                                </button>
                            </div>
                        </div>

                        {generatingAI && (
                            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 p-6 rounded-3xl flex items-center gap-4 animate-pulse">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-2xl flex items-center justify-center text-primary-600">
                                    <Sparkles className="w-6 h-6 animate-bounce" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary-900 dark:text-primary-100">AI is analyzing {selectedSubject.subjectName}...</h4>
                                    <p className="text-sm text-primary-700 dark:text-primary-300 italic">Generating smart flashcards based on your curriculum topics.</p>
                                </div>
                            </div>
                        )}

                        {flashcards.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {flashcards.map((card) => (
                                    <div
                                        key={card._id}
                                        className="group bg-white dark:bg-darkCard rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all flex flex-col h-full overflow-hidden"
                                    >
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-2 py-1 bg-gray-50 dark:bg-slate-800 rounded text-[10px] font-black text-gray-400 uppercase tracking-widest">Question</span>
                                                <button
                                                    onClick={() => deleteCard(card._id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-gray-900 dark:text-white font-bold leading-relaxed">
                                                {card.question}
                                            </p>
                                        </div>

                                        <div className="px-6 py-5 bg-primary-50/50 dark:bg-slate-800/50 border-t border-gray-50 dark:border-gray-800">
                                            <span className="block text-[10px] font-black text-primary-500 uppercase tracking-widest mb-2">Answer</span>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                {card.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !generatingAI && (
                                <div className="py-20 text-center bg-white dark:bg-darkCard rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No cards here yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto">
                                        Use the "AI Generate" button to instantly create study material from your curriculum.
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* Manual Add Card Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-darkCard rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 glassmorphism">
                            <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white uppercase tracking-tighter">New Flashcard</h2>
                            <form onSubmit={handleAddCard} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Question</label>
                                    <textarea
                                        required
                                        className="w-full p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                        rows="3"
                                        placeholder="What concept do you want to test?"
                                        value={newCard.question}
                                        onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Answer</label>
                                    <textarea
                                        required
                                        className="w-full p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                        rows="3"
                                        placeholder="What is the key takeaway?"
                                        value={newCard.answer}
                                        onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition"
                                    >
                                        Create Card
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flashcards;
