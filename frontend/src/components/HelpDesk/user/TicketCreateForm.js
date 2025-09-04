import React, { useState } from 'react';
import { FaUser, FaRegClipboard, FaList, FaFlag } from 'react-icons/fa';
import { MdDescription, MdCheckCircle, MdError } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import './TicketCreateForm.css';

const TicketCreateForm = ({ onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    issueType: '',
    description: '',
    priority: 'Medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create ticket');
      }
      
      setFormSuccess(true);
      setTimeout(() => {
        onTicketCreated();
        onClose();
      }, 2000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ticket-modal-overlay">
      <div className="ticket-create-form">
        <div className="ticket-form-header">
          <h2>Create Support Request</h2>
          <button className="ticket-close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        {formSuccess ? (
          <div className="ticket-success-message">
            <MdCheckCircle className="ticket-success-icon" />
            Support request submitted successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="ticket-form">
            {formError && (
              <div className="ticket-form-error">
                <MdError className="ticket-error-icon" />
                {formError}
              </div>
            )}
            
            <div className="ticket-form-group">
              <label className="ticket-form-label">
                <FaUser className="ticket-form-icon" /> Student ID *
              </label>
              <input
                type="text"
                name="studentId"
                className="ticket-form-input"
                value={formData.studentId}
                onChange={handleChange}
                required
                placeholder="Enter your student ID"
              />
            </div>
            
            <div className="ticket-form-group">
              <label className="ticket-form-label">
                <FaRegClipboard className="ticket-form-icon" /> Title *
              </label>
              <input
                type="text"
                name="title"
                className="ticket-form-input"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="100"
                placeholder="Brief title describing your issue"
              />
            </div>
            
            <div className="ticket-form-group">
              <label className="ticket-form-label">
                <FaList className="ticket-form-icon" /> Issue Type *
              </label>
              <select
                name="issueType"
                className="ticket-form-select"
                value={formData.issueType}
                onChange={handleChange}
                required
              >
                <option value="">Select an issue type</option>
                <option value="Missing Book Listing">Missing Book Listing</option>
                <option value="Failed Exchange">Failed Exchange</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Payment Problem">Payment Problem</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="ticket-form-group">
              <label className="ticket-form-label">
                <MdDescription className="ticket-form-icon" /> Description *
              </label>
              <textarea
                name="description"
                className="ticket-form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
                minLength="10"
                rows="5"
                placeholder="Please provide detailed information about your issue"
              ></textarea>
            </div>
            
            <div className="ticket-form-group">
              <label className="ticket-form-label">
                <FaFlag className="ticket-form-icon" /> Priority
              </label>
              <select
                name="priority"
                className="ticket-form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div className="ticket-form-actions">
              <button 
                type="button" 
                className="ticket-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="ticket-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketCreateForm;