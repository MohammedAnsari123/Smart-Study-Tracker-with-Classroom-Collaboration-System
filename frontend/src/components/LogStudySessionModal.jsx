import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, BookOpen, Layout, ListTree } from 'lucide-react';

const LogStudySessionModal = ({ isOpen, onClose, onSessionLogged }) => {
    const [formData, setFormData] = useState({
        subject: '',
        topic: '',
        subtopic: '',
        durationMinutes: 30,
        notes: '',
    });
    const [subjects, setSubjects] = useState([]);
    const [availableTopics, setAvailableTopics] = useState([]);
    const [availableSubtopics, setAvailableSubtopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchSubjects();
        }
    }, [isOpen]);

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/subject', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(res.data);
        } catch (err) {
            console.error('Failed to fetch subjects');
        }
    };

    const handleSubjectChange = (e) => {
        const selectedSubjectName = e.target.value;
        const subjectObj = subjects.find(s => s.subjectName === selectedSubjectName);
        setFormData({
            ...formData,
            subject: selectedSubjectName,
            topic: '',
            subtopic: ''
        });
        
        let allTopics = [];
        if (subjectObj && subjectObj.chapters) {
            allTopics = subjectObj.chapters.reduce((acc, chap) => acc.concat(chap.topics || []), []);
        } else if (subjectObj && subjectObj.topics) {
            // Fallback for any legacy data
            allTopics = subjectObj.topics;
        }
        
        setAvailableTopics(allTopics);
        setAvailableSubtopics([]);
    };

    const handleTopicChange = (e) => {
        const selectedTopicName = e.target.value;
        const topicObj = availableTopics.find(t => t.topicName === selectedTopicName);
        setFormData({
            ...formData,
            topic: selectedTopicName,
            subtopic: ''
        });
        setAvailableSubtopics(topicObj ? topicObj.subtopics : []);
    };

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/study', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSessionLogged(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log study session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-darkCard rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-100 dark:border-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-black mb-6 text-gray-900 dark:text-gray-100 tracking-tight">Log <span className="text-primary-600">Session</span></h2>

                {error && <div className="mb-6 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-xl font-bold">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Subject Selection */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center">
                                <BookOpen className="w-3 h-3 mr-1" /> Subject
                            </label>
                            <select
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleSubjectChange}
                                className="mt-1 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 h-12 px-4 font-bold"
                            >
                                <option value="">Select a Subject</option>
                                {subjects.map(s => <option key={s._id} value={s.subjectName}>{s.subjectName}</option>)}
                            </select>
                        </div>

                        {/* Topic Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center">
                                <Layout className="w-3 h-3 mr-1" /> Topic
                            </label>
                            <select
                                name="topic"
                                value={formData.topic}
                                onChange={handleTopicChange}
                                disabled={!formData.subject}
                                className="mt-1 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 h-12 px-4 disabled:opacity-50 font-bold"
                            >
                                <option value="">None</option>
                                {availableTopics.map(t => <option key={t._id} value={t.topicName}>{t.topicName}</option>)}
                            </select>
                        </div>

                        {/* Subtopic Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center">
                                <ListTree className="w-3 h-3 mr-1" /> Subtopic
                            </label>
                            <select
                                name="subtopic"
                                value={formData.subtopic}
                                onChange={handleChange}
                                disabled={!formData.topic}
                                className="mt-1 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 h-12 px-4 disabled:opacity-50 font-bold"
                            >
                                <option value="">None</option>
                                {availableSubtopics.map((s, idx) => (
                                    <option key={idx} value={s.name || s}>{s.name || s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Duration (mins)</label>
                            <input
                                type="number"
                                name="durationMinutes"
                                min="1"
                                required
                                value={formData.durationMinutes}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 h-12 px-4 font-bold"
                            />
                        </div>


                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Session Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="2"
                            placeholder="What did you work on today?"
                            className="mt-1 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 p-4 font-medium"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4 space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.subject}
                            className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 disabled:opacity-50 transition transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {loading ? 'Logging...' : 'Save Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogStudySessionModal;
