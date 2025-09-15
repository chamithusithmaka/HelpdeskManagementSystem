import React, { useState, useEffect } from 'react';
import { FaUser, FaListAlt, FaCalendarAlt, FaFlag, FaTimes, FaEdit, FaTrash, FaCheck, FaLock } from 'react-icons/fa';
import { MdDescription, MdOutlineError, MdMessage, MdWarning } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import './TicketDetail.css';

const TicketDetail = ({ ticketId, onClose, onTicketUpdated }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ticket details');
      }
      const data = await response.json();
      setTicket(data.data);
      setEditFormData({
        title: data.data.title,
        description: data.data.description,
        priority: data.data.priority
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'title') {
      // Allow only letters, numbers, and spaces
      filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    setEditFormData({
      ...editFormData,
      [name]: filteredValue
    });
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket.data);
      setIsEditing(false);
      onTicketUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      onClose();
      onTicketUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail-modal">
        <div className="ticket-detail-content">
          <div className="ticket-detail-header">
            <h2>Loading ticket details...</h2>
            <button className="ticket-detail-close-btn" onClick={onClose}>
              <IoClose />
            </button>
          </div>
          <div className="ticket-detail-loading">
            <div className="ticket-detail-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-detail-modal">
        <div className="ticket-detail-content">
          <div className="ticket-detail-header">
            <h2>Error</h2>
            <button className="ticket-detail-close-btn" onClick={onClose}>
              <IoClose />
            </button>
          </div>
          <div className="ticket-detail-error">
            <MdOutlineError className="ticket-detail-error-icon" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  // Check if ticket can be updated or deleted based on status
  const isTicketUpdatable = ticket.status === 'Open';
  const isTicketDeletable = ticket.status === 'Open' || ticket.status === 'Closed'; // Only Open or Closed
  const formattedDate = new Date(ticket.createdAt).toLocaleString();
  
  // Get the message based on ticket status
  const getStatusMessage = () => {
    switch(ticket.status) {
      case 'Resolved':
        return "This ticket is resolved and cannot be updated. You can only delete it.";
      case 'Closed':
        return "This ticket is closed and cannot be updated. You can only delete it.";
      case 'In Progress':
        return "This ticket is currently being worked on. You can update or delete it.";
      default:
        return "";
    }
  };
  
  return (
    <div className="ticket-detail-modal">
      <div className="ticket-detail-content">
        <div className="ticket-detail-header">
          <h2>Ticket Details</h2>
          <button className="ticket-detail-close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        
        {deleteConfirm ? (
          <div className="ticket-delete-confirm">
            <h3>Are you sure you want to delete this ticket?</h3>
            <p>This action cannot be undone.</p>
            <div className="ticket-delete-actions">
              <button className="ticket-cancel-btn" onClick={() => setDeleteConfirm(false)}>
                <FaTimes /> Cancel
              </button>
              <button className="ticket-delete-btn" onClick={handleDeleteTicket}>
                <FaTrash /> Confirm Delete
              </button>
            </div>
          </div>
        ) : isEditing ? (
          <form className="ticket-edit-form" onSubmit={handleUpdateTicket}>
            <div className="ticket-form-group">
              <label className="ticket-form-label">
                <FaListAlt className="ticket-detail-icon" /> Title
              </label>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleInputChange}
                className="ticket-form-input"
                required
                pattern="[A-Za-z0-9 ]+"
                title="Only letters, numbers, and spaces allowed"
              />
            </div>
            
            <div className="ticket-form-group">
              <label className="ticket-form-label">
                <MdDescription className="ticket-detail-icon" /> Description
              </label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleInputChange}
                className="ticket-form-textarea"
                rows="5"
                required
              ></textarea>
            </div>
            
            <div className="ticket-form-group">
              <label className="ticket-form-label">
                <FaFlag className="ticket-detail-icon" /> Priority
              </label>
              <select
                name="priority"
                value={editFormData.priority}
                onChange={handleInputChange}
                className="ticket-form-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div className="ticket-edit-actions">
              <button 
                type="button" 
                className="ticket-cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                type="submit" 
                className="ticket-update-btn"
              >
                <FaCheck /> Update Ticket
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="ticket-detail-status-header">
              <div className={`ticket-detail-status ticket-status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                {ticket.status}
              </div>
              <div className="ticket-detail-priority">
                <FaFlag className="ticket-detail-icon" /> 
                Priority: <span className={`priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
              </div>
            </div>
            
            <div className="ticket-detail-info">
              <h3 className="ticket-detail-title">{ticket.title}</h3>
              
              <div className="ticket-detail-item">
                <FaUser className="ticket-detail-icon" />
                <span className="ticket-detail-label">Student ID:</span> 
                <span className="ticket-detail-value">{ticket.studentId}</span>
              </div>
              
              <div className="ticket-detail-item">
                <FaListAlt className="ticket-detail-icon" />
                <span className="ticket-detail-label">Issue Type:</span> 
                <span className="ticket-detail-value">{ticket.issueType}</span>
              </div>
              
              <div className="ticket-detail-item">
                <FaCalendarAlt className="ticket-detail-icon" />
                <span className="ticket-detail-label">Created:</span> 
                <span className="ticket-detail-value">{formattedDate}</span>
              </div>
              
              <div className="ticket-detail-description">
                <h4><MdDescription className="ticket-detail-icon" /> Description</h4>
                <p>{ticket.description}</p>
              </div>
              
              {ticket.responses && ticket.responses.length > 0 && (
                <div className="ticket-detail-responses">
                  <h4><MdMessage className="ticket-detail-icon" /> Responses</h4>
                  {ticket.responses.map((response, index) => (
                    <div key={index} className="ticket-response-item">
                      <div className="ticket-response-header">
                        <span className="ticket-response-author">{response.responder}</span>
                        <span className="ticket-response-date">
                          {new Date(response.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="ticket-response-message">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Status notice message - only show for Resolved or Closed tickets */}
              {!isTicketUpdatable && (
                <div className="ticket-status-notice">
                  <MdWarning className="ticket-notice-icon" />
                  {getStatusMessage()}
                </div>
              )}
              
              <div className="ticket-detail-actions">
                {isTicketUpdatable ? (
                  <button 
                    className="ticket-edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit /> Edit Ticket
                  </button>
                ) : (
                  <button 
                    className="ticket-locked-btn"
                    disabled
                  >
                    <FaLock /> Cannot Edit
                  </button>
                )}

                {/* Delete button: enabled only if Open or Closed */}
                <button 
                  className="ticket-delete-btn"
                  onClick={() => {
                    if (isTicketDeletable) setDeleteConfirm(true);
                  }}
                  disabled={!isTicketDeletable}
                  title={isTicketDeletable ? "Delete this ticket" : "You can only delete tickets that are Open or Closed"}
                  style={{ pointerEvents: !isTicketDeletable ? 'none' : 'auto', opacity: !isTicketDeletable ? 0.6 : 1 }}
                >
                  <FaTrash /> Delete Ticket
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;