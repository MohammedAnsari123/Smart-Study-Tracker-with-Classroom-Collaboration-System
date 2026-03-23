import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Clock, Calendar, Brain, Search, Target, ArrowRight } from 'lucide-react';
import TopBar from '../components/TopBar';

const TestHistory = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTestHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/study', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Filter only sessions that have a completed test (testScore exists)
                const testSessions = res.data.filter(s => s.testScore !== undefined && s.testData !== null);
                
                // Sort by newest first
                testSessions.sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));
                
                setSessions(testSessions);
            } catch (err) {
                console.error('Failed to fetch test history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTestHistory();
    }, []);

    const filteredSessions = sessions.filter(session => 
        session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subtopic?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg font-sans text-gray-900 dark:text-gray-100 flex flex-col hidden-scrollbar pb-20">
            <TopBar />

            <div className="container mx-auto px-6 pt-10 pb-6 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                            <Trophy className="w-8 h-8 text-primary-500" /> Test <span className="text-primary-600">History</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Review your past AI-generated assessments and track your mastery.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search tests..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 w-full md:w-72 bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-medium transition-all shadow-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-primary-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading test history...</p>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="bg-white dark:bg-darkCard rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No Tests Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {searchTerm 
                                ? "We couldn't find any tests matching your search criteria." 
                                : "You haven't taken any AI generated tests yet. Start studying from your dashboard to unlock assessments!"}
                        </p>
                        {!searchTerm && (
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition transform hover:-translate-y-0.5"
                            >
                                Go to Dashboard
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSessions.map((session) => (
                            <div 
                                key={session._id}
                                onClick={() => navigate(`/test-results/${session._id}`)}
                                className="group bg-white dark:bg-darkCard rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-200 dark:hover:border-primary-900/50 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                    <ArrowRight className="w-5 h-5 text-primary-500" />
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center">
                                            <Brain className="w-5 h-5" />
                                        </div>
                                        <div className="flex font-semibold text-xs text-gray-500 gap-3">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(session.sessionDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border flex items-center gap-1.5 ${
                                        session.testScore >= 80 ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' :
                                        session.testScore >= 60 ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50' :
                                        'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50'
                                    }`}>
                                        <Trophy className="w-3 h-3" /> 
                                        {session.testScore}%
                                    </div>
                                </div>

                                <div className="flex-1 mt-2">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {session.subject}
                                    </h3>
                                    
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                            {session.topic}
                                        </p>
                                        {session.subtopic && (
                                            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 line-clamp-1">
                                                ↳ {session.subtopic}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between text-xs font-bold text-gray-400">
                                    <span className="flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1" /> {session.durationMinutes} min study
                                    </span>
                                    <span>
                                        {session.testData?.questions?.length || 0} Questions
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestHistory;
