import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from '../../HelpDesk/admin/AdminHeader';
import AdminSidebar from '../../HelpDesk/admin/AdminSidebar';
import './AdminOrders.css';

const statusIcons = {
  Approved: <span style={{color:'#27ae60'}}>✔️</span>,
  Rejected: <span style={{color:'#e74c3c'}}>❌</span>,
  Pending: <span style={{color:'#f39c12'}}>⏳</span>,
  Cancelled: <span style={{color:'#7f8c8d'}}>🚫</span>,
  Completed: <span style={{color:'#2980b9'}}>✔️</span>
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [disputeResolution, setDisputeResolution] = useState('');
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

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

  // Approve order
  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedBy: 'Admin' })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchOrder();
      } else {
        alert(data.message || 'Failed to approve order.');
      }
    } catch {
      alert('Failed to approve order.');
    }
    setApproveLoading(false);
  };

  // Reject order
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    setRejectLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectedReason: rejectReason, approvedBy: 'Admin' })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchOrder();
        setRejectReason('');
      } else {
        alert(data.message || 'Failed to reject order.');
      }
    } catch {
      alert('Failed to reject order.');
    }
    setRejectLoading(false);
  };

  // Resolve dispute
  const handleResolveDispute = async () => {
    if (!disputeResolution.trim()) {
      alert('Please provide a resolution.');
      return;
    }
    setDisputeLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/resolve-dispute`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution: disputeResolution })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchOrder();
        setDisputeResolution('');
      } else {
        alert(data.message || 'Failed to resolve dispute.');
      }
    } catch {
      alert('Failed to resolve dispute.');
    }
    setDisputeLoading(false);
  };

  // Mark order as completed
  const handleComplete = async () => {
    setCompleteLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchOrder();
      } else {
        alert(data.message || 'Failed to mark as completed.');
      }
    } catch {
      alert('Failed to mark as completed.');
    }
    setCompleteLoading(false);
  };

  // Delete order
  const handleDeleteOrder = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok && data.success) {
          navigate('/admin/orders');
        } else {
          alert(data.message || 'Failed to delete order.');
        }
      } catch {
        alert('Failed to delete order.');
      }
    }
  };

  if (loading) return <div className="admin-orders-loading">Loading order...</div>;
  if (!order) return <div className="admin-orders-error">Order not found.</div>;

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
          
          <main className="admin-orders-main" style={{ alignItems: 'center' }}>
            <button className="admin-orders-view-btn" style={{marginBottom:16}} onClick={() => navigate('/admin/orders')}>
              ← Back to Orders
            </button>
            <div className="orderdetail-card" style={{maxWidth:900, width:'100%', display:'grid', gridTemplateColumns:'2fr 1fr', gap:0}}>
              {/* Left: Order Info */}
              <div className="orderdetail-card-body" style={{padding:'24px 32px', borderRight:'1px solid #f0f0f0', display:'flex', flexDirection:'column', gap:'16px'}}>
                <div className="orderdetail-card-header" style={{marginBottom:12}}>
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
                <div>
                  <strong>User:</strong> {order.username}
                </div>
                <div>
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
                <div>
                  <strong>Total Items:</strong> {order.totalItems}
                </div>
                <div>
                  <strong>Total Price:</strong> Rs. {order.totalPrice}
                </div>
                <div>
                  <strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}
                </div>
                {/* Admin Actions */}
                {order.status === 'Pending' && (
                  <div style={{marginTop:16}}>
                    <button
                      className="admin-orders-view-btn"
                      onClick={handleApprove}
                      disabled={approveLoading}
                      style={{marginRight:8}}
                    >
                      {approveLoading ? 'Approving...' : 'Approve'}
                    </button>
                    <input
                      type="text"
                      placeholder="Reject reason"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      style={{marginRight:8, padding:'7px 10px', borderRadius:4, border:'1px solid #dbe2e8'}}
                    />
                    <button
                      className="admin-orders-view-btn"
                      onClick={handleReject}
                      disabled={rejectLoading}
                      style={{background:'#e74c3c'}}
                    >
                      {rejectLoading ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                )}
                {order.status === 'Approved' && (
                  <div style={{marginTop:16}}>
                    <button
                      className="admin-orders-view-btn"
                      onClick={handleComplete}
                      disabled={completeLoading}
                      style={{background:'#2980b9'}}
                    >
                      {completeLoading ? 'Marking...' : 'Mark as Completed'}
                    </button>
                  </div>
                )}
                {['Completed', 'Cancelled', 'Rejected'].includes(order.status) && (
                  <button
                    className="admin-orders-view-btn"
                    onClick={handleDeleteOrder}
                    style={{background:'#7f8c8d', marginTop:10}}
                    disabled={!['Completed', 'Cancelled', 'Rejected'].includes(order.status)}
                  >
                    Delete Order
                  </button>
                )}
              </div>
              {/* Right: Dispute Section */}
              <div className="orderdetail-card-right" style={{padding:'24px 32px', background:'#f9fbfc', minHeight:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                <h3>Dispute & Resolution</h3>
                {order.dispute && (
                  <>
                    <div>
                      <strong>Dispute Status:</strong> {order.dispute.status}
                    </div>
                    {order.dispute.messages && order.dispute.messages.length > 0 && (
                      <div className="orderdetail-dispute-history">
                        <strong>Dispute Messages:</strong>
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
                    <div style={{marginTop:10}}>
                      <input
                        type="text"
                        placeholder="Resolution message"
                        value={disputeResolution}
                        onChange={e => setDisputeResolution(e.target.value)}
                        style={{marginRight:8, padding:'7px 10px', borderRadius:4, border:'1px solid #dbe2e8'}}
                      />
                      <button
                        className="admin-orders-view-btn"
                        onClick={handleResolveDispute}
                        disabled={disputeLoading}
                        style={{background:'#27ae60'}}
                      >
                        {disputeLoading ? 'Resolving...' : 'Resolve Dispute'}
                      </button>
                    </div>
                    {order.dispute.resolution && (
                      <div style={{marginTop:8, color:'#27ae60'}}>
                        <strong>Resolution:</strong> {order.dispute.resolution}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
          {/* <footer className="admin-orders-footer">
            <span>© {new Date().getFullYear()} Helpdesk Management System</span>
          </footer> */}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;