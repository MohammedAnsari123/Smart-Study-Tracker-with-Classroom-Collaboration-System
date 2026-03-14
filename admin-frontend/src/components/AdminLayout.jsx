import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { LogOut, LayoutDashboard, Database, ListTree, Users } from 'lucide-react';

const AdminLayout = () => {
    const { admin, logout } = useContext(AdminAuthContext);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Database className="w-6 h-6 text-red-600 mr-2" />
                    <span className="font-black text-lg text-gray-900">AdminPanel</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <NavLink 
                        to="/" 
                        end
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </NavLink>
                    <NavLink 
                        to="/users" 
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Users className="w-5 h-5 mr-3" /> Users
                    </NavLink>
                    <NavLink 
                        to="/curriculum" 
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <ListTree className="w-5 h-5 mr-3" /> Curriculum
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-xl font-bold text-gray-800">System Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">{admin?.name}</span>
                        <button 
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-auto p-8 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
