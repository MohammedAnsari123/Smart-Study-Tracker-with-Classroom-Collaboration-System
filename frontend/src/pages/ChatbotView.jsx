import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Send, Bot, User, Trash2, Loader2, Info, FileText, X, Paperclip, Plus, MessageSquare, Clock } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TypewriterMessage = ({ content, onComplete, onCharType }) => {
    const [displayedContent, setDisplayedContent] = useState('');

    useEffect(() => {
        let currentString = '';
        let i = 0;
        
        // Use a fast interval to give a smooth streaming effect
        const timer = setInterval(() => {
            if (i < content.length) {
                // Advance 2-4 characters per interval for faster typing of large text blocks
                const charsToAdd = Math.floor(Math.random() * 3) + 2; 
                currentString = content.substring(0, Math.min(i + charsToAdd, content.length));
                setDisplayedContent(currentString);
                i += charsToAdd;

                // trigger auto scroll if callback provided
                if (onCharType) onCharType();
            } else {
                clearInterval(timer);
                if (onComplete) onComplete();
                if (onCharType) onCharType();
            }
        }, 15);

        return () => clearInterval(timer);
    }, [content]);

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {displayedContent}
        </ReactMarkdown>
    );
};

const ChatbotView = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello ${user?.fullName || 'there'}! I'm your Smart Study Assistant. How can I help you with your studies today?` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [pdfContext, setPdfContext] = useState('');
    const [pdfName, setPdfName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(true);
    // Use innerWidth to determine initial sidebar state (closed on small screens)
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [dbProfileContext, setDbProfileContext] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        // Auto scroll smoothly when standard message array updates
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && !sidebarOpen) {
                setSidebarOpen(true);
            } else if (window.innerWidth < 768 && sidebarOpen) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    // Load conversation history and user study profile on mount
    useEffect(() => {
        fetchConversations();
        fetchUserAIProfile();
    }, []);

    const fetchUserAIProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/ai/user-context', apiHeaders);
            setDbProfileContext(res.data.contextPayload);
        } catch (error) {
            console.error('Failed to fetch user AI context profile:', error);
        }
    };

    const fetchConversations = async () => {
        try {
            setLoadingHistory(true);
            const res = await axios.get('http://localhost:5000/chat', apiHeaders);
            setConversations(res.data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const loadConversation = async (conversationId) => {
        try {
            const res = await axios.get(`http://localhost:5000/chat/${conversationId}`, apiHeaders);
            setMessages(res.data.messages);
            setActiveConversationId(conversationId);
            setPdfName(res.data.pdfName || '');
            setPdfContext('');
            if (window.innerWidth < 768) setSidebarOpen(false); // Close sidebar on mobile after selection
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    };

    const startNewChat = () => {
        setMessages([
            { role: 'assistant', content: `Hello ${user?.fullName || 'there'}! I'm your Smart Study Assistant. How can I help you with your studies today?` }
        ]);
        setActiveConversationId(null);
        setPdfContext('');
        setPdfName('');
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const deleteConversation = async (conversationId, e) => {
        e.stopPropagation();
        try {
            await axios.delete(`http://localhost:5000/chat/${conversationId}`, apiHeaders);
            setConversations(prev => prev.filter(c => c._id !== conversationId));
            if (activeConversationId === conversationId) {
                startNewChat();
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const fullContext = `${dbProfileContext}\n\n${pdfContext ? `PDF CONTENT:\n${pdfContext}` : ''}`;

            const res = await axios.post('http://localhost:8000/api/chat', {
                message: input,
                history: messages.slice(-5),
                context: fullContext
            });

            const assistantMsg = { role: 'assistant', content: res.data.response, isTyping: true };
            const finalMessages = [...updatedMessages, assistantMsg];
            setMessages(finalMessages);

            if (activeConversationId) {
                await axios.post(`http://localhost:5000/chat/${activeConversationId}/message`, userMsg, apiHeaders);
                await axios.post(`http://localhost:5000/chat/${activeConversationId}/message`, { role: 'assistant', content: res.data.response }, apiHeaders);
            } else {
                const title = input.length > 40 ? input.substring(0, 40) + '...' : input;
                const createRes = await axios.post('http://localhost:5000/chat', {
                    title,
                    messages: finalMessages,
                    pdfName
                }, apiHeaders);
                setActiveConversationId(createRes.data._id);
            }

            fetchConversations();
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting to my brain right now. Please ensure the local AI service is running."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            alert('Please upload a valid PDF file.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:5000/api/ai/extract-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setPdfContext(res.data.text);
            setPdfName(file.name);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `📖 I've processed **${file.name}**. You can now ask me questions specifically about the contents of this document!`
            }]);
        } catch (error) {
            console.error('PDF Upload Error:', error);
            alert('Failed to process PDF. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="h-screen bg-gray-50 dark:bg-darkBg flex flex-col overflow-hidden">
            <TopBar />

            <div className="flex-1 flex overflow-hidden min-h-0 relative">
                
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div 
                        className="md:hidden fixed inset-0 bg-black/60 z-30 transition-opacity backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar - Chat History */}
                <div className={`
                    absolute md:relative z-40 h-full
                    ${sidebarOpen ? 'translate-x-0 w-72 md:w-80 border-r shadow-2xl md:shadow-none' : '-translate-x-full w-72 md:w-0 border-r-0'} 
                    transition-all duration-300 ease-in-out bg-white dark:bg-darkCard border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden
                `}>
                    <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <button
                            onClick={startNewChat}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition shadow-lg shadow-primary-500/20"
                        >
                            <Plus className="w-5 h-5" /> New Chat
                        </button>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden ml-3 p-2 text-gray-500 bg-gray-100 rounded-xl"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                        {loadingHistory ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center py-10">
                                <MessageSquare className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No history</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv._id}
                                    onClick={() => loadConversation(conv._id)}
                                    role="button"
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all group flex items-start justify-between cursor-pointer ${
                                        activeConversationId === conv._id
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800 shadow-sm'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/80 border border-transparent'
                                    }`}
                                >
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-sm font-bold truncate">{conv.title}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formatDate(conv.updatedAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteConversation(conv._id, e)}
                                        className="opacity-0 md:opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all rounded-lg"
                                        title="Delete Chat"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 overflow-hidden min-h-0 bg-gray-50 dark:bg-darkBg">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`p-2 transition-colors rounded-xl border ${sidebarOpen ? 'bg-primary-50 border-primary-100 text-primary-600 dark:bg-primary-900/40 dark:border-primary-800' : 'bg-white dark:bg-darkCard border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-sm'}`}
                                title={sidebarOpen ? 'Hide history' : 'Show history'}
                            >
                                <MessageSquare className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center tracking-tight">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-500 animate-pulse" />
                                    AI Study Assistant
                                </h1>
                                <p className="hidden sm:flex text-gray-500 dark:text-gray-400 text-xs items-center mt-0.5 font-medium">
                                    <Info className="w-3.5 h-3.5 mr-1 text-primary-400" />
                                    Specialized in providing study information and explaining concepts.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={startNewChat}
                            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-800 rounded-xl transition-all shadow-sm"
                            title="Clear Chat"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Container */}
                    <div className="flex-1 bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2 sm:gap-3`}>
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${msg.role === 'user'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gradient-to-br from-primary-100 to-green-100 dark:from-primary-900/40 dark:to-green-900/40 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400'
                                            }`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-5 h-5 sm:w-6 sm:h-6" />}
                                        </div>
                                        <div 
                                            className={`p-4 rounded-2xl text-sm md:text-base font-medium leading-relaxed markdown-content ${msg.role === 'user'
                                                ? 'bg-primary-600 text-white rounded-tr-none shadow-md shadow-primary-500/20'
                                                : 'bg-gray-50 dark:bg-slate-800/40 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700/50'
                                            }`}
                                            style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                                        >
                                            {msg.isTyping ? (
                                                <TypewriterMessage 
                                                    content={msg.content} 
                                                    onCharType={() => scrollToBottom("auto")} 
                                                    onComplete={() => {
                                                        setMessages(prev => prev.map((m, i) => i === idx ? { ...m, isTyping: false } : m));
                                                    }}
                                                />
                                            ) : (
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start animate-in fade-in duration-300">
                                    <div className="flex max-w-[90%] md:max-w-[80%] gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-100 to-green-100 dark:from-primary-900/40 dark:to-green-900/40 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 flex items-center justify-center mt-1">
                                            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700/50 flex items-center">
                                            <Loader2 className="w-5 h-5 text-primary-500 animate-spin mr-3" />
                                            <span className="text-gray-400 text-sm font-bold tracking-widest uppercase text-[10px]">Processing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-darkCard/50">
                            {pdfName && (
                                <div className="mb-3 flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl border border-primary-100 dark:border-primary-800 animate-in zoom-in duration-200 shadow-sm">
                                    <div className="flex items-center text-primary-700 dark:text-primary-300">
                                        <FileText className="w-4 h-4 mr-2 hidden sm:block" />
                                        <span className="text-xs font-bold truncate max-w-[150px] sm:max-w-[250px]">{pdfName}</span>
                                        <span className="ml-2 text-[9px] font-black uppercase tracking-widest opacity-60 bg-primary-100 dark:bg-primary-900/50 px-2 py-0.5 rounded-full">PDF Active</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setPdfContext(''); setPdfName(''); }}
                                        className="text-primary-500 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <div className="relative flex flex-row items-center gap-2 sm:gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".pdf"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading || loading}
                                    className={`p-3 sm:p-4 flex-shrink-0 rounded-2xl transition-all border shadow-sm ${uploading
                                        ? 'bg-gray-100 border-gray-200 text-gray-400 animate-pulse'
                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 dark:hover:bg-slate-700'
                                        }`}
                                    title="Upload PDF Context"
                                >
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5 -rotate-45" />}
                                </button>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={pdfName ? "Ask about the document..." : "Type your message here..."}
                                        className="w-full bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary-100 dark:focus:border-primary-900/50 rounded-2xl pl-5 pr-14 py-3 sm:py-4 text-sm font-bold shadow-sm outline-none text-gray-900 dark:text-white transition-all placeholder-gray-400"
                                        disabled={loading || uploading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !input.trim() || uploading}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-xl transition-all ${loading || !input.trim() || uploading
                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-transparent'
                                            : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 shadow-md shadow-primary-500/30'
                                            }`}
                                    >
                                        <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotView;
