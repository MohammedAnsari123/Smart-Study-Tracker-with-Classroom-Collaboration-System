import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon, Settings as SettingsIcon, BookOpen, LayoutDashboard, Users, Sparkles, Brain, Menu, X, History } from 'lucide-react';
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

    const navLinks = [
        { to: '/dashboard', label: 'Tracker', icon: LayoutDashboard },
        { to: '/classrooms', label: 'Classrooms', icon: Users },
        { to: '/flashcards', label: 'Flashcards', icon: Brain },
        { to: '/study-materials', label: 'Library', icon: BookOpen },
        { to: '/test-history', label: 'Tests', icon: History },
        { to: '/chatbot', label: 'AI Assistant', icon: Sparkles, color: 'text-primary-500' }
    ];

    return (
        <nav className="bg-white dark:bg-darkCard shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Branding & Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        {user && (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Toggle Menu"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        )}
                        <Link to={user ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center group">
                            <BookOpen className="h-7 w-7 text-primary-500 group-hover:scale-110 transition-transform" />
                            <span className="ml-2 mt-0.5 text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                                Smart Study
                            </span>
                        </Link>
                    </div>

                    {/* Middle: Desktop Navigation */}
                    {user && (
                        <div className="hidden lg:flex flex-1 justify-center space-x-1 xl:space-x-3 h-16 items-center px-4 overflow-hidden">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.to;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        title={link.label}
                                        className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 flex-shrink-0 ${link.color || ''} ${isActive ? 'mr-2' : 'xl:mr-2'}`} />
                                        <span className={`${isActive ? 'block' : 'hidden xl:block'}`}>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                        {user && <NotificationBell />}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                        {user && (
                            <>
                                <Link
                                    to="/settings"
                                    className="hidden sm:flex p-2 rounded-xl text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <SettingsIcon className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:bg-slate-800/50 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                                <div className="hidden lg:block w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1"></div>
                                <span className="hidden lg:block text-[11px] font-black tracking-widest uppercase text-gray-500 dark:text-gray-400 ml-2">
                                    {user.fullName.split(' ')[0]}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {user && isMobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-darkCard absolute w-full shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-4 space-y-1.5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Mobile User Profile Section */}
                        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-2xl dark:bg-slate-800/50">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400 flex items-center justify-center font-black">
                                {user.fullName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{user.department}</p>
                            </div>
                            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="ml-auto p-2 bg-white dark:bg-slate-800 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shadow-sm">
                                <SettingsIcon className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Mobile Nav Links */}
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-2">Navigation</div>
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            let isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all ${isActive
                                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800/50'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl mr-3 ${isActive ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-gray-100 dark:bg-slate-800'} transition-colors`}>
                                        <Icon className={`w-4 h-4 ${link.color || ''}`} />
                                    </div>
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
