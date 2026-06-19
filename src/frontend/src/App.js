import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Claims from './components/Claims';

// API base URL.
// - Local dev & GitHub Codespaces: leave unset to use the relative "/api" path,
//   which the CRA dev server proxies to the Spring Boot backend (see "proxy" in
//   package.json). This keeps everything on a single origin, so it works in
//   Codespaces (forwarded HTTPS) without depending on a second forwarded port.
// - Override with REACT_APP_API_BASE_URL if you need to point at a different host.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

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
      setError('バックエンドからデータを取得できませんでした。Spring Boot サーバーがポート 8080 で起動しているか確認してください。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="app">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="main-content">
          <div className="loader">読み込み中…</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="main-content">
          <div className="error-banner">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard
            policies={policies}
            claims={claims}
            onRefresh={refreshData}
            apiBase={API_BASE_URL}
          />
        )}
        {currentPage === 'claims' && (
          <Claims
            policies={policies}
            claims={claims}
            onRefresh={refreshData}
            apiBase={API_BASE_URL}
          />
        )}
      </main>
    </div>
  );
}

export default App;
