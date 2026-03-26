import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, FileText, Video, Globe, Link as LinkIcon } from 'lucide-react';
import PDFPreviewModal from '../components/PDFPreviewModal';
import TopBar from '../components/TopBar';

const StudyMaterials = () => {
    const { user } = useContext(AuthContext);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/materials/student', { headers });
                setMaterials(res.data);
            } catch (error) {
                console.error('Error fetching materials:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMaterials();
        }
    }, [user]);

    // Group materials by subjectName
    const groupedMaterials = materials.reduce((acc, curr) => {
        const subjectName = curr.subjectId?.subjectName || 'Other Resources';
        if (!acc[subjectName]) acc[subjectName] = [];
        acc[subjectName].push(curr);
        return acc;
    }, {});

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <Video className="w-5 h-5 text-purple-500" />;
            case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
            default: return <Globe className="w-5 h-5 text-blue-500" />;
        }
    };

    if (loading) return <div className="text-center py-20 dark:text-gray-300">Loading Study Materials...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg pb-12">
            <TopBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl shadow-inner">
                        <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Study Materials</h1>
                        <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-[0.2em] mt-2 uppercase">Curated Resources for {user?.department} • Sem {user?.semester}</p>
                    </div>
                </div>

                {Object.keys(groupedMaterials).length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-darkCard rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <BookOpen className="w-16 h-16 mx-auto mb-6 text-gray-200 dark:text-gray-700" />
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">No Materials Found</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto">Your administrators haven't uploaded any study materials for your assigned department and semester yet.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(groupedMaterials).map(([subjectName, mats]) => (
                            <div key={subjectName} className="bg-white dark:bg-darkCard rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-gray-50/50 dark:bg-slate-800/50 px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{subjectName}</h2>
                                    <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">{mats.length} Resources</span>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mats.map(material => (
                                        <div key={material._id} className="group relative flex flex-col p-6 bg-white dark:bg-darkCard rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-900/50 transition-all duration-300">
                                            <div className="flex items-start justify-between mb-5">
                                                <div className="p-3 bg-gray-50 dark:bg-slate-800/80 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                    {getTypeIcon(material.type)}
                                                </div>
                                                {material.topicName && (
                                                    <span className="text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg truncate max-w-[50%]">
                                                        {material.topicName}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 mb-4">
                                                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2" title={material.title}>{material.title}</h3>
                                            </div>

                                            {material.description && (
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-1 relative z-10">
                                                    {material.description}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-5 border-t border-gray-50 dark:border-gray-800/50">
                                                {material.type === 'pdf' ? (
                                                    <button
                                                        onClick={() => setSelectedMaterial(material)}
                                                        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                                    >
                                                        <FileText className="w-4 h-4" /> Open Document
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={material.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                                    >
                                                        <LinkIcon className="w-4 h-4" /> Open Resource
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedMaterial && (
                    <PDFPreviewModal
                        isOpen={!!selectedMaterial}
                        onClose={() => setSelectedMaterial(null)}
                        fileURL={selectedMaterial.url}
                        title={selectedMaterial.title}
                    />
                )}
            </div>
        </div>
    );
};

export default StudyMaterials;
