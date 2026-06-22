import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      setCurrentUser(response.data);
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    setCurrentUser(response.data);
    return response.data;
  };

  const logout = async () => {
    await axios.post(`${API_BASE_URL}/auth/logout`);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}