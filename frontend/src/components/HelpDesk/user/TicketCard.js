import React from 'react';
import { BsEyeFill } from 'react-icons/bs';
import { FaCalendarAlt, FaUser, FaListAlt, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
import '../user/TicketCard.css';

const TicketCard = ({ ticket, onViewDetails, onDeleteTicket }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Open':
        return 'ticket-status-open';
      case 'In Progress':
        return 'ticket-status-progress';
      case 'Resolved':
        return 'ticket-status-resolved';
      case 'Closed':
        return 'ticket-status-closed';
      default:
        return '';
    }
  };

  const isTicketDeletable = ticket.status === 'Resolved' || ticket.status === 'Closed';
  const isTicketUpdatable = ticket.status !== 'Resolved' && ticket.status !== 'Closed';

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering view details
    if (window.confirm(`Are you sure you want to delete this ticket: ${ticket.title}?`)) {
      onDeleteTicket(ticket._id);
    }
  };

  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <h3 className="ticket-card-title">{ticket.title}</h3>
        <span className={`ticket-card-status ${getStatusClass(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>
      
      <div className="ticket-card-body">
        <p className="ticket-card-type">
          <FaListAlt className="ticket-card-icon" />
          <span className="ticket-label">Type:</span> {ticket.issueType}
        </p>
        <p className="ticket-card-id">
          <FaUser className="ticket-card-icon" />
          <span className="ticket-label">Student ID:</span> {ticket.studentId}
        </p>
        <p className="ticket-card-description">
          <FaInfoCircle className="ticket-card-icon" />
          <span className="ticket-label">Description:</span> {ticket.description}
        </p>
        <p className="ticket-card-date">
          <FaCalendarAlt className="ticket-card-icon" />
          <span className="ticket-label">Created:</span> {new Date(ticket.createdAt).toLocaleDateString()}
        </p>

       
      </div>

      <div className="ticket-card-footer">
        <button 
          className="ticket-view-btn"
          onClick={() => onViewDetails(ticket._id)}
        >
          <BsEyeFill className="ticket-btn-icon" /> View Details
        </button>
        
        
      </div>
    </div>
  );
};

export default TicketCard;