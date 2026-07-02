import React from 'react';
import '../styles/Navigation.css';

function Navigation({ currentPage, setCurrentPage, currentUser, onSignOut }) {
  return (
    <nav className="navbar" data-testid="navbar">
      <div className="navbar-brand">
        <h1>🏥 InsureWell</h1>
      </div>
      <div className="navbar-actions">
        <ul className="navbar-menu">
          <li>
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
              data-testid="nav-dashboard"
            >
              ダッシュボード
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'claims' ? 'active' : ''}`}
              onClick={() => setCurrentPage('claims')}
              data-testid="nav-claims"
            >
              請求
            </button>
          </li>
        </ul>

        {currentUser && (
          <div className="navbar-user">
            <div className="user-chip" data-testid="current-user-chip">
              <span className="user-name">{currentUser.displayName}</span>
              <span className="user-role">{currentUser.role}</span>
            </div>
            <button className="signout-btn" onClick={onSignOut} data-testid="signout-button">
              サインアウト
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
