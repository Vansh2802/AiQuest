import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Learn from './pages/Learn';
import Interests from './pages/Interests';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen w-full scanlines bg-retro-dark dark:bg-retro-dark">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/interests"
          element={
            <ProtectedRoute>
              <Navbar />
              <Interests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <Navbar />
              <Learn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:topic"
          element={
            <ProtectedRoute>
              <Navbar />
              <Study />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <Navbar />
              <Study />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* Global Chatbot - visible on all authenticated pages */}
      <Chatbot />
    </div>
  );
}
