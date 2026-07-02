import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Claims from './components/Claims';
import AuthScreen from './components/AuthScreen';
import { buildCsrfHeaders } from './csrf';

// API base URL.
// - Local dev & GitHub Codespaces: leave unset to use the relative "/api" path,
//   which the CRA dev server proxies to the Spring Boot backend (see "proxy" in
//   package.json). This keeps everything on a single origin, so it works in
//   Codespaces (forwarded HTTPS) without depending on a second forwarded port.
// - Override with REACT_APP_API_BASE_URL if you need to point at a different host.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

axios.defaults.withCredentials = true;
// Spring Security returns an exposed CSRF token that must be echoed back.
// Disable axios cookie-based XSRF auto-header to avoid sending the raw cookie token.
axios.defaults.xsrfCookieName = null;
axios.defaults.xsrfHeaderName = null;

const AUTH_CHECK_ERROR = '認証状態を確認できませんでした。バックエンドが起動しているか確認してください。';
const LOAD_ERROR = 'バックエンドからデータを取得できませんでした。Spring Boot サーバーがポート 8080 で起動しているか確認してください。';
const SESSION_EXPIRED_ERROR = 'セッションの有効期限が切れました。もう一度サインインしてください。';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [authStatus, setAuthStatus] = useState('checking');
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [authError, setAuthError] = useState('');
  const [dataError, setDataError] = useState('');

  const resetAppData = () => {
    setPolicies([]);
    setClaims([]);
    setCurrentPage('dashboard');
    setDataError('');
  };

  const handleSessionExpiry = () => {
    setAuthStatus('unauthenticated');
    setCurrentUser(null);
    resetAppData();
    setAuthError(SESSION_EXPIRED_ERROR);
  };

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [policiesRes, claimsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/policies`),
        axios.get(`${API_BASE_URL}/claims`),
      ]);
      setPolicies(policiesRes.data);
      setClaims(claimsRes.data);
      setDataError('');
    } catch (err) {
      if (err.response?.status === 401) {
        handleSessionExpiry();
        return;
      }

      setDataError(LOAD_ERROR);
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const initializeSession = useCallback(async () => {
    setAuthStatus('checking');
    try {
      await axios.get(`${API_BASE_URL}/auth/csrf`);
      const meResponse = await axios.get(`${API_BASE_URL}/auth/me`);
      setCurrentUser(meResponse.data.user);
      setAuthStatus('authenticated');
      await fetchData();
    } catch (err) {
      if (err.response?.status === 401) {
        setAuthStatus('unauthenticated');
        setCurrentUser(null);
        resetAppData();
        setAuthError('');
        return;
      }

      setAuthStatus('unauthenticated');
      setCurrentUser(null);
      resetAppData();
      setAuthError(AUTH_CHECK_ERROR);
      console.error(err);
    }
  }, [fetchData]);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const handleSignIn = async ({ username, password }) => {
    setAuthError('');

    try {
      const csrfHeaders = await buildCsrfHeaders(API_BASE_URL);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      }, {
        headers: csrfHeaders,
      });

      setCurrentUser(response.data.user);
      setAuthStatus('authenticated');
      await fetchData();
    } catch (err) {
      setCurrentUser(null);
      setAuthStatus('unauthenticated');
      resetAppData();
      setAuthError(err.response?.data?.error || 'サインインに失敗しました');
    }
  };

  const handleSignOut = async () => {
    try {
      const csrfHeaders = await buildCsrfHeaders(API_BASE_URL);
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: csrfHeaders,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAuthStatus('unauthenticated');
      setCurrentUser(null);
      resetAppData();
      setAuthError('');
    }
  };

  const refreshData = () => {
    fetchData();
  };

  if (authStatus === 'checking') {
    return (
      <div className="app">
        <main className="main-content auth-loading-shell">
          <div className="loader">認証状態を確認中…</div>
        </main>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <AuthScreen
        onSignIn={handleSignIn}
        error={authError}
      />
    );
  }

  return (
    <div className="app authenticated-app">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />
      <main className="main-content">
        {loadingData ? (
          <div className="loader">データを読み込み中…</div>
        ) : dataError ? (
          <div className="error-banner">{dataError}</div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;
