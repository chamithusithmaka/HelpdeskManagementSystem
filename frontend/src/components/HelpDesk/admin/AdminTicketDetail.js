import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaListAlt, FaCalendarAlt, FaTag, FaExclamationTriangle,
  FaCheck, FaPaperPlane, FaTimes, FaUserPlus, FaSpinner
} from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import './AdminTicketDetail.css';

const AdminTicketDetail = ({ ticketId, onClose, onTicketUpdated }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

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
      if (data.data.status) {
        setStatusUpdate(data.data.status);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResponse = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    try {
      setResponseLoading(true);
      const responseData = {
        responder: "Admin", // In a real app, this would be the logged-in admin name
        message: response
      };

      const resp = await fetch(`http://localhost:5000/api/tickets/${ticketId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData)
      });

      if (!resp.ok) {
        throw new Error('Failed to add response');
      }

      const data = await resp.json();
      setTicket(data.data);
      setResponse('');
      onTicketUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setResponseLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    try {
      setStatusLoading(true);
      const resp = await fetch(`http://localhost:5000/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: statusUpdate })
      });

      if (!resp.ok) {
        throw new Error('Failed to update status');
      }

      const data = await resp.json();
      setTicket(data.data);
      onTicketUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAssignTicket = async (e) => {
    e.preventDefault();
    if (!assignTo.trim()) return;

    try {
      setAssignLoading(true);
      const resp = await fetch(`http://localhost:5000/api/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId: assignTo })
      });

      if (!resp.ok) {
        throw new Error('Failed to assign ticket');
      }

      const data = await resp.json();
      setTicket(data.data);
      setAssignTo('');
      onTicketUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setAssignLoading(false);
    }
  };

  const validateNameInput = (input) => {
    // Only allow letters and spaces
    return /^[A-Za-z\s]*$/.test(input);
  };

  const handleAssignInputChange = (e) => {
    const value = e.target.value;
    // Only update state if the input contains only letters and spaces
    if (validateNameInput(value)) {
      setAssignTo(value);
    }
  };

  if (loading) {
    return (
      <div className="admin-detail-loading">
        <div className="admin-detail-spinner"></div>
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-detail-error">
        <FaExclamationTriangle className="admin-detail-error-icon" />
        <p>{error}</p>
        <button className="admin-btn" onClick={onClose}>Go Back</button>
      </div>
    );
  }

  if (!ticket) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'admin-status-open';
      case 'In Progress': return 'admin-status-progress';
      case 'Resolved': return 'admin-status-resolved';
      case 'Closed': return 'admin-status-closed';
      default: return '';
    }
  };

  return (
    <div className="admin-ticket-detail">
      <div className="admin-detail-header">
        <div className="admin-detail-header-left">
          <h2>Ticket #{ticket._id.slice(-6).toUpperCase()}</h2>
          <span className={`admin-status-badge ${getStatusClass(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>
        <button className="admin-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="admin-detail-content">
        <div className="admin-detail-main">
          <div className="admin-detail-title">{ticket.title}</div>
          
          <div className="admin-detail-meta">
            <div className="admin-detail-meta-item">
              <FaUser className="admin-detail-icon" />
              <span className="admin-detail-label">Student ID:</span>
              <span className="admin-detail-value">{ticket.studentId}</span>
            </div>
            
            <div className="admin-detail-meta-item">
              <FaListAlt className="admin-detail-icon" />
              <span className="admin-detail-label">Issue Type:</span>
              <span className="admin-detail-value">{ticket.issueType}</span>
            </div>
            
            <div className="admin-detail-meta-item">
              <FaCalendarAlt className="admin-detail-icon" />
              <span className="admin-detail-label">Created:</span>
              <span className="admin-detail-value">{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            
            <div className="admin-detail-meta-item">
              <FaTag className="admin-detail-icon" />
              <span className="admin-detail-label">Priority:</span>
              <span className={`admin-detail-value admin-priority-${ticket.priority.toLowerCase()}`}>
                {ticket.priority}
              </span>
            </div>

            <div className="admin-detail-meta-item">
              <FaUserPlus className="admin-detail-icon" />
              <span className="admin-detail-label">Assigned To:</span>
              <span className="admin-detail-value">
                {ticket.assignedTo || 'Not assigned'}
              </span>
            </div>
          </div>
          
          <div className="admin-detail-description">
            <h3>
              <MdDescription className="admin-detail-icon" /> Description
            </h3>
            <p>{ticket.description}</p>
          </div>
          
          <div className="admin-detail-responses">
            <h3>Responses ({ticket.responses ? ticket.responses.length : 0})</h3>
            
            {ticket.responses && ticket.responses.length > 0 ? (
              <div className="admin-responses-list">
                {ticket.responses.map((resp, index) => (
                  <div key={index} className="admin-response-item">
                    <div className="admin-response-header">
                      <span className="admin-response-author">{resp.responder}</span>
                      <span className="admin-response-time">
                        {new Date(resp.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="admin-response-body">{resp.message}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-no-responses">No responses yet</div>
            )}
            
            <form className="admin-response-form" onSubmit={handleAddResponse}>
              <h4>Add Response</h4>
              <textarea
                className="admin-response-textarea"
                placeholder="Type your response here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="admin-btn admin-btn-primary"
                disabled={responseLoading}
              >
                {responseLoading ? (
                  <><FaSpinner className="admin-spinner-icon" /> Sending...</>
                ) : (
                  <><FaPaperPlane /> Send Response</>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="admin-detail-sidebar">
          <div className="admin-detail-actions">
            <div className="admin-action-card">
              <h4>Update Status</h4>
              <form onSubmit={handleUpdateStatus}>
                <select
                  className="admin-select"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  required
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-primary"
                  disabled={statusLoading}
                >
                  {statusLoading ? (
                    <><FaSpinner className="admin-spinner-icon" /> Updating...</>
                  ) : (
                    <><FaCheck /> Update Status</>
                  )}
                </button>
              </form>
            </div>
            
            <div className="admin-action-card">
              <h4>Assign Ticket</h4>
              <form onSubmit={handleAssignTicket}>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Enter agent name (letters only)"
                  value={assignTo}
                  onChange={handleAssignInputChange}
                  pattern="[A-Za-z\s]+"
                  title="Please enter only letters and spaces"
                  required
                />
                <div className="admin-input-hint">
                  Only letters and spaces are allowed
                </div>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-primary"
                  disabled={assignLoading || !assignTo.trim()}
                >
                  {assignLoading ? (
                    <><FaSpinner className="admin-spinner-icon" /> Assigning...</>
                  ) : (
                    <><FaUserPlus /> Assign Ticket</>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="admin-ticket-timeline">
            <h4>Ticket Timeline</h4>
            <div className="admin-timeline-item">
              <div className="admin-timeline-point"></div>
              <div className="admin-timeline-content">
                <div className="admin-timeline-title">Ticket Created</div>
                <div className="admin-timeline-time">{new Date(ticket.createdAt).toLocaleString()}</div>
              </div>
            </div>
            
            {ticket.responses && ticket.responses.map((resp, index) => (
              <div key={index} className="admin-timeline-item">
                <div className="admin-timeline-point"></div>
                <div className="admin-timeline-content">
                  <div className="admin-timeline-title">Response Added</div>
                  <div className="admin-timeline-time">{new Date(resp.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetail;