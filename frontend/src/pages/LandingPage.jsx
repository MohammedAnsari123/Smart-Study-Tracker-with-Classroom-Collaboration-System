import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart2, Users, ArrowRight, Bot, Kanban, BrainCircuit, Library, Flame, Sparkles, Target, Activity } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg overflow-hidden font-sans selection:bg-primary-500/30">
            {/* Top Navigation */}
            <nav className="absolute top-0 w-full z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-darkBg/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Smart Study</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold mb-8 border border-primary-200 dark:border-primary-800/50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        <Sparkles className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                        The AI-Powered Academic Operating System
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Don't just track studying.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-500 to-green-500">Master your Curriculum.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                        Stop juggling fragmented apps. Combine a Pomodoro study tracker, an Assignment Kanban board, and a personalized AI mentor into one unified, intelligent platform.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in zoom-in-95 duration-1000 delay-300">
                        <Link to="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center group overflow-hidden relative">
                            <span className="relative z-10 flex items-center">
                                Start Learning Free
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                            </span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                        <Link to="/dashboard" className="px-8 py-4 bg-white dark:bg-darkCard hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold text-lg border-2 border-gray-200 dark:border-gray-800 transition-all flex items-center justify-center shadow-sm">
                            Go To Dashboard
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Background Ambient Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[120px]"></div>
                </div>
            </section>

            {/* Sub-Hero Analytics Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 z-20 relative">
                <div className="bg-white/80 dark:bg-darkCard/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
                    <div className="flex-1 flex flex-col items-center justify-center py-4 md:py-0">
                        <p className="text-4xl font-black text-gray-900 dark:text-white mb-1"><Target className="w-8 h-8 text-primary-500 inline mr-2 -mt-2" />5-Layer</p>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Syllabus Engine</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-4 md:py-0">
                        <p className="text-4xl font-black text-gray-900 dark:text-white mb-1"><Bot className="w-8 h-8 text-indigo-500 inline mr-2 -mt-2" />100%</p>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Context-Aware AI</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-4 md:py-0">
                        <p className="text-4xl font-black text-gray-900 dark:text-white mb-1"><Activity className="w-8 h-8 text-green-500 inline mr-2 -mt-2" />Real-time</p>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Analytics Tracking</p>
                    </div>
                </div>
            </div>

            {/* Massive Feature Bento Grid */}
            <section className="py-24 bg-white dark:bg-[#0A0A0A] border-y border-gray-100 dark:border-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Everything you need to succeed.</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">We've engineered the ultimate toolstack by combining performance analytics with cutting-edge Language Models.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Big Feature 1: AI Chat */}
                        <div className="lg:col-span-2 bg-gray-50 dark:bg-darkCard rounded-3xl p-8 md:p-10 border border-gray-200 dark:border-gray-800 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="relative z-10 max-w-md">
                                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <BrainCircuit className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Personal AI Mentor</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                                    Chat with an AI that actively monitors your past test scores and study habits. Generate strict, non-hallucinating exams or upload PDFs to converse directly with your textbooks.
                                </p>
                            </div>
                            {/* Decorative Graphic */}
                            <div className="absolute right-0 bottom-0 opacity-10 dark:opacity-5 translate-x-1/4 translate-y-1/4 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                                <Bot className="w-96 h-96 text-indigo-500" />
                            </div>
                        </div>

                        {/* Feature 2: Kanban */}
                        <div className="bg-gray-50 dark:bg-darkCard rounded-3xl p-8 md:p-10 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 group">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform">
                                <Kanban className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Academic Kanban</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Ditch the messy planners. Use professional Drag-and-Drop boards to manage classroom assignments from 'Backlog' to 'Done'.
                            </p>
                        </div>

                        {/* Feature 3: Heatmaps */}
                        <div className="bg-gray-50 dark:bg-darkCard rounded-3xl p-8 md:p-10 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 group">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform">
                                <Flame className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Consistency Tracking</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Build unbreakable study streaks. Our GitHub-style heatmaps visually plot your daily focus hours and productivity scores.
                            </p>
                        </div>

                        {/* Feature 4: Library */}
                        <div className="lg:col-span-2 bg-gray-50 dark:bg-darkCard rounded-3xl p-8 md:p-10 border border-gray-200 dark:border-gray-800 overflow-hidden relative group hover:shadow-2xl transition-all duration-500">
                            <div className="relative z-10 max-w-lg">
                                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Library className="w-7 h-7 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Department Smart-Library</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                    Never search for notes again. The system automatically filters institutional materials uploaded by Teachers exclusively to your matching Department and Semester.
                                </p>
                            </div>
                            {/* Decorative Graphic */}
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 dark:opacity-10 pointer-events-none group-hover:-translate-x-4 transition-transform duration-700 hidden md:block">
                                <BookOpen className="w-48 h-48 text-green-500" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">Ready to upgrade your workflow?</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Join the ultimate academic operating system today and take control of your curriculum.</p>
                    <Link to="/register" className="inline-flex px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl shadow-gray-900/20 dark:shadow-white/10 items-center">
                        Create Your Free Account
                        <ArrowRight className="ml-3 w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Clean Footer */}
            <footer className="py-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-darkBg text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">
                    &copy; 2026 Smart Study Tracker Ecosystem. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
