import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Optionally verify token is still valid by calling /auth/me
        // This runs in the background and updates user if token is valid
        authService.getCurrentUser()
          .then((currentUser) => {
            setUser(currentUser);
          })
          .catch((error) => {
            // Token is invalid, clear storage
            console.error('Token validation failed:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            setUser(null);
          });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const response = await authService.signup(data);
      setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const googleSignIn = async (data) => {
    try {
      const response = await authService.googleSignIn(data);
      setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setUser(null);
    }
  };

  const getCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    googleSignIn,
    logout,
    getCurrentUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

