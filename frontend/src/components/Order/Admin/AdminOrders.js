import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../HelpDesk/admin/AdminHeader';
import AdminSidebar from '../../HelpDesk/admin/AdminSidebar';
import './AdminOrders.css';
import AdminOrderPDFGenerator from './AdminOrderPDFGenerator';

const statusOptions = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.data || []);
    } catch (err) {
      setError('Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      order.username?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-orders-bg">
      <AdminHeader />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={tab => {
            setActiveTab(tab);
            if (tab === 'users') navigate('/admin/users');
            if (tab === 'orders') navigate('/admin/orders');
            if (tab === 'tickets') navigate('/admin/tickets');
            if (tab === 'stats') navigate('/admin/stats');
          }}
        />
        <div style={{ flex: 1 }}>
          
          <main className="admin-orders-main">
            <div style={{ marginBottom: '18px' }}>
              <AdminOrderPDFGenerator orders={filteredOrders} filters={{ status: statusFilter, search }} />
            </div>
            <div className="admin-orders-search-row">
              <input
                type="text"
                placeholder="Search by Order ID or User..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="admin-orders-search-input"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="admin-orders-filter-select"
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {loading ? (
              <div className="admin-orders-loading">Loading orders...</div>
            ) : error ? (
              <div className="admin-orders-error">{error}</div>
            ) : (
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Total Items</th>
                    <th>Total Price</th>
                    <th>Placed On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order.orderId || order._id}</td>
                      <td>{order.username}</td>
                      <td>{order.status}</td>
                      <td>{order.totalItems}</td>
                      <td>Rs. {order.totalPrice}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="admin-orders-view-btn"
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;