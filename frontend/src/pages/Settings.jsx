import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import axios from 'axios';
import { User, Palette, Sparkles, Mail, UserCircle, GraduationCap, Building2, Save, CheckCircle, Loader2 } from 'lucide-react';

const Settings = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, login } = useContext(AuthContext);

    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState(user?.department || '');
    const [selectedSem, setSelectedSem] = useState(user?.semester || '');
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/departments');
                setDepartments(res.data);
            } catch (err) {
                console.error('Failed to load departments');
            }
        };
        fetchDepartments();
    }, []);

    // Update semesters when department changes or departments load
    useEffect(() => {
        if (selectedDept && departments.length > 0) {
            const dept = departments.find(d => d.name === selectedDept);
            setAvailableSemesters(dept?.semesters || []);
        }
    }, [selectedDept, departments]);

    const handleSaveCurriculum = async () => {
        if (!selectedDept || !selectedSem) return;
        setSaving(true);
        try {
            const res = await axios.patch('http://localhost:5000/auth/profile', {
                department: selectedDept,
                semester: Number(selectedSem)
            }, { headers: { Authorization: `Bearer ${token}` } });

            // Update local user context
            const updatedUser = { ...user, department: res.data.department, semester: res.data.semester };
            login(updatedUser, token);

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert('Failed to update curriculum');
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = selectedDept !== user?.department || Number(selectedSem) !== user?.semester;

    const sections = [
        {
            title: "Account Information",
            icon: <User className="w-5 h-5 text-blue-500" />,
            items: [
                { label: "Full Name", value: user?.fullName, sub: "Your display name" },
                { label: "Email Address", value: user?.email, sub: "Used for login and notifications" },
                { label: "Member Status", value: 'Student', sub: "Your account privileges" }
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
                                Learner Account
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user?.email}</span>
                                {user?.department && (
                                    <span className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-lg text-xs font-bold">
                                        <Building2 className="w-3 h-3" /> {user?.department} • Sem {user?.semester}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Curriculum Settings - NEW */}
                    <div className="bg-white dark:bg-darkCard rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-slate-800/30">
                            <GraduationCap className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Curriculum</h3>
                        </div>
                        <div className="px-8 py-8 space-y-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Choose your department and semester to see relevant subjects in your study tracker, flashcards, and AI tests.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center">
                                        <Building2 className="w-3 h-3 mr-1" /> Department
                                    </label>
                                    <select
                                        value={selectedDept}
                                        onChange={(e) => { setSelectedDept(e.target.value); setSelectedSem(''); }}
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 h-12 px-4 font-bold"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(d => (
                                            <option key={d._id} value={d.name}>{d.fullName} ({d.name})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center">
                                        <GraduationCap className="w-3 h-3 mr-1" /> Semester
                                    </label>
                                    <select
                                        value={selectedSem}
                                        onChange={(e) => setSelectedSem(e.target.value)}
                                        disabled={!selectedDept}
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 h-12 px-4 font-bold disabled:opacity-50"
                                    >
                                        <option value="">{selectedDept ? 'Select Semester' : 'Select department first'}</option>
                                        {availableSemesters.map(s => (
                                            <option key={s} value={s}>Semester {s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {hasChanges && (
                                <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl p-4">
                                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                                        You have unsaved changes. Your subjects will update to match the new selection.
                                    </p>
                                    <button
                                        onClick={handleSaveCurriculum}
                                        disabled={saving || !selectedDept || !selectedSem}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition disabled:opacity-50 shadow-lg shadow-primary-500/20"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            )}

                            {saved && (
                                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl p-4 text-green-700 dark:text-green-300 text-sm font-bold animate-in fade-in">
                                    <CheckCircle className="w-5 h-5" />
                                    Curriculum updated successfully! Your subjects have been refreshed.
                                </div>
                            )}
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
