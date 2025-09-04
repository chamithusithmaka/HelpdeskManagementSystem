import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminTicketList from './AdminTicketList';
import AdminStats from './AdminStats';
import AdminTicketDetail from './AdminTicketDetail';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab, refreshTrigger]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/tickets');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await response.json();
      setTickets(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/tickets/stats/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStatsData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedTicketId(null);
  };

  const handleTicketClick = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  const handleTicketUpdate = () => {
    // Refresh data after updates
    setRefreshTrigger(prev => prev + 1);
    if (selectedTicketId) {
      // Keep showing the selected ticket after update
      setSelectedTicketId(selectedTicketId);
    }
  };

  const handleCloseTicketDetail = () => {
    setSelectedTicketId(null);
  };

  const renderContent = () => {
    if (selectedTicketId) {
      return (
        <AdminTicketDetail 
          ticketId={selectedTicketId}
          onClose={handleCloseTicketDetail}
          onTicketUpdated={handleTicketUpdate}
        />
      );
    }

    switch (activeTab) {
      case 'tickets':
        return (
          <AdminTicketList 
            tickets={tickets}
            isLoading={isLoading}
            error={error}
            onTicketClick={handleTicketClick}
          />
        );
      case 'stats':
        return (
          <AdminStats 
            statsData={statsData}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return <div className="admin-content-placeholder">Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="admin-main-container">
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;