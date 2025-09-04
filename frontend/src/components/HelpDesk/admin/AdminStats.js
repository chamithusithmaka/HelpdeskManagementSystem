import React from 'react';
import { FaTicketAlt, FaExclamationCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import './AdminStats.css';

const AdminStats = ({ statsData, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="admin-stats-loading">
        <FaSpinner className="admin-stats-spinner" />
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-stats-error">
        <FaExclamationTriangle className="admin-stats-error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="admin-stats-no-data">
        <FaExclamationCircle />
        <p>No statistics available</p>
      </div>
    );
  }

  return (
    <div className="admin-stats-container">
      <h2 className="admin-stats-title">Support Ticket Statistics</h2>

      <div className="admin-stats-summary">
        <div className="admin-stats-card admin-stats-total">
          <div className="admin-stats-icon">
            <FaTicketAlt />
          </div>
          <div className="admin-stats-data">
            <h3>Total Tickets</h3>
            <span className="admin-stats-number">{statsData.total}</span>
          </div>
        </div>

        <div className="admin-stats-card admin-stats-open">
          <div className="admin-stats-icon">
            <FaTicketAlt />
          </div>
          <div className="admin-stats-data">
            <h3>Open</h3>
            <span className="admin-stats-number">{statsData.open}</span>
          </div>
        </div>

        <div className="admin-stats-card admin-stats-progress">
          <div className="admin-stats-icon">
            <FaTicketAlt />
          </div>
          <div className="admin-stats-data">
            <h3>In Progress</h3>
            <span className="admin-stats-number">{statsData.inProgress}</span>
          </div>
        </div>

        <div className="admin-stats-card admin-stats-resolved">
          <div className="admin-stats-icon">
            <FaTicketAlt />
          </div>
          <div className="admin-stats-data">
            <h3>Resolved</h3>
            <span className="admin-stats-number">{statsData.resolved}</span>
          </div>
        </div>
      </div>

      <div className="admin-stats-details">
        <div className="admin-stats-section">
          <h3 className="admin-stats-section-title">Tickets by Priority</h3>
          <div className="admin-stats-chart">
            <div className="admin-chart-bar-container">
              {statsData.byPriority && Object.keys(statsData.byPriority).map(priority => (
                <div key={priority} className="admin-chart-item">
                  <div className="admin-chart-label">{priority.charAt(0).toUpperCase() + priority.slice(1)}</div>
                  <div className="admin-chart-bar-wrapper">
                    <div 
                      className={`admin-chart-bar admin-priority-${priority}`}
                      style={{width: `${(statsData.byPriority[priority] / statsData.total) * 100}%`}}
                    ></div>
                  </div>
                  <div className="admin-chart-value">{statsData.byPriority[priority]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-stats-section">
          <h3 className="admin-stats-section-title">Tickets by Issue Type</h3>
          <div className="admin-stats-chart">
            <div className="admin-chart-bar-container">
              {statsData.byIssueType && Object.keys(statsData.byIssueType).map((type, index) => (
                <div key={type} className="admin-chart-item">
                  <div className="admin-chart-label">{type}</div>
                  <div className="admin-chart-bar-wrapper">
                    <div 
                      className={`admin-chart-bar admin-issue-type-${index % 5}`}
                      style={{width: `${(statsData.byIssueType[type] / statsData.total) * 100}%`}}
                    ></div>
                  </div>
                  <div className="admin-chart-value">{statsData.byIssueType[type]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;