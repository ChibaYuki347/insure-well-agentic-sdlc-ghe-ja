import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const TOKEN_KEY = 'insurewell_token';
const USER_KEY = 'insurewell_user';

function getStoredAuth() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    if (token && user) return { token, user };
  } catch {
    // ignore parse errors
  }
  return null;
}

export function AuthProvider({ children }) {
  const stored = getStoredAuth();
  const [token, setToken] = useState(stored?.token || null);
  const [user, setUser] = useState(stored?.user || null);

  const login = useCallback(async (username, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    const { token: t, username: u, role: r } = res.data;
    const userData = { username: u, role: r };
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(t);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
