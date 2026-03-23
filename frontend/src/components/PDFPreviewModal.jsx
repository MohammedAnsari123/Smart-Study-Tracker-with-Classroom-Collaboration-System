import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Download, AlertCircle, Loader2 } from 'lucide-react';
import { getProxyURL } from '../utils/proxyHelper';

const PDFPreviewModal = ({ isOpen, onClose, fileURL, title }) => {
    const [blobURL, setBlobURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Prepare authenticated proxy URLs using the centralized helper
    const downloadURL = getProxyURL(fileURL, true);
    const openInNewTabURL = getProxyURL(fileURL, false);

    useEffect(() => {
        let currentBlobURL = null;

        const fetchPDF = async () => {
            if (!isOpen || !fileURL) return;
            
            setLoading(true);
            setError(null);
            setBlobURL(null);

            try {
                // Fetch the PDF via proxy
                const response = await fetch(openInNewTabURL);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Server responded with ${response.status}`);
                }

                const blob = await response.blob();
                currentBlobURL = URL.createObjectURL(blob);
                setBlobURL(currentBlobURL);
            } catch (err) {
                console.error('Failed to fetch PDF via proxy:', err);
                setError(err.message || 'Failed to load document preview.');
            } finally {
                setLoading(false);
            }
        };

        fetchPDF();

        return () => {
            if (currentBlobURL) {
                URL.revokeObjectURL(currentBlobURL);
            }
        };
    }, [isOpen, fileURL, openInNewTabURL]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-darkCard w-full h-full max-w-6xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10 relative">
                
                {/* Header */}
                <div className="p-4 md:p-6 border-b dark:border-gray-800 flex items-center justify-between bg-white dark:bg-darkCard z-20">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-xl text-primary-600 dark:text-primary-400">
                            <ExternalLink size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-black text-gray-900 dark:text-white truncate">{title || 'PDF Preview'}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">Authenticated Secure Preview</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <a 
                            href={openInNewTabURL} 
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                            title="Open in New Tab"
                        >
                            <ExternalLink size={20} />
                        </a>
                        <a 
                            href={downloadURL} 
                            download 
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                            title="Download PDF"
                        >
                            <Download size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-100 dark:bg-slate-900 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-tighter text-xs">Accessing secure documents...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white dark:bg-slate-900">
                            <AlertCircle className="w-16 h-16 text-red-500 mb-6 drop-shadow-lg" />
                            <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-2 tracking-tight">System Access Error</h4>
                            <p className="max-w-md text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">
                                We couldn't securely fetch this document. The link might have expired or you may need to re-login.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a 
                                    href={openInNewTabURL} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-1 transition-all flex items-center gap-2"
                                >
                                    <ExternalLink size={20} />
                                    Try External View
                                </a>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="px-8 py-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Retry
                                </button>
                            </div>
                            <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-50">Log ID: {error}</p>
                        </div>
                    ) : blobURL ? (
                        <iframe
                            src={blobURL}
                            title={title}
                            className="w-full h-full border-none"
                        />
                    ) : null}
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t dark:border-gray-800 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Authenticated Server Access Protocol (v3.0.1)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PDFPreviewModal;
