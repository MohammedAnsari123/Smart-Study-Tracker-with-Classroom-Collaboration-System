import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ClassroomView from './pages/ClassroomView';
import LandingPage from './pages/LandingPage';
import Classrooms from './pages/Classrooms';
import ChatbotView from './pages/ChatbotView';
import Flashcards from './pages/Flashcards';
import TestResults from './pages/TestResults';
import TestHistory from './pages/TestHistory';
import StudyMaterials from './pages/StudyMaterials';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-100 font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/classrooms" element={<PrivateRoute><Classrooms /></PrivateRoute>} />
          <Route path="/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
          <Route path="/chatbot" element={<PrivateRoute><ChatbotView /></PrivateRoute>} />
          <Route path="/study-materials" element={<PrivateRoute><StudyMaterials /></PrivateRoute>} />

          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/class/:id" element={<PrivateRoute><ClassroomView /></PrivateRoute>} />
          <Route path="/test-results/:id" element={<PrivateRoute><TestResults /></PrivateRoute>} />
          <Route path="/test-history" element={<PrivateRoute><TestHistory /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
