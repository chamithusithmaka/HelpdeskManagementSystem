import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  // Check for user or admin in localStorage
  const isLoggedIn = localStorage.getItem('user') || localStorage.getItem('Admin');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('Admin');
    navigate('/login');
  };

  return (
    <header className="main-header">
      <div className="header-left">
        {/* <Link to="/" className="header-logo">HelpdeskMS</Link> */}
        <nav className="header-nav">
          <Link to="/" className="header-link">Home</Link>
          <Link to="/books" className="header-link">Books</Link>
          <Link to="/profile" className="header-link">Profile</Link>
          <Link to="/helpdesk" className="header-link">Helpdesk</Link>
        </nav>
      </div>
      <div className="header-right">
        {!isLoggedIn && (
          <Link to="/register" className="header-btn">Register</Link>
        )}
        {isLoggedIn ? (
          <button
            className="header-btn header-btn-login"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="header-btn header-btn-login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;