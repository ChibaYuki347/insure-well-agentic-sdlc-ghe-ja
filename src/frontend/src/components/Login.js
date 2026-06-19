import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('ユーザー名とパスワードを入力してください。');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(msg || '認証に失敗しました。ユーザー名またはパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>🏥 InsureWell</h1>
          <p>アカウントにサインイン</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit} data-testid="login-form">
          {error && (
            <div className="login-error" data-testid="login-error" role="alert">
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力"
              autoComplete="username"
              data-testid="input-username"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              autoComplete="current-password"
              data-testid="input-password"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary login-btn"
            data-testid="login-btn"
            disabled={loading}
          >
            {loading ? 'サインイン中…' : 'サインイン'}
          </button>
        </form>
        <div className="login-hint">
          <small>デモ: admin / admin123 または user / user123</small>
        </div>
      </div>
    </div>
  );
}

export default Login;
