import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/admin/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setAdmin(res.data);
                } catch (error) {
                    console.error('Admin token invalid or expired');
                    localStorage.removeItem('adminToken');
                    setAdmin(null);
                }
            }
            setLoading(false);
        };
        verifyAdmin();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
        localStorage.setItem('adminToken', res.data.token);
        setAdmin(res.data);
    };

    const register = async (name, email, password) => {
        const res = await axios.post('http://localhost:5000/api/admin/register', { name, email, password });
        localStorage.setItem('adminToken', res.data.token);
        setAdmin(res.data);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, loading, login, register, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
