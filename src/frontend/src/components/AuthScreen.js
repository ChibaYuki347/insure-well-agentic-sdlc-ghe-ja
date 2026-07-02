import React, { useState } from 'react';
import '../styles/AuthScreen.css';

function AuthScreen({ onSignIn, error }) {
  const [formData, setFormData] = useState({
    username: 'admin',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSignIn(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell" data-testid="auth-screen">
      <div className="auth-backdrop" />
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-icon">🏥</span>
          <div>
            <h1>InsureWell</h1>
            <p>保険ポリシーと請求を安全に管理します</p>
          </div>
        </div>

        <div className="auth-note">
          <strong>Default admin:</strong> admin (local seed account)
        </div>

        {error && <div className="alert alert-error" data-testid="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} data-testid="auth-form">
          <div className="form-group">
            <label htmlFor="username">ユーザー名</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              autoComplete="username"
              required
              data-testid="auth-username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              required
              data-testid="auth-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={submitting}
            data-testid="auth-submit-btn"
          >
            {submitting ? 'サインイン中…' : 'サインイン'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AuthScreen;