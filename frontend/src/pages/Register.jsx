import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [departments, setDepartments] = useState([]);
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Fetch departments from backend on mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/departments');
                setDepartments(res.data);
            } catch (err) {
                console.error('Failed to load departments:', err);
            }
        };
        fetchDepartments();
    }, []);

    // When department changes, update available semesters
    useEffect(() => {
        if (department) {
            const dept = departments.find(d => d.name === department);
            setAvailableSemesters(dept?.semesters || []);
            setSemester(''); // reset semester when dept changes
        } else {
            setAvailableSemesters([]);
        }
    }, [department, departments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!department || !semester) {
            setError('Please select both department and semester');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/auth/register', {
                fullName, email, password, department, semester: Number(semester)
            });
            login(res.data, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-darkCard p-10 rounded-xl shadow-xl">
                <div className="flex flex-col items-center">
                    <BookOpen className="h-12 w-12 text-primary-500 mb-4" />
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Join Smart Study Tracker today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm mt-1"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm mt-1"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm mt-1"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Department Dropdown - from database */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                            <select
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm mt-1"
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept.name}>
                                        {dept.fullName} ({dept.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Semester Dropdown - based on selected department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                            <select
                                required
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                disabled={!department}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm mt-1 disabled:opacity-50"
                            >
                                <option value="">{department ? 'Select Semester' : 'Select department first'}</option>
                                {availableSemesters.map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                        >
                            Register
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
