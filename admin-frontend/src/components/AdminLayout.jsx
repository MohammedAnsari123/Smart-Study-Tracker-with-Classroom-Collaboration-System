import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { 
    LogOut, 
    LayoutDashboard, 
    Database, 
    ListTree, 
    Users, 
    BookOpen, 
    Settings,
    Bell
} from 'lucide-react';

const AdminLayout = () => {
    const { admin, logout } = useContext(AdminAuthContext);

    const navLinks = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/curriculum', icon: ListTree, label: 'Curriculum' },
        { to: '/materials', icon: BookOpen, label: 'Study Materials' },
        { to: '/users', icon: Users, label: 'Students' },
    ];

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0 h-full">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-gray-900 text-white">
                    <Database className="w-6 h-6 text-red-500 mr-2" />
                    <span className="font-black text-lg tracking-tight">Admin<span className="text-red-500">Center</span></span>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navLinks.map((link) => (
                        <NavLink 
                            key={link.to}
                            to={link.to} 
                            end={link.end}
                            className={({ isActive }) => `flex items-center px-4 py-3 rounded-xl font-bold transition-all group ${
                                isActive 
                                    ? 'bg-red-50 text-red-700 shadow-sm border border-red-100' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <link.icon className="w-5 h-5 mr-3 transition-colors group-hover:text-red-600" /> 
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-xl">
                            {admin?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate">{admin?.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{admin?.email?.split('@')[0]}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 shrink-0 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                        <div>
                            <h1 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Management Console</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-900 leading-tight">{admin?.name}</p>
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Administrator</p>
                            </div>
                            <button 
                                onClick={logout}
                                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>
                
                <div className="flex-1 overflow-hidden relative flex flex-col p-6">
                    <div className="flex-1 bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 overflow-hidden border border-gray-100 flex flex-col">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
