import React, { useState } from 'react';
import { FaFilter, FaSearch, FaEye, FaUserTag, FaExclamationTriangle } from 'react-icons/fa';
import AdminPDFGenerator from './AdminPDFGenerator';
import './AdminTicketList.css';

const AdminTicketList = ({ tickets, isLoading, error, onTicketClick }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <FaExclamationTriangle />
        <p>{error}</p>
      </div>
    );
  }

  // Filter tickets based on status, priority, and search query
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    // Safely check properties before using toLowerCase()
    const titleMatch = ticket.title && searchQuery ? 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) : 
      !searchQuery;
    
    const descriptionMatch = ticket.description && searchQuery ? 
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) : 
      !searchQuery;
    
    const studentIdMatch = ticket.studentId && searchQuery ? 
      ticket.studentId.toLowerCase().includes(searchQuery.toLowerCase()) : 
      !searchQuery;
    
    const matchesSearch = !searchQuery || titleMatch || descriptionMatch || studentIdMatch;
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'admin-status-open';
      case 'In Progress': return 'admin-status-progress';
      case 'Resolved': return 'admin-status-resolved';
      case 'Closed': return 'admin-status-closed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Low': return 'admin-priority-low';
      case 'Medium': return 'admin-priority-medium';
      case 'High': return 'admin-priority-high';
      case 'Critical': return 'admin-priority-critical';
      default: return '';
    }
  };

  return (
    <div className="admin-ticket-list-container">
      <div className="admin-ticket-controls">
        <div className="admin-ticket-header">
          <h2 className="admin-section-title">All Support Tickets</h2>
          <div className="admin-pdf-controls">
            <AdminPDFGenerator 
              tickets={filteredTickets} 
              filters={{
                status: statusFilter,
                priority: priorityFilter,
                search: searchQuery
              }}
            />
          </div>
        </div>
        
        <div className="admin-filters">
          <div className="admin-search">
            <FaSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="admin-filter">
            <label>
              <FaFilter className="admin-filter-icon" />
              Status:
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div className="admin-filter">
            <label>
              <FaExclamationTriangle className="admin-filter-icon" />
              Priority:
            </label>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="admin-no-tickets">No tickets match your criteria</div>
      ) : (
        <div className="admin-ticket-table-container">
          <table className="admin-ticket-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Student ID</th>
                <th>Issue Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket._id} className="admin-ticket-row">
                  <td className="admin-ticket-id">
                    {ticket._id ? ticket._id.slice(-6).toUpperCase() : 'N/A'}
                  </td>
                  <td className="admin-ticket-title">{ticket.title || 'N/A'}</td>
                  <td>{ticket.studentId || 'N/A'}</td>
                  <td>{ticket.issueType || 'N/A'}</td>
                  <td>
                    <span className={`admin-status-badge ${getStatusClass(ticket.status)}`}>
                      {ticket.status || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-priority-badge ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority || 'N/A'}
                    </span>
                  </td>
                  <td>
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="admin-ticket-actions">
                    <button 
                      className="admin-view-btn"
                      onClick={() => onTicketClick(ticket._id)}
                    >
                      <FaEye /> View
                    </button>
                    <button 
                      className="admin-assign-btn"
                      onClick={() => onTicketClick(ticket._id)}
                    >
                      <FaUserTag /> Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTicketList;