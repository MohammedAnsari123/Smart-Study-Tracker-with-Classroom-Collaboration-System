import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const apiHeaders = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/notifications', apiHeaders);
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/notifications/${id}`, {}, apiHeaders);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Error marking notification read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            await axios.put('http://localhost:5000/notifications/mark-all-read', {}, apiHeaders);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Error marking all read:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-darkCard">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-2xl bg-white dark:bg-darkCard ring-1 ring-black ring-opacity-5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`px-4 py-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors relative ${!notif.isRead ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                                >
                                    {!notif.isRead && (
                                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-full"></div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {notif.message}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        {notif.link && (
                                            <Link
                                                to={notif.link}
                                                onClick={() => {
                                                    markRead(notif._id);
                                                    setIsOpen(false);
                                                }}
                                                className="mt-2 inline-flex items-center text-xs text-primary-600 hover:text-primary-700 font-bold"
                                            >
                                                View Details <ExternalLink className="ml-1 w-3 h-3" />
                                            </Link>
                                        )}
                                    </div>
                                    {!notif.isRead && (
                                        <button
                                            onClick={() => markRead(notif._id)}
                                            className="p-1 rounded-full text-gray-300 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-center bg-gray-50/30 dark:bg-gray-800/30">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Only showing latest 20 notifications</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
