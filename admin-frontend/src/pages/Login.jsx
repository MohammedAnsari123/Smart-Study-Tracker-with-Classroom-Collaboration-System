import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { ShieldAlert, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AdminAuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-black text-center text-gray-900 mb-2">Admin Portal</h2>
                <p className="text-gray-500 text-center font-medium placeholder:mb-8 text-sm">Sign in to manage the system</p>
                
                <div className="h-6 mb-2">
                    {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg font-bold text-center">{error}</p>}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-red-500/20 text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {loading ? 'Authenticating...' : 'Sign In Securely'}
                        {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                    </button>
                    
                    <p className="text-center text-sm font-medium text-gray-500 mt-6">
                        Need an admin account? <Link to="/register" className="text-red-600 hover:text-red-500 font-bold">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
