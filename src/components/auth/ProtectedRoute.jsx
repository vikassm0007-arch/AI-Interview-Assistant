import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Higher-order component guarding sensitive application routes.
 * Redirects unauthenticated traffic to /login with returnUrl preserved in state.
 */
export default function ProtectedRoute({ isLoggedIn, children }) {
  const location = useLocation();

  if (!isLoggedIn) {
    // Preserve requested destination URL for seamless post-login redirection
    return (
      <Navigate 
        to="/login" 
        state={{ returnUrl: location.pathname + location.search }} 
        replace 
      />
    );
  }

  return children ? children : <Outlet />;
}
