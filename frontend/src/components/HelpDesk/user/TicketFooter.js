import React from 'react';
import './TicketFooter.css';

const TicketFooter = () => {
  return (
    <footer className="ticket-footer">
      <p>© {new Date().getFullYear()} Helpdesk Management System</p>
    </footer>
  );
};

export default TicketFooter;