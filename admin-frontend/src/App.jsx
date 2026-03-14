import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthContext } from './context/AdminAuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CurriculumManagement from './pages/CurriculumManagement';
import UsersManagement from './pages/UsersManagement';
import AdminLayout from './components/AdminLayout';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!admin) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  const { admin, loading } = useContext(AdminAuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={admin ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={admin ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="curriculum" element={<CurriculumManagement />} />
          <Route path="users" element={<UsersManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
