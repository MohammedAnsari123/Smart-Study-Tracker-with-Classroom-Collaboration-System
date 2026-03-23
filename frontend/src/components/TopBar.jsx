import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon, Settings as SettingsIcon, BookOpen, LayoutDashboard, Users, ListTree, Sparkles, Brain, Menu, X, History } from 'lucide-react';
import NotificationBell from './NotificationBell';

const TopBar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-darkCard shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {user && (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="sm:hidden -ml-2 mr-2 p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        )}
                        <Link to={user ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center group">
                            <BookOpen className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />
                            <span className="ml-2 mt-1 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-green-400">
                                Smart Study
                            </span>
                        </Link>

                        {user && (
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 h-16 items-center">
                                <Link
                                    to="/dashboard"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${location.pathname === '/dashboard'
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Tracker
                                </Link>
                                <Link
                                    to="/classrooms"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${location.pathname === '/classrooms'
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Classrooms
                                </Link>
                                <Link
                                    to="/flashcards"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${location.pathname === '/flashcards'
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    <Brain className="w-4 h-4 mr-2" />
                                    Flashcards
                                </Link>
                                <Link
                                    to="/test-history"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${location.pathname === '/test-history'
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    <History className="w-4 h-4 mr-2" />
                                    Test History
                                </Link>

                                <Link
                                    to="/chatbot"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors ${location.pathname === '/chatbot'
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4 mr-2 text-primary-500" />
                                    AI Assistant
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                            {user?.fullName}
                        </span>
                        {user && <NotificationBell />}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <Link
                            to="/settings"
                            className="p-2 rounded-full text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        >
                            <SettingsIcon className="h-5 w-5" />
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:bg-gray-800 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {user && isMobileMenuOpen && (
                <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top duration-300">
                    <div className="px-4 py-4 space-y-2 bg-white dark:bg-darkCard">
                        {[
                            { to: '/dashboard', label: 'Tracker', icon: LayoutDashboard },
                            { to: '/classrooms', label: 'Classrooms', icon: Users },
                            { to: '/flashcards', label: 'Flashcards', icon: Brain },
                            { to: '/test-history', label: 'Tests', icon: History },
                            { to: '/chatbot', label: 'AI Assistant', icon: Sparkles, color: 'text-primary-500' }
                        ].map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all ${location.pathname === link.to
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800/50'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${link.color || ''}`} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default TopBar;
