import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import QuestionBank from './pages/QuestionBank';
import Pricing from './pages/Pricing';
import Interview from './pages/Interview';
import Results from './pages/Results';
import History from './pages/History';
import Analytics from './pages/Analytics';
import ProfilePage from './pages/ProfilePage';
import ErrorBoundary from './components/boundaries/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

/**
 * RootRedirect Component
 * Default '/' entry point.
 * Redirects to /dashboard if candidate is logged in, or /login if unauthenticated.
 */
function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <ToastContainer />
          <Router>
            <AppLayout theme={theme} toggleTheme={toggleTheme}>
              <Routes>
                {/* Default Entry Point: Login-First Guard */}
                <Route path="/" element={<RootRedirect />} />

                {/* Public Auth Routes (Clean layout, no Navbar) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Candidate Routes (Authenticated Shell with Navbar) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
                  <Route path="/resume-upload" element={<ResumeAnalyzer />} />
                  <Route path="/question-bank" element={<QuestionBank />} />
                  <Route path="/coding-practice" element={<QuestionBank />} />
                  <Route path="/aptitude" element={<QuestionBank />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/interview" element={<Interview />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Route>

                {/* Fallback path redirects to root guard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
