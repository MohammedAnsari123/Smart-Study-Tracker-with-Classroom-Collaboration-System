import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Download, FileCheck, AlertCircle, Eye } from 'lucide-react';
import PDFPreviewModal from './PDFPreviewModal';
import { getProxyURL } from '../utils/proxyHelper';

const SubmissionsModal = ({ isOpen, onClose, assignment, onGradeClick }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [previewFileData, setPreviewFileData] = useState(null); // { url, title }

    const fetchSubmissions = async () => {
        if (!assignment) return;
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            // Pass classId as query param for ownerMiddleware check
            const res = await axios.get(`http://localhost:5000/assignment/${assignment._id}/submissions?classId=${assignment.classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch submissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchSubmissions();
        }
    }, [isOpen, assignment]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-darkCard rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[85vh] overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-black mb-1 text-gray-900 dark:text-gray-100 tracking-tight">Assignment <span className="text-primary-600">Submissions</span></h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">{assignment?.title}</p>

                {error && (
                    <div className="mb-4 flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                        <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                        <div><span className="font-bold">Error:</span> {error}</div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                            <p className="text-gray-500 font-bold uppercase tracking-tighter text-xs">Loading submissions...</p>
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="bg-gray-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileCheck className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tighter text-sm">No submissions yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {submissions.map((sub) => (
                                <div key={sub._id} className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-primary-200 dark:hover:border-primary-900/50">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-1 flex-wrap gap-2">
                                            <p className="font-black text-gray-900 dark:text-gray-100 text-lg tracking-tight">{sub.userId?.fullName}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${sub.marks !== null ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {sub.marks !== null ? 'Graded' : 'Pending'}
                                            </span>
                                            {sub.submissionStatus === 'late' && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Late</span>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                                        {sub.comment && (
                                            <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 italic">
                                                "{sub.comment}"
                                            </div>
                                        )}
                                        {sub.marks !== null && (
                                            <div className="mt-2 flex items-center text-primary-600 dark:text-primary-400 font-black">
                                                <span className="text-sm uppercase tracking-tighter mr-2">Grade:</span>
                                                <span className="text-lg">{sub.marks} / {assignment.maxMarks}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                                        <a
                                            href={getProxyURL(sub.fileURL, true)}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 sm:flex-none flex items-center justify-center p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition shadow-sm"
                                            title="Download Submission"
                                        >
                                            <Download className="w-5 h-5" />
                                        </a>
                                        <button 
                                            onClick={() => setPreviewFileData({ url: sub.fileURL, title: `${sub.userId?.fullName}'s Submission` })}
                                            className="flex-1 sm:flex-none flex items-center justify-center p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-100 transition shadow-sm"
                                            title="Preview Submission"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onGradeClick(sub)}
                                            className="flex-[2] sm:flex-none inline-flex items-center justify-center px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-primary-500/20"
                                        >
                                            <FileCheck className="w-5 h-5 mr-2" />
                                            {sub.marks !== null ? 'Update Grade' : 'Assign Grade'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* PDF Preview Modal */}
            <PDFPreviewModal 
                isOpen={!!previewFileData}
                onClose={() => setPreviewFileData(null)}
                fileURL={previewFileData?.url}
                title={previewFileData?.title}
            />
        </div>
    );
};

export default SubmissionsModal;
