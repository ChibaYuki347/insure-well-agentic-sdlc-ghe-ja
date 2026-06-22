import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

function Navigation({ currentPage, setCurrentPage, currentUser }) {
  const { logout } = useAuth();

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
      </ul>
      <div className="navbar-user" data-testid="navbar-user">
        <div className="navbar-user-copy">
          <span className="navbar-user-name">{currentUser.fullName}</span>
          <span className="navbar-user-role">{currentUser.role === 'ADMIN' ? 'Admin' : 'Policyholder'}</span>
        </div>
        <button className="nav-link nav-link-logout" onClick={logout} data-testid="logout-btn">
          ログアウト
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
