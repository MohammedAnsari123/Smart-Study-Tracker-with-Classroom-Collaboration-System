import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart2, Users, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-white dark:bg-darkBg overflow-hidden font-sans">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold mb-8 transition-transform hover:scale-105 cursor-pointer">
                            <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                            Modern Learning Management Redefined
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
                            Learn Smarter, <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-green-500">Collaborate Better.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                            The all-in-one platform for personal study tracking and virtual classroom collaboration. Track your progress, manage assignments, and boost productivity effortlessly.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center group">
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold text-lg transition-all border border-transparent">
                                Login to Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-[120px]"></div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-gray-50 dark:bg-darkCard/50 border-y border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Virtual Classrooms</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                Create or join interactive classrooms. Share materials, post announcements, and manage assignments in one place.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <BarChart2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Study Analytics</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                Log your study sessions and visualize your productivity. Deep insights into subject-wise performance and focus levels.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group">
                            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <ShieldCheck className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Secure & Cloud-Ready</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                All your study materials and assignments are securely stored on Cloudinary. Access your files anytime, anywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Footer */}
            <footer className="py-12 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center">
                            <BookOpen className="h-8 w-8 text-primary-600 mr-2" />
                            <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Smart Study Tracker</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            &copy; 2026 Smart Study Tracker System. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm font-bold text-gray-500 dark:text-gray-400">
                            <a href="#" className="hover:text-primary-600 transition">Terms</a>
                            <a href="#" className="hover:text-primary-600 transition">Privacy</a>
                            <a href="#" className="hover:text-primary-600 transition">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
