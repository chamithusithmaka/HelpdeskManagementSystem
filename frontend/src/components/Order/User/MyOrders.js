import React, { useEffect, useState } from 'react';
import { FaListAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';

const statusOptions = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        setError('User not logged in.');
        setOrders([]);
        setLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:5000/api/orders/user/${user._id}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.data || []);
    } catch (err) {
      setError('Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some(item =>
        item.itemName?.toLowerCase().includes(search.toLowerCase())
      );
    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="myorders-bg">
      <header className="myorders-header">
        <button className="myorders-back-btn" onClick={() => navigate('/books')}>
          <FaArrowLeft style={{ marginRight: 6 }} />
          Back to Book List
        </button>
        <h1>
          <FaListAlt className="myorders-title-icon" /> My Orders
        </h1>
      </header>
      <main className="myorders-main">
        <div className="myorders-search-row">
          <input
            type="text"
            placeholder="Search by Order ID or Book Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="myorders-search-input"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="myorders-filter-select"
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="myorders-loading">Loading orders...</div>
        ) : error ? (
          <div className="myorders-error">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="myorders-empty">No orders found.</div>
        ) : (
          <table className="myorders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Items</th>
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
                  <td>
                    <span className={`order-status-text ${order.status.toLowerCase()}`}>{order.status}</span>
                  </td>
                  <td>
                    <ul className="order-items-list">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="order-book-id">{item.bookId}</span> - {item.itemName} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.totalItems}</td>
                  <td>Rs. {order.totalPrice}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="order-view-btn"
                      onClick={() => navigate(`/my-orders/${order._id}`)}
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <footer className="myorders-footer">
        <span>© {new Date().getFullYear()} Helpdesk Management System</span>
      </footer>
    </div>
  );
};

export default MyOrders;