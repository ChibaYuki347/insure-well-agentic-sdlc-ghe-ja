import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('ユーザー名とパスワードを入力してください');
      return;
    }

    try {
      setSubmitting(true);
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.error || 'ログインに失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card" data-testid="login-card">
        <h1>InsureWell ログイン</h1>
        <p>認証されたユーザーだけが保険契約と請求情報にアクセスできます。</p>
        {error && <div className="alert alert-error" data-testid="login-error">{error}</div>}
        <form onSubmit={handleSubmit} data-testid="login-form">
          <div className="form-group">
            <label>ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              data-testid="login-username"
            />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              data-testid="login-password"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting} data-testid="login-submit">
              {submitting ? 'ログイン中…' : 'ログイン'}
            </button>
          </div>
        </form>
        <p className="login-hint">デモ用: admin / admin123, alex / alex123, maria / maria123</p>
      </div>
    </div>
  );
}

export default Login;