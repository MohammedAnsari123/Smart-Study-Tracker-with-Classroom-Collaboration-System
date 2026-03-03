import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import { User, Shield, Palette, Sparkles, Mail, UserCircle, ChevronRight, Activity } from 'lucide-react';

const Settings = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);

    const sections = [
        {
            title: "Account Information",
            icon: <User className="w-5 h-5 text-blue-500" />,
            items: [
                { label: "Full Name", value: user?.fullName, sub: "Your display name" },
                { label: "Email Address", value: user?.email, sub: "Used for login and notifications" },
                { label: "Member Status", value: user?.role === 'admin' ? 'Teacher / Admin' : 'Student', sub: "Your account privileges" }
            ]
        },
        {
            title: "AI & Learning",
            icon: <Sparkles className="w-5 h-5 text-purple-500" />,
            items: [
                { label: "AI Weakness Detection", value: "Active", sub: "Personalized subject analysis" },
                { label: "Smart Study Assistant", value: "Online", sub: "DeepSeek-powered tutoring" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <TopBar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Settings
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage your account preferences and study experience.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-darkCard p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                            <UserCircle className="w-32 h-32 text-primary-500" />
                        </div>

                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-green-400 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/20">
                            {user?.fullName?.charAt(0)}
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                                {user?.fullName}
                            </h2>
                            <p className="text-primary-600 dark:text-primary-400 font-bold text-sm uppercase tracking-widest mt-1">
                                {user?.role === 'admin' ? 'Educator Account' : 'Learner Account'}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                <Mail className="w-4 h-4" /> {user?.email}
                            </div>
                        </div>
                    </div>

                    {/* Setting Sections */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white dark:bg-darkCard rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-slate-800/30">
                                {section.icon}
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">{section.title}</h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-800 px-8">
                                {section.items.map((item, i) => (
                                    <div key={i} className="py-6 flex justify-between items-center group cursor-default">
                                        <div>
                                            <p className="text-gray-900 dark:text-white font-bold">{item.label}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                                {item.value || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Appearance Section */}
                    <div className="bg-white dark:bg-darkCard rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-slate-800/30">
                            <Palette className="w-5 h-5 text-pink-500" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Appearance</h3>
                        </div>
                        <div className="px-8 py-8 flex items-center justify-between">
                            <div>
                                <p className="text-gray-900 dark:text-white font-bold">Dark Mode</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Adjust the application theme for better focus.</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex items-center h-8 rounded-full w-14 transition-all focus:outline-none ring-offset-2 ring-primary-500 focus:ring-2 ${theme === 'dark' ? 'bg-primary-600 shadow-lg shadow-primary-500/30' : 'bg-gray-200'}`}
                            >
                                <div className="sr-only">Toggle theme</div>
                                <span
                                    className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform shadow-md ${theme === 'dark' ? 'translate-x-[1.75rem]' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
