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
import { MessageSquare, FileText, Plus, Calendar, Paperclip, Download, Users, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

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

    const fetchClassroomData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [classRes, annRes, assignRes] = await Promise.all([
                axios.get(`http://localhost:5000/class/${id}`, { headers }),
                axios.get(`http://localhost:5000/announcement/class/${id}`, { headers }),
                axios.get(`http://localhost:5000/assignment/class/${id}`, { headers })
            ]);

            setClassroom(classRes.data);
            setAnnouncements(annRes.data);
            setAssignments(assignRes.data);
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
                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{classroom.className}</h1>
                            <p className="text-primary-100 text-lg font-medium">{classroom.subject} {classroom.section && `• ${classroom.section}`}</p>
                            {isOwner && (
                                <div className="mt-4 inline-block bg-primary-800/50 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-mono">
                                    Class Code: {classroom.classCode}
                                </div>
                            )}
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

                        {/* Owner Actions */}
                        {isOwner && (
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

                        {/* Announcements Feed */}
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
                                                    <div className="mt-4">
                                                        <a href={ann.attachmentURL} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                                            <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                                                            View Attachment
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Assignments List */}
                        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-primary-500" /> Classwork
                            </h2>

                            <div className="space-y-4">
                                {assignments.length === 0 ? (
                                    <div className="bg-white dark:bg-darkCard p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-gray-500 dark:text-gray-400">No assignments posted yet.</p>
                                    </div>
                                ) : (
                                    assignments.map((assignment) => (
                                        <div key={assignment._id} className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary-200 break-inside-avoid">
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
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{assignment.description}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                                    {assignment.pdfURL && (
                                                        <a
                                                            href={assignment.pdfURL}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                                        >
                                                            <Download className="w-4 h-4 mr-2" /> material.pdf
                                                        </a>
                                                    )}
                                                    {!isOwner && (
                                                        <button
                                                            onClick={() => setSubmitAssignmentData(assignment)}
                                                            className={`inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium transition border ${assignment.mySubmission
                                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-200'
                                                                : 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 border-transparent'
                                                                }`}
                                                        >
                                                            {assignment.mySubmission ? 'Resubmit Work' : 'Turn In Work'}
                                                        </button>
                                                    )}
                                                    {isOwner && (
                                                        <div className="flex flex-col gap-2">
                                                            <button
                                                                onClick={() => setViewSubmissionsData(assignment)}
                                                                className="inline-flex justify-center items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                                            >
                                                                <Users className="w-4 h-4 mr-2" />
                                                                Submissions
                                                            </button>
                                                            <div className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                                Teacher Control
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Student Specific: My Submission Status & Marks */}
                                            {!isOwner && assignment.mySubmission && (
                                                <div className="mt-6 p-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <div className="flex items-center">
                                                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Submission Status</span>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${assignment.mySubmission.marks !== null ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            }`}>
                                                            {assignment.mySubmission.marks !== null ? 'Graded' : 'Turned In'}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Submitted on {new Date(assignment.mySubmission.submittedAt).toLocaleDateString()}</p>
                                                            {assignment.mySubmission.marks !== null && (
                                                                <div className="mt-2 flex items-baseline">
                                                                    <span className="text-3xl font-black text-gray-900 dark:text-white mr-1">{assignment.mySubmission.marks}</span>
                                                                    <span className="text-sm font-bold text-gray-400">/ {assignment.maxMarks}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {assignment.mySubmission.feedback && (
                                                            <div className="flex-1 sm:max-w-xs bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Teacher's Feedback</p>
                                                                <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">"{assignment.mySubmission.feedback}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Classroom Analytics (Owner Only) */}
                {isOwner && assignments.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2 text-primary-500" /> Class Performance
                        </h2>
                        <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-64">
                            <ResponsiveContainer width="100%" height="100%">
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
                )}

            </div>
            {/* End of max-w-7xl div */}

            <CreateAssignmentModal
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

        </div>
    );
};

export default ClassroomView;
