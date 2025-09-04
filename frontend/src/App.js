import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TicketDashboard from './components/HelpDesk/user/TicketDashboard';
import AdminDashboard from './components/HelpDesk/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<TicketDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
