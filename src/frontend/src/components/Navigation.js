import React from 'react';
import '../styles/Navigation.css';

function Navigation({ currentPage, setCurrentPage, onLogout }) {
  return (
    <nav className="navbar" data-testid="navbar">
      <div className="navbar-brand">
        <h1>🏥 InsureWell</h1>
      </div>
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
        {onLogout && (
          <li>
            <button
              className="nav-link nav-logout"
              onClick={onLogout}
              data-testid="nav-logout"
            >
              サインアウト
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
