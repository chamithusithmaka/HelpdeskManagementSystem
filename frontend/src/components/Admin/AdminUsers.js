import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../HelpDesk/admin/AdminHeader';
import AdminSidebar from '../HelpDesk/admin/AdminSidebar';
import Footer from '../Common/Footer';
import AdminUsersPDFGenerator from './AdminUsersPDFGenerator';
import { FaSearch, FaFilter } from 'react-icons/fa';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('http://localhost:5000/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        setErr(data.message || 'Failed to load users');
      }
    } catch {
      setErr('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setMsg('');
    setErr('');
    try {
      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMsg('User deleted.');
        setUsers(users.filter(u => u._id !== id));
      } else {
        const data = await res.json();
        setErr(data.message || 'Delete failed');
      }
    } catch {
      setErr('Delete failed');
    }
  };

  // Get unique roles and faculties for filter dropdowns
  const uniqueRoles = ['all', ...Array.from(new Set(users.map(u => u.role).filter(Boolean)))];
  const uniqueFaculties = ['all', ...Array.from(new Set(users.map(u => u.faculty).filter(Boolean)))];

  // Filter and search logic
  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesFaculty = facultyFilter === 'all' || u.faculty === facultyFilter;
    const matchesSearch =
      !searchQuery ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.uni_id && u.uni_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.contact_no && u.contact_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.faculty && u.faculty.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesFaculty && matchesSearch;
  });

  return (
    <div className="admin-users-bg">
      <AdminHeader />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <AdminSidebar activeTab={activeTab} onTabChange={tab => {
          setActiveTab(tab);
          if (tab === 'users') navigate('/admin/users');
          if (tab === 'orders') navigate('/admin/orders');
          if (tab === 'tickets') navigate('/admin/tickets');
          if (tab === 'stats') navigate('/admin/stats');
        }} />
        <div className="admin-users-container" style={{ flex: 1 }}>
          <h2>User Management</h2>
          {msg && <div className="admin-users-success">{msg}</div>}
          {err && <div className="admin-users-error">{err}</div>}
          {loading ? (
            <div>Loading users...</div>
          ) : (
            <>
              <div className="admin-users-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="admin-users-search" style={{ position: 'relative' }}>
                    <FaSearch className="admin-users-search-icon" style={{ position: 'absolute', left: 10, top: 10, color: '#888' }} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="admin-users-search-input"
                      style={{ paddingLeft: 32, height: 34, borderRadius: 4, border: '1px solid #dbe2e8' }}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-users-filter" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaFilter style={{ color: '#888' }} />
                    <select
                      value={roleFilter}
                      onChange={e => setRoleFilter(e.target.value)}
                      className="admin-users-filter-select"
                      style={{ height: 34, borderRadius: 4, border: '1px solid #dbe2e8' }}
                    >
                      {uniqueRoles.map(role => (
                        <option key={role} value={role}>{role === 'all' ? 'All Roles' : role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-users-filter" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaFilter style={{ color: '#888' }} />
                    <select
                      value={facultyFilter}
                      onChange={e => setFacultyFilter(e.target.value)}
                      className="admin-users-filter-select"
                      style={{ height: 34, borderRadius: 4, border: '1px solid #dbe2e8' }}
                    >
                      {uniqueFaculties.map(faculty => (
                        <option key={faculty} value={faculty}>{faculty === 'all' ? 'All Faculties' : faculty}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <AdminUsersPDFGenerator users={filteredUsers} />
              </div>
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Uni ID</th>
                    <th>Role</th>
                    <th>Contact</th>
                    <th>Faculty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>{u.uni_id}</td>
                      <td>{u.role}</td>
                      <td>{u.contact_no}</td>
                      <td>{u.faculty}</td>
                      <td>
                        <button
                          className="admin-users-view-btn"
                          onClick={() => navigate(`/admin/users/${u._id}`)}
                        >
                          View Details
                        </button>
                        <button
                          className="admin-users-delete-btn"
                          onClick={() => handleDelete(u._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 24 }}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminUsers;