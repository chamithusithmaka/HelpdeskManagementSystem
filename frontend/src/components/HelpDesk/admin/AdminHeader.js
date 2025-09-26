import React from 'react';
import { FaCog, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="admin-logo">
        <h1>Admin</h1>
      </div>
      <div className="admin-header-controls">
        
        <div className="admin-user-menu">
          <FaUser className="admin-icon" />
          <span className="admin-username">Admin</span>
          <div className="admin-dropdown">
            <div className="admin-dropdown-item">
              <FaCog /> Settings
            </div>
            <div className="admin-dropdown-item">
              <FaSignOutAlt /> Logout
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;