import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobFeed from './pages/JobFeed';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateWorkspace from './pages/CandidateWorkspace';
import AiCareerStudio from './pages/AiCareerStudio';
import AdminConsole from './pages/AdminConsole';
import { useAuth } from './context/AuthContext';

import { useScrollReveal } from './hooks/useScrollReveal';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;

  return <>{children}</>;
};

function App() {
  useScrollReveal();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="EMPLOYER">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <CandidateWorkspace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-studio"
          element={
            <ProtectedRoute>
              <AiCareerStudio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminConsole />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
