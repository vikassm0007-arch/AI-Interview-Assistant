import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

/**
 * AppLayout Component
 * Serves top Navbar, Sidebar, and Footer ONLY on protected authenticated pages.
 * Displays clean, distraction-free container for Auth screens (/login, /signup, /forgot-password).
 */
export default function AppLayout({ children, theme, toggleTheme }) {
  const location = useLocation();

  // Full-page Auth screens (No Navbar / Footer)
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
  // Full focus screens (e.g. active live interview session)
  const isInterviewPage = location.pathname === '/interview';

  const hideNavigation = isAuthPage || isInterviewPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {!hideNavigation && (
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      )}
      
      <main className="flex-grow flex flex-col">
        {children ? children : <Outlet />}
      </main>

      {!hideNavigation && <Footer />}
    </div>
  );
}
