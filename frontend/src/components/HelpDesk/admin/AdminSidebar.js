import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaChartBar, FaUsers, FaClipboardList } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'tickets', label: 'Tickets', icon: <FaTicketAlt />, path: '/admin/tickets' },
    { id: 'orders', label: 'Orders', icon: <FaClipboardList />, path: '/admin/orders' },
    { id: 'users', label: 'Users', icon: <FaUsers />, path: '/admin/users' },
    { id: 'stats', label: 'Statistics', icon: <FaChartBar />, path: '/admin/stats' },
  ];

  return (
    <aside className="admin-sidebar">
      <nav className="admin-nav">
        <ul className="admin-nav-list">
          {menuItems.map(item => (
            <li 
              key={item.id} 
              className={`admin-nav-item ${activeTab === item.id ? 'admin-nav-active' : ''}`}
              onClick={() => navigate(item.path)}
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