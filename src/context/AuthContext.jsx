import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : {
        name: 'Candidate User',
        email: 'user@example.com',
        targetRole: 'Senior Full-Stack Engineer',
        avatar: null
      };
    } catch {
      return { name: 'Candidate User', email: 'user@example.com', targetRole: 'Senior Full-Stack Engineer', avatar: null };
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      localStorage.setItem('isLoggedIn', 'false');
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      const authToken = data.accessToken || 'mock-jwt-token-2026';
      const userEmail = credentials.email || 'user@example.com';
      const derivedName = userEmail.split('@')[0] ? (userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)) : 'Candidate User';
      const userData = data.user || {
        name: data.name || derivedName,
        email: userEmail,
        targetRole: data.targetJobTitle || 'Senior Full-Stack Engineer'
      };

      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setLoading(false);
      // Fallback for offline demo mode
      const mockToken = 'mock-jwt-token-2026';
      const userEmail = credentials.email || 'user@example.com';
      const derivedName = userEmail.split('@')[0] ? (userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)) : 'Candidate User';
      const mockUser = {
        name: derivedName,
        email: userEmail,
        targetRole: 'Senior Full-Stack Engineer'
      };
      setToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, isMock: true };
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('isLoggedIn', 'false');
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
