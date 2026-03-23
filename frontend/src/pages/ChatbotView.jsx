import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import TopBar from '../components/TopBar';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Send, Bot, User, Trash2, Loader2, Info, FileText, X, Paperclip, Plus, MessageSquare, Clock } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dbProfileContext, setDbProfileContext] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const token = localStorage.getItem('token');
    const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load conversation history and user study profile on mount
    useEffect(() => {
        fetchConversations();
        fetchUserAIProfile();
    }, []);

    const fetchUserAIProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/ai/user-context', apiHeaders);
            console.log("AI Context Profile Loaded:", res.data.contextPayload ? "Success" : "Empty");
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
            // Combine DB Profile context (Curriculum + User data limited to 6 months) with any uploaded PDF context
            const fullContext = `${dbProfileContext}\n\n${pdfContext ? `PDF CONTENT:\n${pdfContext}` : ''}`;

            const res = await axios.post('http://localhost:8000/api/chat', {
                message: input,
                history: messages.slice(-5),
                context: fullContext
            });

            const assistantMsg = { role: 'assistant', content: res.data.response };
            const finalMessages = [...updatedMessages, assistantMsg];
            setMessages(finalMessages);

            // Save to database
            if (activeConversationId) {
                // Add both messages to existing conversation
                await axios.post(`http://localhost:5000/chat/${activeConversationId}/message`, userMsg, apiHeaders);
                await axios.post(`http://localhost:5000/chat/${activeConversationId}/message`, assistantMsg, apiHeaders);
            } else {
                // Create new conversation with a generated title
                const title = input.length > 40 ? input.substring(0, 40) + '...' : input;
                const createRes = await axios.post('http://localhost:5000/chat', {
                    title,
                    messages: finalMessages,
                    pdfName
                }, apiHeaders);
                setActiveConversationId(createRes.data._id);
            }

            // Refresh sidebar list
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

    const clearChat = () => {
        startNewChat();
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

            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* Sidebar - Chat History */}
                <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white dark:bg-darkCard border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden`}>
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <button
                            onClick={startNewChat}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition shadow-lg shadow-primary-500/20"
                        >
                            <Plus className="w-4 h-4" /> New Chat
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {loadingHistory ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv._id}
                                    onClick={() => loadConversation(conv._id)}
                                    role="button"
                                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group flex items-center justify-between cursor-pointer ${
                                        activeConversationId === conv._id
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{conv.title}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center mt-0.5">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formatDate(conv.updatedAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteConversation(conv._id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden min-h-0">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors bg-white dark:bg-darkCard rounded-lg border border-gray-200 dark:border-gray-700"
                                title={sidebarOpen ? 'Hide history' : 'Show history'}
                            >
                                <MessageSquare className="w-4 h-4" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center">
                                    <Sparkles className="w-6 h-6 mr-2 text-primary-500 animate-pulse" />
                                    AI Study Assistant
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                                    <Info className="w-3 h-3 mr-1" />
                                    Specialized in providing study information and explaining concepts.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Clear Chat"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Container */}
                    <div className="flex-1 bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden glassmorphism">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 dark:bg-slate-800 text-primary-500'
                                            }`}>
                                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
                                        </div>
                                        <div 
                                            className={`p-4 rounded-2xl text-sm font-medium leading-relaxed markdown-content ${msg.role === 'user'
                                                ? 'bg-primary-600 text-white rounded-tr-none shadow-md shadow-primary-500/20'
                                                : 'bg-gray-50 dark:bg-slate-800/50 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
                                            }`}
                                            style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                                        >
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start animate-in fade-in duration-300">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 text-primary-500 flex items-center justify-center">
                                            <Bot className="w-6 h-6" />
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 flex items-center">
                                            <Loader2 className="w-5 h-5 text-primary-500 animate-spin mr-2" />
                                            <span className="text-gray-400 text-sm font-medium italic">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-darkCard/50">
                            {pdfName && (
                                <div className="mb-3 flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl border border-primary-100 dark:border-primary-800 animate-in fade-in slide-in-from-bottom-1">
                                    <div className="flex items-center text-primary-700 dark:text-primary-300">
                                        <FileText className="w-4 h-4 mr-2" />
                                        <span className="text-xs font-bold truncate max-w-[200px]">{pdfName}</span>
                                        <span className="ml-2 text-[10px] font-medium opacity-70">(Active Context)</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setPdfContext(''); setPdfName(''); }}
                                        className="text-primary-500 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <div className="relative flex items-center gap-2">
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
                                    className={`p-3 rounded-xl transition-all border ${uploading
                                        ? 'bg-gray-100 border-gray-200 text-gray-400 animate-pulse'
                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                                        }`}
                                    title="Upload PDF for context"
                                >
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5 rotate-45" />}
                                </button>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={pdfName ? "Ask about the PDF..." : "Ask about any study topic..."}
                                        className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl pl-6 pr-14 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
                                        disabled={loading || uploading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !input.trim() || uploading}
                                        className={`absolute right-2 top-1.5 p-2.5 rounded-xl transition-all ${loading || !input.trim() || uploading
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30'
                                            }`}
                                    >
                                        <Send className="w-5 h-5" />
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
