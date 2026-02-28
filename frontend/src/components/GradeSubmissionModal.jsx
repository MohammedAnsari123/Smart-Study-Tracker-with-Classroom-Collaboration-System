import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Trophy, MessageSquare, AlertCircle } from 'lucide-react';

const GradeSubmissionModal = ({ isOpen, onClose, submission, assignment, onGradeSuccess }) => {
    const [marks, setMarks] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Update local state when submission changes
    useEffect(() => {
        if (submission) {
            setMarks(submission.marks !== null && submission.marks !== undefined ? submission.marks : '');
            setFeedback(submission.feedback || '');
        }
    }, [submission]);

    if (!isOpen || !submission) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (marks === '') {
            setError('Please enter a grade.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            // Pass classId in query for owner check in backend
            const res = await axios.post(`http://localhost:5000/assignment/submission/${submission._id}/grade?classId=${assignment.classId}`, {
                marks: Number(marks),
                feedback
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onGradeSuccess(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to grade submission');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 px-4 backdrop-blur-md">
            <div className="bg-white dark:bg-darkCard rounded-3xl shadow-2xl w-full max-w-md p-8 relative border border-gray-100 dark:border-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-black mb-1 text-gray-900 dark:text-gray-100 tracking-tight">Assign <span className="text-primary-600">Grade</span></h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">{submission.userId?.fullName}</p>

                {error && (
                    <div className="mb-6 flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-2xl bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                        <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                        <div>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                            <Trophy className="w-3 h-3 mr-2 text-yellow-500" /> Marks (out of {assignment?.maxMarks})
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                max={assignment?.maxMarks}
                                min="0"
                                required
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                className="block w-full rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-2xl font-black px-6 py-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                placeholder="0"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                / {assignment?.maxMarks}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                            <MessageSquare className="w-3 h-3 mr-2 text-primary-500" /> Feedback
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="4"
                            className="block w-full rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium px-6 py-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none"
                            placeholder="Add constructive feedback..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4 space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-4 bg-primary-600 text-white rounded-2xl font-black text-lg hover:bg-primary-700 shadow-xl shadow-primary-500/20 disabled:opacity-50 transition transform hover:-translate-y-1 active:translate-y-0"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                    Saving...
                                </div>
                            ) : 'Submit Grade'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GradeSubmissionModal;
