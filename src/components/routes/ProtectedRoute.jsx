import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * Route guard checking AuthContext state.
 * Redirects unauthenticated candidates to /login?redirectTo=<destinationUrl>.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const destination = location.pathname + location.search;
    return (
      <Navigate 
        to={`/login?redirectTo=${encodeURIComponent(destination)}`} 
        replace 
      />
    );
  }

  return children ? children : <Outlet />;
}
