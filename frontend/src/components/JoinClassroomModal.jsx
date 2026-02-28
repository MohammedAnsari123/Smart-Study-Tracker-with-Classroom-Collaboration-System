import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const JoinClassroomModal = ({ isOpen, onClose, onClassJoined }) => {
    const [classCode, setClassCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!classCode.trim()) {
            setError('Class code is required');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/class/join', { classCode }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Assuming the backend returns the membership and possibly the populated class or we just refresh
            onClassJoined();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join classroom. Check code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white dark:bg-darkCard rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Join Class</h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Ask your teacher for the class code, then enter it here.
                </p>

                {error && <div className="mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class Code</label>
                        <input
                            type="text"
                            required
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            placeholder="e.g. A1B2C3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white sm:text-lg uppercase tracking-widest px-4 py-3 border font-mono text-center"
                        />
                    </div>
                    <div className="flex justify-end pt-2 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !classCode}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            {loading ? 'Joining...' : 'Join'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinClassroomModal;
