import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload } from 'lucide-react';

const SubmitAssignmentModal = ({ isOpen, onClose, assignment, onSubmissionSuccess }) => {
    const [comment, setComment] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !assignment) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('A PDF file is required for submission.');
            return;
        }

        setLoading(true);
        setError('');

        const submitData = new FormData();
        submitData.append('comment', comment);
        submitData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/assignment/${assignment._id}/submit`, submitData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            onSubmissionSuccess(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white dark:bg-darkCard rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Submit Assignment</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{assignment.title}</p>

                {error && <div className="mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Work (PDF) <span className="text-red-500">*</span></label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary-500" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                    <label className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input type="file" required accept=".pdf" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
                                {file && <p className="text-sm font-medium text-primary-600 mt-2 truncate max-w-xs mx-auto">{file.name}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Private Comment (Optional)</label>
                        <textarea
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2 border"
                            placeholder="Add a comment to your teacher..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            {loading ? 'Turning in...' : 'Turn In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitAssignmentModal;
