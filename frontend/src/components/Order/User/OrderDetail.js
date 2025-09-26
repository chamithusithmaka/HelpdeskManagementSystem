import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaBan } from 'react-icons/fa';
import './OrderDetail.css';

const statusIcons = {
  Approved: <FaCheckCircle className="order-status-icon approved" />,
  Rejected: <FaTimesCircle className="order-status-icon rejected" />,
  Pending: <FaHourglassHalf className="order-status-icon pending" />,
  Cancelled: <FaBan className="order-status-icon cancelled" />,
  Completed: <FaCheckCircle className="order-status-icon completed" />
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disputeMsg, setDisputeMsg] = useState('');
  const [disputeError, setDisputeError] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState('');

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setOrder(data.data);
      } else {
        setOrder(null);
      }
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchOrder();
      } else {
        alert(data.message || 'Failed to cancel order.');
      }
    } catch {
      alert('Failed to cancel order.');
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        navigate('/my-orders');
      } else {
        alert(data.message || 'Failed to delete order.');
      }
    } catch {
      alert('Failed to delete order.');
    }
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    setDisputeError('');
    setDisputeSuccess('');
    if (!disputeMsg.trim()) {
      setDisputeError('Message required.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: disputeMsg,
          sender: 'User' // Replace with actual username if available
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDisputeSuccess('Dispute sent!');
        setDisputeMsg('');
        fetchOrder();
      } else {
        setDisputeError(data.message || 'Failed to send dispute.');
      }
    } catch {
      setDisputeError('Failed to send dispute.');
    }
  };

  if (loading) return <div className="orderdetail-loading">Loading order...</div>;
  if (!order) return <div className="orderdetail-error">Order not found.</div>;

  return (
    <div className="orderdetail-bg">
      <header className="orderdetail-header">
        <button className="orderdetail-back-btn" onClick={() => navigate('/my-orders')}>
          <FaArrowLeft style={{ marginRight: 6 }} />
          Back to My Orders
        </button>
        <h1>Order Details</h1>
      </header>
      <main className="orderdetail-main">
        <div className="orderdetail-card">
          <div className="orderdetail-card-header">
            <div>
              <span className="orderdetail-status-icon">
                {statusIcons[order.status] || order.status}
              </span>
              <span className={`orderdetail-status-text ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <span className="orderdetail-id">
              Order ID: {order.orderId || order._id}
            </span>
          </div>
          <div className="orderdetail-card-body">
            <div className="orderdetail-section">
              <strong>User:</strong> {order.username}
            </div>
            <div className="orderdetail-section">
              <strong>Items:</strong>
              <ul className="orderdetail-items-list">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    <span className="orderdetail-book-id">{item.bookId}</span> - {item.itemName} × {item.quantity}
                    <span className="orderdetail-item-price">Rs. {item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="orderdetail-section">
              <strong>Total Items:</strong> {order.totalItems}
            </div>
            <div className="orderdetail-section">
              <strong>Total Price:</strong> Rs. {order.totalPrice}
            </div>
            <div className="orderdetail-section">
              <strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}
            </div>
            {order.status === 'Rejected' && order.approval && order.approval.rejectedReason && (
              <div className="orderdetail-section orderdetail-reject-note">
                <strong>Rejection Reason:</strong> {order.approval.rejectedReason}
              </div>
            )}
            <div className="orderdetail-section">
              {order.status === 'Pending' && (
                <button
                  className="orderdetail-cancel-btn"
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </button>
              )}
              {['Completed', 'Cancelled', 'Rejected'].includes(order.status) && (
                <button
                  className="orderdetail-delete-btn"
                  onClick={handleDeleteOrder}
                  disabled={!['Completed', 'Cancelled', 'Rejected'].includes(order.status)}
                >
                  Delete Order
                </button>
              )}
            </div>
          </div>
          <div className="orderdetail-card-right">
            <h3>Dispute & Resolution</h3>
            <form
              onSubmit={handleDisputeSubmit}
              className="orderdetail-dispute-form"
            >
              <input
                type="text"
                placeholder="Add a dispute or question..."
                value={disputeMsg}
                onChange={e => setDisputeMsg(e.target.value)}
                className="orderdetail-dispute-input"
              />
              <button type="submit" className="orderdetail-dispute-btn">
                Send
              </button>
            </form>
            {disputeError && (
              <div className="orderdetail-dispute-error">{disputeError}</div>
            )}
            {disputeSuccess && (
              <div className="orderdetail-dispute-success">{disputeSuccess}</div>
            )}
            {order.dispute && order.dispute.messages && order.dispute.messages.length > 0 && (
              <div className="orderdetail-dispute-history">
                <strong>Dispute History:</strong>
                <ul>
                  {order.dispute.messages.map((msg, idx) => (
                    <li key={idx}>
                      <span className="orderdetail-dispute-sender">{msg.sender}:</span> {msg.message}
                      <span className="orderdetail-dispute-date">
                        {' '}
                        ({new Date(msg.sentAt).toLocaleString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {order.dispute && order.dispute.resolution && (
              <div className="orderdetail-dispute-resolution">
                <strong>Resolution:</strong> {order.dispute.resolution}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="orderdetail-footer">
        <span>© {new Date().getFullYear()} Helpdesk Management System</span>
      </footer>
    </div>
  );
};

export default OrderDetail;