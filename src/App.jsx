import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
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

// Layout wrapper to conditionally show/hide Navbar and Footer based on focus states
function AppLayout({ children, theme, toggleTheme, isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  
  // Hide Navbar/Footer on Login, Signup, ForgotPassword, and Active Interview screens
  const isFullPage = ['/login', '/signup', '/forgot-password', '/interview'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {!isFullPage && (
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
        />
      )}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {!isFullPage && <Footer />}
    </div>
  );
}

// ProtectedRoute checks session state and redirects unauthorized traffic back to login
function ProtectedRoute({ isLoggedIn }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
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
    <Router>
      <AppLayout theme={theme} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes Session Context Wrapper */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/results" element={<Results />} />
          </Route>

          {/* Fallback path redirects back to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

