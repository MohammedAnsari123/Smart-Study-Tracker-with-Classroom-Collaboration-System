import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Play, Pause, RotateCcw, Coffee, Book, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';

const PomodoroTimer = ({ onSessionComplete }) => {
    const [workMinutes, setWorkMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [seconds, setSeconds] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isWorkMode, setIsWorkMode] = useState(true);
    const [distractions, setDistractions] = useState(0);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [focusScore, setFocusScore] = useState(5);

    const initialSeconds = isWorkMode ? workMinutes * 60 : breakMinutes * 60;
    const timerRef = useRef(null);

    // Distraction Tracking Logic
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive && isWorkMode) {
                setDistractions(prev => prev + 1);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isActive, isWorkMode]);

    useEffect(() => {
        if (isActive && seconds > 0) {
            timerRef.current = setInterval(() => {
                setSeconds(s => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            clearInterval(timerRef.current);
            setIsActive(false);
            if (isWorkMode) setShowRatingModal(true);
            else alert("Break over! Ready to focus?");
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, seconds, isWorkMode]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        const currentInitial = isWorkMode ? workMinutes * 60 : breakMinutes * 60;
        setSeconds(currentInitial);
        setDistractions(0);
    };

    const toggleMode = () => {
        const nextModeIsWork = !isWorkMode;
        setIsWorkMode(nextModeIsWork);
        setSeconds(nextModeIsWork ? workMinutes * 60 : breakMinutes * 60);
        setIsActive(false);
        setDistractions(0);
    };

    const updateTimerSettings = (w, b) => {
        setWorkMinutes(w);
        setBreakMinutes(b);
        if (!isActive) {
            setSeconds(isWorkMode ? w * 60 : b * 60);
        }
        setIsSettingsOpen(false);
    };

    const handleSessionSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/study/session', {
                subject: 'Pomodoro Session', // Default or user-selected
                durationMinutes: workMinutes,
                focusScore,
                distractionsCount: distractions,
                sessionType: 'focus'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowRatingModal(false);
            resetTimer();
            if (onSessionComplete) onSessionComplete();
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progress = ((initialSeconds - seconds) / initialSeconds) * 100;

    return (
        <div className="bg-white dark:bg-darkCard rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col items-center relative overflow-hidden">
            {/* Settings Overlay */}
            {isSettingsOpen && (
                <div className="absolute inset-0 z-50 bg-white dark:bg-darkCard p-8 animate-in slide-in-from-top duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black uppercase tracking-tighter dark:text-white">Timer Settings</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <RotateCcw className="w-5 h-5 rotate-45" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Focus Duration (mins)</label>
                            <input
                                type="number"
                                value={workMinutes}
                                onChange={(e) => setWorkMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Break Duration (mins)</label>
                            <input
                                type="number"
                                value={breakMinutes}
                                onChange={(e) => setBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <button
                            onClick={() => updateTimerSettings(workMinutes, breakMinutes)}
                            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="w-full flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                    <button
                        onClick={() => !isActive && !isWorkMode && toggleMode()}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isWorkMode ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Book className="w-3 h-3 inline mr-1" /> Focus
                    </button>
                    <button
                        onClick={() => !isActive && isWorkMode && toggleMode()}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isWorkMode ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Coffee className="w-3 h-3 inline mr-1" /> Break
                    </button>
                </div>

                <button
                    onClick={() => !isActive && setIsSettingsOpen(true)}
                    className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-400 rounded-xl hover:text-primary-500 transition-colors"
                    title="Customize Durations"
                >
                    <RotateCcw className="w-4 h-4" /> {/* Using Rotate icon as a placeholder for gear if not available, but let's see lucide imports */}
                </button>
            </div>

            {/* Circular Timer Display */}
            <div className="relative w-64 h-64 mb-10 group">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-100 dark:text-gray-800"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={754}
                        strokeDashoffset={754 - (754 * progress) / 100}
                        className={`transition-all duration-1000 ${isWorkMode ? 'text-primary-500' : 'text-green-500'}`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-gray-900 dark:text-white font-mono tabular-nums leading-none">
                        {formatTime(seconds)}
                    </span>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
                        {isActive ? 'Keep Going' : 'Paused'}
                    </p>
                </div>
            </div>

            {/* Stats Bar */}
            {isWorkMode && (
                <div className="flex gap-8 mb-10">
                    <div className="text-center group">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-red-400 transition-colors">Distractions</p>
                        <div className="flex items-center justify-center gap-1">
                            <AlertTriangle className={`w-4 h-4 ${distractions > 0 ? 'text-red-400' : 'text-gray-300'}`} />
                            <span className="text-xl font-black dark:text-white">{distractions}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={resetTimer}
                    className="p-4 bg-gray-50 dark:bg-slate-800 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
                <button
                    onClick={toggleTimer}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition transform active:scale-95 ${isActive ? 'bg-gray-100 dark:bg-slate-800 text-gray-600' : 'bg-primary-600 text-white shadow-primary-500/40'}`}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <button
                    onClick={() => !isActive && setIsSettingsOpen(true)}
                    className="p-4 bg-gray-50 dark:bg-slate-800 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                    <Settings className="w-6 h-6" />
                </button>
            </div>

            {/* Session Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
                    <div className="bg-white dark:bg-darkCard rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Focus Complete!</h2>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">Rate your focus level to earn productivity points.</p>

                        <div className="flex justify-between items-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map(lvl => (
                                <button
                                    key={lvl}
                                    onClick={() => setFocusScore(lvl)}
                                    className={`w-12 h-12 rounded-2xl font-black transition-all ${focusScore === lvl ? 'bg-primary-600 text-white scale-110 shadow-lg shadow-primary-500/30' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-600'}`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSessionSave}
                            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 active:scale-[0.98]"
                        >
                            Save Session
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PomodoroTimer;
