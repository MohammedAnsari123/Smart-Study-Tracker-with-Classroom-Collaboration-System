import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import CreateAssignmentModal from '../components/CreateAssignmentModal';
import CreateAnnouncementModal from '../components/CreateAnnouncementModal';
import SubmitAssignmentModal from '../components/SubmitAssignmentModal';
import SubmissionsModal from '../components/SubmissionsModal';
import GradeSubmissionModal from '../components/GradeSubmissionModal';
import KanbanBoard from '../components/KanbanBoard';
import { MessageSquare, FileText, Plus, Calendar, Paperclip, Download, Users, BarChart3, Layout, List, Award, Eye } from 'lucide-react';
import PDFPreviewModal from '../components/PDFPreviewModal';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { getProxyURL } from '../utils/proxyHelper';

const ClassroomView = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [classroom, setClassroom] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [isAnnounceModalOpen, setAnnounceModalOpen] = useState(false);
    const [submitAssignmentData, setSubmitAssignmentData] = useState(null); // holds assignment obj when opening modal
    const [viewSubmissionsData, setViewSubmissionsData] = useState(null);
    const [gradeSubmissionData, setGradeSubmissionData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null); // { user, progress }
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
    const [previewFileData, setPreviewFileData] = useState(null); // { url, title }
    const [progress, setProgress] = useState([]);
    const [allStudentsProgress, setAllStudentsProgress] = useState([]);
    const [classMembers, setClassMembers] = useState([]);
    const [activeSection, setActiveSection] = useState('stream'); // 'stream', 'classwork', 'people'


    const fetchClassroomData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [classRes, annRes, assignRes, progressRes] = await Promise.all([
                axios.get(`http://localhost:5000/class/${id}`, { headers }),
                axios.get(`http://localhost:5000/announcement/class/${id}`, { headers }),
                axios.get(`http://localhost:5000/assignment/class/${id}`, { headers }),
                axios.get(`http://localhost:5000/progress/my/${id}`, { headers })
            ]);

            setClassroom(classRes.data);
            setAnnouncements(annRes.data);
            setAssignments(assignRes.data);
            setProgress(progressRes.data);

            // If owner, fetch all students' progress and member list
            if (user && classRes.data.ownerId._id === user._id) {
                const [allProgressRes, membersRes] = await Promise.all([
                    axios.get(`http://localhost:5000/progress/class/${id}`, { headers }),
                    axios.get(`http://localhost:5000/class/${id}/members`, { headers })
                ]);
                setAllStudentsProgress(allProgressRes.data);
                setClassMembers(membersRes.data);
            }
        } catch (error) {
            console.error('Error fetching classroom details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassroomData();
    }, [id]);

    const handleAssignmentCreated = (newAssign) => {
        setAssignments([newAssign, ...assignments]);
    };

    const handleAnnouncementCreated = (newAnnounce) => {
        // we might need to populate the user info locally or just refetch
        fetchClassroomData();
    };

    const handleSubmissionSuccess = () => {
        // In a real app we'd update the UI to show "Submitted".
        // For now we just close the modal and maybe refetch to see updated status.
        alert("Assignment Submitted successfully!");
        setSubmitAssignmentData(null);
        fetchClassroomData();
    };

    const handleGradeSuccess = () => {
        alert("Grade submitted successfully!");
        setGradeSubmissionData(null);
        // Modal will refresh submissions list if it's open, but we refetch main data too
        fetchClassroomData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-darkBg">
                <TopBar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </div>
        );
    }

    if (!classroom) return <div className="p-8 text-center text-red-500">Classroom not found.</div>;

    const isOwner = user && classroom.ownerId?._id === user._id;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg pb-12">
            <TopBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Banner */}
                <div className="bg-primary-600 rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{classroom.className}</h1>
                            <p className="text-primary-100 text-lg font-medium">{classroom.subject} {classroom.section && `• ${classroom.section}`}</p>
                            {isOwner && (
                                <div className="mt-4 inline-block bg-primary-800/50 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-mono">
                                    Class Code: {classroom.classCode}
                                </div>
                            )}
                        </div>
                        {/* Tab Navigation */}
                        <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20">
                            {[
                                { id: 'stream', label: 'Stream', icon: MessageSquare },
                                { id: 'classwork', label: 'Classwork', icon: FileText },
                                { id: 'people', label: isOwner ? 'Students' : 'Members', icon: Users }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveSection(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSection === tab.id
                                        ? 'bg-white text-primary-600 shadow-md'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-500 opacity-50 blur-3xl"></div>
                    <div className="absolute right-20 -bottom-20 w-64 h-64 rounded-full bg-primary-400 opacity-30 blur-2xl"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 border-r border-transparent lg:border-gray-200 dark:lg:border-gray-800 lg:pr-6 space-y-6">
                        <div className="bg-white dark:bg-darkCard p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-3 mb-4 dark:border-gray-700">Upcoming Info</h3>
                            {assignments.length > 0 ? (
                                <div className="space-y-3">
                                    {assignments.slice(0, 3).map((a) => (
                                        <div key={a._id} className="text-sm">
                                            <Link to="#" className="text-primary-600 hover:text-primary-700 font-medium truncate block">{a.title}</Link>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Due: {new Date(a.deadline).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming assignments!</p>
                            )}
                        </div>

                        <div className="bg-white dark:bg-darkCard p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-3 mb-4 dark:border-gray-700">Teacher</h3>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold mr-3">
                                    {classroom.ownerId?.fullName ? classroom.ownerId.fullName[0].toUpperCase() : 'T'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{classroom.ownerId?.fullName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Owner</p>
                                </div>
                            </div>
                        </div>

                        {!isOwner && assignments.length > 0 && (
                            <div className="bg-white dark:bg-darkCard p-5 rounded-xl shadow-sm border border-primary-100 dark:border-primary-900/30">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-3 mb-4 dark:border-gray-700 flex items-center">
                                    <Award className="w-4 h-4 mr-2 text-primary-500" /> Grade Summary
                                </h3>
                                {(() => {
                                    let totalObtained = 0;
                                    let totalPossible = 0;
                                    assignments.forEach(a => {
                                        if (a.mySubmission && a.mySubmission.marks !== null) {
                                            totalObtained += a.mySubmission.marks;
                                            totalPossible += a.maxMarks;
                                        }
                                    });
                                    const percentage = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;

                                    if (totalPossible === 0) return <p className="text-xs text-gray-500 italic text-center">No assignments graded yet.</p>;

                                    return (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className={`text-2xl font-black ${percentage < 40 ? 'text-red-600 dark:text-red-400' : percentage < 75 ? 'text-amber-500 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                                        {totalObtained}<span className="text-sm opacity-50 font-medium ml-1">/ {totalPossible}</span>
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Total Marks</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-xl font-black ${percentage < 40 ? 'text-red-600' : percentage < 75 ? 'text-amber-500' : 'text-green-600'}`}>{percentage}%</p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${percentage < 40 ? 'bg-red-500' : percentage < 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {isOwner && (
                            <div className="bg-white dark:bg-darkCard p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b pb-3 mb-4 dark:border-gray-700 flex items-center">
                                    <BarChart3 className="w-4 h-4 mr-2 text-primary-500" /> Stats
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Announcements</span>
                                        <span className="font-bold text-gray-900 dark:text-gray-100">{announcements.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Assignments</span>
                                        <span className="font-bold text-gray-900 dark:text-gray-100">{assignments.length}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Owner Actions (Show in different places depending on section) */}
                        {isOwner && activeSection !== 'people' && (
                            <div className="bg-white dark:bg-darkCard p-5 rounded-xl shadow-sm border border-primary-100 dark:border-primary-900/30 flex flex-wrap gap-4 items-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Admin Tools:</span>
                                <button
                                    onClick={() => setAnnounceModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Post Announcement
                                </button>
                                <button
                                    onClick={() => setAssignModalOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Assignment
                                </button>
                            </div>
                        )}

                        {activeSection === 'stream' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2 text-primary-500" /> Announcements
                                </h2>
                                {announcements.length === 0 ? (
                                    <div className="bg-white dark:bg-darkCard p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-gray-500 dark:text-gray-400">No announcements yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {announcements.map((ann) => (
                                            <div key={ann._id} className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                        {ann.userId?.fullName ? ann.userId.fullName[0].toUpperCase() : 'U'}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{ann.userId?.fullName || 'Teacher'}</h4>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mt-2">{ann.message}</p>

                                                    {ann.attachmentURL && (
                                                        <div className="mt-4 flex gap-2">
                                                            <a href={getProxyURL(ann.attachmentURL, true)} download target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                                                <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                                                                Download
                                                            </a>
                                                            <button 
                                                                onClick={() => setPreviewFileData({ url: ann.attachmentURL, title: 'Announcement Attachment' })}
                                                                className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 transition"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Preview
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeSection === 'classwork' && (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-primary-500" /> Classwork
                                    </h2>

                                    <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                        >
                                            <List className="w-3 h-3" /> List
                                        </button>
                                        <button
                                            onClick={() => setViewMode('kanban')}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                        >
                                            <Layout className="w-3 h-3" /> Kanban
                                        </button>
                                    </div>
                                </div>
                                {/* Assignments UI here */}
                                {viewMode === 'kanban' ? (
                                    <KanbanBoard
                                        classId={id}
                                        assignments={assignments.map(a => {
                                            const p = progress.find(pr => pr.assignmentId === a._id);
                                            return { ...a, status: p ? p.status : 'todo' };
                                        })}
                                        onStatusChange={fetchClassroomData}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {assignments.length === 0 ? (
                                            <div className="bg-white dark:bg-darkCard p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                                <p className="text-gray-500 dark:text-gray-400">No assignments posted yet.</p>
                                            </div>
                                        ) : (
                                            assignments.map((assignment) => (
                                                <div key={assignment._id} className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary-200">
                                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div className="mt-1 p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg shrink-0">
                                                                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{assignment.title}</h3>
                                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium space-x-4">
                                                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> Due: {new Date(assignment.deadline).toLocaleString()}</span>
                                                                    <span>{assignment.maxMarks} Points</span>
                                                                    {(() => {
                                                                        if (!isOwner && assignment.mySubmission && assignment.mySubmission.marks !== null) {
                                                                            const perc = (assignment.mySubmission.marks / assignment.maxMarks) * 100;
                                                                            const colorClass = perc < 40 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : perc < 75 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
                                                                            return (
                                                                                <span className={`flex items-center px-2 py-0.5 rounded-md font-black ${colorClass}`}>
                                                                                    <Award className="w-3 h-3 mr-1" /> Marks: {assignment.mySubmission.marks} / {assignment.maxMarks}
                                                                                </span>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })()}
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{assignment.description}</p>
                                                                {assignment.mySubmission?.feedback && (
                                                                    <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">Feedback</p>
                                                                        <p className="text-xs text-amber-800 dark:text-amber-200 italic">"{assignment.mySubmission.feedback}"</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                                            {assignment.pdfURL && (
                                                                <div className="flex gap-2">
                                                                    <a href={getProxyURL(assignment.pdfURL, true)} download target="_blank" rel="noreferrer" className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition" title="Download Material">
                                                                        <Download className="w-4 h-4" /> 
                                                                    </a>
                                                                    <button 
                                                                        onClick={() => setPreviewFileData({ url: assignment.pdfURL, title: assignment.title })}
                                                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-md text-sm font-medium hover:bg-primary-100 transition"
                                                                        title="Preview Material"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {!isOwner && (
                                                                <button
                                                                    onClick={() => setSubmitAssignmentData(assignment)}
                                                                    className={`inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium transition border ${assignment.mySubmission ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-200' : 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 border-transparent'}`}
                                                                >
                                                                    {assignment.mySubmission ? 'Resubmit Work' : 'Turn In Work'}
                                                                </button>
                                                            )}
                                                            {isOwner && (
                                                                <button onClick={() => setViewSubmissionsData(assignment)} className="inline-flex justify-center items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                                                    <Users className="w-4 h-4 mr-2" /> Submissions
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeSection === 'people' && (
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-800 pb-2">Teachers</h3>
                                    <div className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                                            {classroom.ownerId?.fullName ? classroom.ownerId.fullName[0].toUpperCase() : 'T'}
                                        </div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200">{classroom.ownerId?.fullName}</span>
                                        <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-primary-500">Class Owner</span>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-800 pb-2 flex justify-between items-center">
                                        Students
                                        {isOwner && <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">{classMembers.length} Enrolled</span>}
                                    </h3>

                                    {isOwner ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Logic to aggregate student progress for owner */}
                                            {(() => {
                                                const students = classMembers.map(member => {
                                                    const studentProgress = allStudentsProgress.filter(p => p.userId._id === member._id);
                                                    const kanban = { todo: 0, doing: 0, done: 0 };
                                                    studentProgress.forEach(p => {
                                                        if (kanban[p.status] !== undefined) {
                                                            kanban[p.status]++;
                                                        }
                                                    });
                                                    return {
                                                        user: member,
                                                        kanban
                                                    };
                                                });

                                                return students.length > 0 ? students.map(s => (
                                                    <div key={s.user._id} className="bg-white dark:bg-darkCard p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:border-primary-200">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 font-black text-xl">
                                                                {s.user.fullName[0]}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-gray-900 dark:text-white">{s.user.fullName}</h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.user.email}</p>
                                                            </div>
                                                        </div>

                                                        {/* Visual Progress Hub */}
                                                        <div className="flex gap-2">
                                                            <div className="flex flex-col items-center px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Todo</span>
                                                                <span className="text-lg font-black text-slate-600 dark:text-slate-200">{s.kanban.todo}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                                                                <span className="text-xs font-black text-blue-400 uppercase tracking-tighter">Doing</span>
                                                                <span className="text-lg font-black text-blue-600 dark:text-blue-300">{s.kanban.doing}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center px-4 py-2 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20">
                                                                <span className="text-xs font-black text-green-400 uppercase tracking-tighter">Done</span>
                                                                <span className="text-lg font-black text-green-600 dark:text-green-300">{s.kanban.done}</span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => setSelectedStudent(s)}
                                                            className="px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                )) : (
                                                    <div className="py-12 text-center bg-white dark:bg-darkCard rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                        <p className="text-gray-500 font-medium italic">No students joined yet.</p>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-gray-800 italic">
                                            Student list and progress data is restricted to classroom owners.
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                    </div>
                </div>

                {/* Classroom Analytics (Owner Only) */}
                {
                    isOwner && assignments.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2 text-primary-500" /> Class Performance
                            </h2>
                            <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-64 overflow-hidden">
                                <ResponsiveContainer width="99%" height={200}>
                                    <BarChart data={assignments.map(a => ({ name: a.title, marks: a.maxMarks }))}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                        <XAxis dataKey="name" hide />
                                        <YAxis />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Bar dataKey="marks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <p className="text-center text-xs text-gray-500 mt-2">Max Marks across Assignments</p>
                            </div>
                        </div>
                    )
                }

            </div >
            {/* End of max-w-7xl div */}

            < CreateAssignmentModal
                isOpen={isAssignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                classId={id}
                onAssignmentCreated={handleAssignmentCreated}
            />

            <CreateAnnouncementModal
                isOpen={isAnnounceModalOpen}
                onClose={() => setAnnounceModalOpen(false)}
                classId={id}
                onAnnouncementCreated={handleAnnouncementCreated}
            />

            <SubmitAssignmentModal
                isOpen={!!submitAssignmentData}
                onClose={() => setSubmitAssignmentData(null)}
                assignment={submitAssignmentData}
                onSubmissionSuccess={handleSubmissionSuccess}
            />

            <SubmissionsModal
                isOpen={!!viewSubmissionsData}
                onClose={() => setViewSubmissionsData(null)}
                assignment={viewSubmissionsData}
                onGradeClick={(sub) => setGradeSubmissionData({ sub, assign: viewSubmissionsData })}
            />

            <GradeSubmissionModal
                isOpen={!!gradeSubmissionData}
                onClose={() => setGradeSubmissionData(null)}
                submission={gradeSubmissionData?.sub}
                assignment={gradeSubmissionData?.assign}
                onGradeSuccess={handleGradeSuccess}
            />

            {/* Student Kanban Progress Modal (Owner only) */}
            {
                selectedStudent && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-darkCard rounded-3xl w-full max-w-5xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-black text-xl">
                                        {selectedStudent.user.fullName[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{selectedStudent.user.fullName}</h3>
                                        <p className="text-sm font-medium text-gray-500">{selectedStudent.user.email} • Kanban Status</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                                >
                                    <Plus className="w-6 h-6 rotate-45 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-8">
                                <KanbanBoard
                                    isReadOnly={true}
                                    classId={id}
                                    assignments={assignments.map(a => {
                                        const p = allStudentsProgress.find(pr => pr.assignmentId?._id === a._id && pr.userId?._id === selectedStudent.user._id);
                                        return { ...a, status: p ? p.status : 'todo' };
                                    })}
                                />
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/30 border-t dark:border-gray-800 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Monitoring Mode • Read Only</p>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* PDF Preview Modal */}
            <PDFPreviewModal
                isOpen={!!previewFileData}
                onClose={() => setPreviewFileData(null)}
                fileURL={previewFileData?.url}
                title={previewFileData?.title}
            />
        </div >
    );
};

export default ClassroomView;
