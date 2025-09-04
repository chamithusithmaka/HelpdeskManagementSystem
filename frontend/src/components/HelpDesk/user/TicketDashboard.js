import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaFilter, FaPlus, FaSearch } from 'react-icons/fa';
import { MdOutlineError } from 'react-icons/md';
import TicketCard from './TicketCard';
import TicketCreateForm from './TicketCreateForm';
import TicketDetail from './TicketDetail';
import TicketHeader from './TicketHeader';
import TicketFooter from './TicketFooter';
import './TicketDashboard.css';

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch tickets
  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      let url = 'http://localhost:5000/api/tickets';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setTickets(data.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch tickets. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  const handleCloseDetails = () => {
    setSelectedTicketId(null);
  };

  const handleDeleteTicket = async (ticketId) => {
    // Implementation of delete functionality
  };

  return (
    <div className="ticket-container">
      <TicketHeader />
      
      <div className="ticket-dashboard-container">
        <DashboardHeader 
          onCreateClick={() => setShowCreateForm(true)} 
        />

        <TicketFilter 
          statusFilter={statusFilter}
          onFilterChange={(e) => setStatusFilter(e.target.value)}
        />

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <TicketList 
            tickets={tickets}
            onViewDetails={handleViewDetails} 
            onDeleteTicket={handleDeleteTicket}
          />
        )}

        {showCreateForm && (
          <TicketCreateForm 
            onClose={() => setShowCreateForm(false)}
            onTicketCreated={fetchTickets}
          />
        )}

        {selectedTicketId && (
          <TicketDetail
            ticketId={selectedTicketId}
            onClose={handleCloseDetails}
            onTicketUpdated={fetchTickets}
          />
        )}
      </div>
      
      <TicketFooter />
    </div>
  );
};

// Dashboard Header Component
const DashboardHeader = ({ onCreateClick }) => (
  <div className="ticket-dashboard-header">
    <h1 className="ticket-dashboard-title">
      <FaTicketAlt className="ticket-icon" /> Support Ticket System
    </h1>
    <button 
      className="ticket-create-btn"
      onClick={onCreateClick}
    >
      <FaPlus className="ticket-btn-icon" /> Create Support Request
    </button>
  </div>
);

// Ticket Filter Component
const TicketFilter = ({ statusFilter, onFilterChange }) => (
  <div className="ticket-filter-section">
    <div className="ticket-filter-group">
      <FaFilter className="ticket-filter-icon" />
      <label className="ticket-filter-label">Filter by Status:</label>
      <select 
        className="ticket-filter-dropdown"
        value={statusFilter}
        onChange={onFilterChange}
      >
        <option value="all">All Tickets</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>
    </div>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="ticket-loading">
    <div className="ticket-loading-spinner"></div>
    Loading tickets...
  </div>
);

// Error State Component
const ErrorState = ({ message }) => (
  <div className="ticket-error">
    <MdOutlineError className="ticket-error-icon" />
    {message}
  </div>
);

// Ticket List Component
const TicketList = ({ tickets, onViewDetails, onDeleteTicket }) => (
  <div className="ticket-list">
    {tickets.length === 0 ? (
      <div className="ticket-no-data">
        <FaSearch className="ticket-no-data-icon" />
        <p>No tickets found</p>
      </div>
    ) : (
      tickets.map((ticket) => (
        <TicketCard 
          key={ticket._id} 
          ticket={ticket} 
          onViewDetails={onViewDetails}
          onDeleteTicket={onDeleteTicket}
        />
      ))
    )}
  </div>
);

export default TicketDashboard;