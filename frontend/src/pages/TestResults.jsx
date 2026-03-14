import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Brain, Trophy, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import TopBar from '../components/TopBar';

const TestResults = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/study/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSession(res.data);
            } catch (err) {
                setError('Failed to fetch test results. They may not exist or you do not have permission.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-darkBg font-sans text-gray-900 dark:text-gray-100 flex flex-col hidden-scrollbar">
                <TopBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-primary-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading detailed analysis...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-darkBg font-sans text-gray-900 dark:text-gray-100 flex flex-col hidden-scrollbar">
                <TopBar />
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div>
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Results Unavailable</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">{error || 'Session not found'}</p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const testData = session.testData;
    const score = session.testScore;

    if (!testData || !testData.questions) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-darkBg font-sans text-gray-900 dark:text-gray-100 flex flex-col hidden-scrollbar">
                <TopBar />
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">No Test Data</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">This study session does not have detailed test results saved.</p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg font-sans text-gray-900 dark:text-gray-100 flex flex-col hidden-scrollbar pb-20">
            <TopBar />

            <div className="container mx-auto px-6 pt-10 pb-6 max-w-4xl">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 w-fit"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </button>

                <div className="bg-white dark:bg-darkCard rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 mb-8 relative overflow-hidden">
                    {/* Header Details */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div>
                            <div className="flex items-center mb-3">
                                <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg mr-3">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black">{session.subject}</h1>
                                    <p className="text-sm font-bold text-gray-400 tracking-wider uppercase mt-1">
                                        {session.topic} {session.subtopic && `• ${session.subtopic}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-4">
                                <span className="flex items-center bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5" /> 
                                    {new Date(session.sessionDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                                    <Clock className="w-3.5 h-3.5 mr-1.5" /> 
                                    {session.durationMinutes} mins studied
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center bg-gray-50 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 
                                ${score >= 80 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                                  score >= 60 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                                  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                <Trophy className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Final Score</p>
                                <p className={`text-3xl font-black 
                                    ${score >= 80 ? 'text-green-500' : 
                                      score >= 60 ? 'text-blue-500' : 
                                      'text-orange-500'}`}>
                                    {score}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-gray-100 flex items-center px-2">
                        Detailed Analysis 
                        <span className="ml-3 text-sm font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-3 py-1 rounded-full">
                            {testData.questions.length} Questions
                        </span>
                    </h3>

                    {testData.questions.map((q, qIndex) => {
                        return (
                            <div key={qIndex} className={`p-6 md:p-8 rounded-2xl transition-all border ${
                                q.isCorrect 
                                    ? 'bg-white dark:bg-slate-800/80 border-green-200 dark:border-green-900/30 relative overflow-hidden' 
                                    : 'bg-white dark:bg-slate-800/80 border-red-200 dark:border-red-900/30 relative overflow-hidden'
                            } shadow-sm`}>
                                
                                <div className="flex gap-4 items-start relative z-10">
                                    <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-black text-sm text-white ${
                                        q.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                        {qIndex + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
                                            {q.question}
                                        </h4>
                                        <div className="space-y-3">
                                            {q.options.map((option, oIndex) => {
                                                const isSelected = option === q.userAnswer;
                                                const isActualCorrect = option === q.correctAnswer;
                                                
                                                let optionClasses = "w-full text-left p-4 rounded-xl border relative overflow-hidden cursor-default transition-all ";
                                                
                                                if (isActualCorrect) {
                                                    optionClasses += "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300 font-bold shadow-sm";
                                                } else if (isSelected && !isActualCorrect) {
                                                    optionClasses += "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-400 opacity-80";
                                                } else {
                                                    optionClasses += "bg-gray-50 dark:bg-slate-800/50 border-transparent text-gray-500 dark:text-gray-400";
                                                }

                                                return (
                                                    <div key={oIndex} className={optionClasses}>
                                                        <div className="flex items-center">
                                                            <div className={`w-5 h-5 shrink-0 rounded-full mr-3 flex items-center justify-center
                                                                ${isActualCorrect ? 'bg-green-500 text-white' : ''}
                                                                ${isSelected && !isActualCorrect ? 'bg-red-400 text-white' : ''}
                                                                ${!isSelected && !isActualCorrect ? 'bg-gray-200 dark:bg-gray-700' : ''}
                                                            `}>
                                                                {isActualCorrect && <CheckCircle className="w-3 h-3 text-white" />}
                                                                {isSelected && !isActualCorrect && <XCircle className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <span className="text-sm ${isSelected && !isActualCorrect ? 'line-through' : ''}">{option}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {!q.userAnswer && (
                                            <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg text-xs font-bold border border-orange-100 dark:border-orange-900/30">
                                                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                                                Unanswered
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TestResults;
