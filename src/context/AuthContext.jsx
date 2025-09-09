// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '../features/auth/authHooks';

const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const {
    user,
    token,
    role,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    loginUser,
    logoutUser,
    checkAuthStatus,
  } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = {
    user,
    token,
    role,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login: loginUser,
    logout: logoutUser,
    checkAuthStatus,
  };

  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}