import React from 'react';
import './TicketFooter.css';

const TicketFooter = () => {
  return (
    <footer className="ticket-footer">
      <p>© {new Date().getFullYear()} Support System</p>
    </footer>
  );
};

export default TicketFooter;