import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Brain, CheckCircle, XCircle, Trophy, RefreshCw, AlertTriangle } from 'lucide-react';

const AITestModal = ({ isOpen, onClose, sessionData, onTestComplete }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [testData, setTestData] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [savingScore, setSavingScore] = useState(false);

    useEffect(() => {
        if (isOpen && sessionData && !testData && !error) {
            generateTest();
        }
    }, [isOpen, sessionData]);

    const generateTest = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/ai/generate-test', {
                subject: sessionData.subject,
                topic: sessionData.topic,
                subtopic: sessionData.subtopic,
                durationMinutes: sessionData.durationMinutes,
                notes: sessionData.notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.error) {
                setError(res.data.error);
            } else if (res.data.questions && res.data.questions.length > 0) {
                setTestData(res.data);
            } else {
                setError("Failed to generate test. Missing questions from AI response.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to generate AI test.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qIndex, option) => {
        if (isSubmitted) return;
        setUserAnswers({ ...userAnswers, [qIndex]: option });
    };

    const handleSubmitTest = async () => {
        if (!testData || !testData.questions) return;
        
        // Calculate score
        let correctCount = 0;
        testData.questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                correctCount++;
            }
        });
        
        const calculatedScore = Math.round((correctCount / testData.questions.length) * 100);
        setScore(calculatedScore);
        setIsSubmitted(true);
        
        // Save score and test payload to backend
        setSavingScore(true);
        try {
            const token = localStorage.getItem('token');
            
            // Build the testData payload to save the context
            const testPayload = {
                questions: testData.questions.map((q, qIndex) => ({
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    userAnswer: userAnswers[qIndex] || null,
                    isCorrect: userAnswers[qIndex] === q.correctAnswer
                }))
            };

            await axios.patch(`http://localhost:5000/study/${sessionData._id}/score`, {
                testScore: calculatedScore,
                testData: testPayload
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (onTestComplete) {
                onTestComplete(calculatedScore);
            }
        } catch (error) {
            console.error('Failed to save test score:', error);
        } finally {
            setSavingScore(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 px-4 backdrop-blur-md overflow-y-auto">
            <div className="bg-white dark:bg-darkCard rounded-3xl shadow-2xl w-full max-w-3xl my-8 relative border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]">
                
                {/* Header fixed at top */}
                <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-darkCard rounded-t-3xl z-10">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 flex items-center">
                            <Brain className="w-6 h-6 mr-3 text-primary-500" />
                            AI Knowledge <span className="text-primary-600 ml-2">Check</span>
                        </h2>
                        {sessionData && (
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 bg-gray-50 dark:bg-slate-800 inline-block px-3 py-1 rounded">
                                {sessionData.subject} {sessionData.topic && `• ${sessionData.topic}`}
                            </p>
                        )}
                    </div>
                    {(error || isSubmitted || (!loading && !testData)) && (
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors bg-gray-50 dark:bg-slate-800 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 relative">
                                <div className="absolute inset-0 border-4 border-gray-100 dark:border-gray-800 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                <Brain className="w-8 h-8 text-primary-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Analyzing your session...</h3>
                            <p className="mt-2 text-gray-500 text-sm max-w-xs leading-relaxed">
                                Our AI is reading your notes and generating a custom evaluation to test your understanding.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Generation Failed</h3>
                            <p className="text-red-500 text-sm max-w-md mx-auto mb-6 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 font-medium">
                                {error}
                            </p>
                            <button
                                onClick={generateTest}
                                className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center mx-auto"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </button>
                        </div>
                    ) : testData && testData.questions ? (
                        <div className="space-y-8">
                            {testData.questions.map((q, qIndex) => (
                                <div key={qIndex} className={`p-6 md:p-8 rounded-2xl border transition-all ${
                                    isSubmitted 
                                        ? userAnswers[qIndex] === q.correctAnswer
                                            ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30'
                                            : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                                        : 'bg-white dark:bg-slate-800/50 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800/50'
                                }`}>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 shrink-0 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center font-black text-sm">
                                            {qIndex + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
                                                {q.question}
                                            </h4>
                                            <div className="space-y-3">
                                                {q.options.map((option, oIndex) => {
                                                    const isSelected = userAnswers[qIndex] === option;
                                                    const isCorrect = option === q.correctAnswer;
                                                    
                                                    let optionClasses = "w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden ";
                                                    
                                                    if (!isSubmitted) {
                                                        optionClasses += isSelected 
                                                            ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300 shadow-sm"
                                                            : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-slate-700/50";
                                                    } else {
                                                        optionClasses += "cursor-default text-gray-500 dark:text-gray-400 border-transparent bg-gray-50 dark:bg-slate-800/50 "
                                                        if (isCorrect) {
                                                            optionClasses = "w-full text-left p-4 rounded-xl border relative overflow-hidden cursor-default bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300 font-bold z-10 shadow-sm";
                                                        } else if (isSelected && !isCorrect) {
                                                            optionClasses = "w-full text-left p-4 rounded-xl border relative overflow-hidden cursor-default bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-400 line-through opacity-80 z-10";
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={oIndex}
                                                            onClick={() => handleOptionSelect(qIndex, option)}
                                                            className={optionClasses}
                                                            disabled={isSubmitted}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className={`w-5 h-5 shrink-0 rounded-full border-2 mr-3 flex items-center justify-center
                                                                    ${!isSubmitted && isSelected ? 'border-primary-500' : ''}
                                                                    ${!isSubmitted && !isSelected ? 'border-gray-300 dark:border-gray-600' : ''}
                                                                    ${isSubmitted && isCorrect ? 'border-green-500 bg-green-500 text-white' : ''}
                                                                    ${isSubmitted && isSelected && !isCorrect ? 'border-red-400 bg-red-400 text-white' : ''}
                                                                    ${isSubmitted && !isSelected && !isCorrect ? 'border-gray-200 dark:border-gray-700 bg-transparent' : ''}
                                                                `}>
                                                                    {!isSubmitted && isSelected && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>}
                                                                    {isSubmitted && isCorrect && <CheckCircle className="w-3 h-3 text-white" />}
                                                                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-3 h-3 text-white" />}
                                                                </div>
                                                                <span className="text-sm">{option}</span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            
                                            {/* Explanation (if provided by AI in future) or just correct feedback */}
                                            {isSubmitted && (
                                                <div className="mt-4 flex items-center">
                                                    {userAnswers[qIndex] === q.correctAnswer ? (
                                                        <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                                            <CheckCircle className="w-3 h-3 mr-1" /> Correct
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
                                                            <XCircle className="w-3 h-3 mr-1" /> Incorrect. The correct answer was: {q.correctAnswer}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* Footer fixed at bottom */}
                {!loading && !error && testData && (
                    <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-900/50 rounded-b-3xl sticky bottom-0 z-10">
                        {!isSubmitted ? (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500">
                                    {Object.keys(userAnswers).length} / {testData.questions.length} Answered
                                </span>
                                <button
                                    onClick={handleSubmitTest}
                                    disabled={Object.keys(userAnswers).length !== testData.questions.length}
                                    className="px-8 py-3 bg-primary-600 text-white rounded-xl font-black text-sm hover:bg-primary-700 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Submit Test
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 
                                        ${score >= 80 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                                          score >= 60 ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                                          'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Final Score</p>
                                        <p className={`text-2xl font-black 
                                            ${score >= 80 ? 'text-green-500' : 
                                              score >= 60 ? 'text-blue-500' : 
                                              'text-orange-500'}`}>
                                            {score}%
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button
                                        onClick={onClose}
                                        disabled={savingScore}
                                        className="flex-1 md:flex-none px-6 py-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 transition"
                                    >
                                        Close
                                    </button>
                                    <a
                                        href={`/test-results/${sessionData._id}`}
                                        className="flex-1 md:flex-none px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm hover:bg-gray-800 dark:hover:bg-gray-100 shadow-xl disabled:opacity-50 transition text-center flex items-center justify-center whitespace-nowrap"
                                        onClick={(e) => {
                                            if (savingScore) e.preventDefault();
                                            onClose();
                                        }}
                                    >
                                        {savingScore ? 'Saving...' : 'Review Test Results'}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AITestModal;
