import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TicketDashboard from './components/HelpDesk/user/TicketDashboard';
import AdminStats from './components/HelpDesk/admin/AdminStats';
import BookList from './components/Order/User/BookList';
import MyOrders from './components/Order/User/MyOrders';
import OrderDetail from './components/Order/User/OrderDetail';
import AdminOrders from './components/Order/Admin/AdminOrders';
import AdminOrderDetail from './components/Order/Admin/AdminOrderDetail';
import HomePage from './components/User/User/HomePage';
import Register from './components/User/Register';
import Login from './components/User/Login';
import Profile from './components/User/Profile';
import AdminTicketList from './components/HelpDesk/admin/AdminTicketList';
import AdminTicketDetail from './components/HelpDesk/admin/AdminTicketDetail';
// Add imports
import AdminUsers from './components/User/Admin/AdminUsers';
import AdminUserDetail from './components/User/Admin/AdminUserDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/books" element={<BookList />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-orders/:id" element={<OrderDetail />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="/helpdesk" element={<TicketDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add routes */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
          <Route path="/admin/tickets" element={<AdminTicketList />} />
          <Route path="/admin/tickets/:id" element={<AdminTicketDetail />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin" element={<AdminTicketList />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
