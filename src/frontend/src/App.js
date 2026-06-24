import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Claims from './components/Claims';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

function AppContent() {
  const { currentUser, authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    if (currentUser) {
      fetchData();
    } else {
      setPolicies([]);
      setClaims([]);
      setLoading(false);
      setError(null);
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [policiesRes, claimsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/policies`),
        axios.get(`${API_BASE_URL}/claims`),
      ]);
      setPolicies(policiesRes.data);
      setClaims(claimsRes.data);
      setError(null);
    } catch (err) {
      setError('バックエンドからデータを取得できませんでした。認証状態と Spring Boot サーバーを確認してください。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  if (authLoading) {
    return (
      <div className="app auth-shell">
        <div className="loader">認証状態を確認しています…</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="app auth-shell">
        <Login />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} />
        <main className="main-content">
          <div className="loader">読み込み中…</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} />
        <main className="main-content">
          <div className="error-banner">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} />
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard
            policies={policies}
            claims={claims}
            onRefresh={refreshData}
            apiBase={API_BASE_URL}
            currentUser={currentUser}
            isAdmin={isAdmin}
          />
        )}
        {currentPage === 'claims' && (
          <Claims
            policies={policies}
            claims={claims}
            onRefresh={refreshData}
            apiBase={API_BASE_URL}
            currentUser={currentUser}
            isAdmin={isAdmin}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
