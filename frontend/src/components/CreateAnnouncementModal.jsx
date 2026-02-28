import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const CreateAnnouncementModal = ({ isOpen, onClose, classId, onAnnouncementCreated }) => {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Announcement message is required.');
            return;
        }

        setLoading(true);
        setError('');

        const submitData = new FormData();
        submitData.append('message', message);
        if (file) {
            submitData.append('file', file);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/announcement/class/${classId}/create`, submitData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            onAnnouncementCreated(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white dark:bg-darkCard rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Post Announcement</h2>

                {error && <div className="mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message <span className="text-red-500">*</span></label>
                        <textarea
                            name="message"
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2 border"
                            placeholder="Share something with your class..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachment (Optional)</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                dark:file:bg-primary-900/30 dark:file:text-primary-400
                hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50"
                        />
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
                            disabled={loading}
                            className="px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAnnouncementModal;
