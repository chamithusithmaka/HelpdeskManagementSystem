import React from 'react';
import { FaTicketAlt, FaChartBar, FaUsers, FaCog, FaTachometerAlt } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    
    { id: 'tickets', label: 'Tickets', icon: <FaTicketAlt /> },
    { id: 'stats', label: 'Statistics', icon: <FaChartBar /> },
    
  ];

  return (
    <aside className="admin-sidebar">
      <nav className="admin-nav">
        <ul className="admin-nav-list">
          {menuItems.map(item => (
            <li 
              key={item.id} 
              className={`admin-nav-item ${activeTab === item.id ? 'admin-nav-active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;