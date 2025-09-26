import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import './Profile.css';

const onlyLetters = value => /^[A-Za-z\s]*$/.test(value);
const onlyEmailChars = value => /^[A-Za-z0-9@.]*$/.test(value);
const onlyNumbers = value => /^[0-9]*$/.test(value);

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    uni_id: '',
    role: '',
    contact_no: '',
    faculty: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    setForm({
      full_name: u.full_name || '',
      email: u.email || '',
      uni_id: u.uni_id || '',
      role: u.role || '',
      contact_no: u.contact_no || '',
      faculty: u.faculty || ''
    });
  }, [navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'full_name' || name === 'faculty') {
      if (!onlyLetters(value)) return;
    }
    if (name === 'email') {
      if (!onlyEmailChars(value)) return;
    }
    if (name === 'contact_no') {
      if (!onlyNumbers(value) || value.length > 10) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (!editMode) return;
    setMsg('');
    setErr('');
    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Profile updated!');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setEditMode(false);
      } else {
        setErr(data.message || 'Update failed');
      }
    } catch {
      setErr('Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setMsg('');
    setErr('');
    try {
      const res = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        localStorage.removeItem('user');
        setMsg('Account deleted.');
        setTimeout(() => navigate('/register'), 1200);
      } else {
        const data = await res.json();
        setErr(data.message || 'Delete failed');
      }
    } catch {
      setErr('Delete failed');
    }
  };

  // Password change handlers
  const handlePwChange = e => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async e => {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPwErr('All password fields are required.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPwErr('New passwords do not match.');
      return;
    }
    
    try {
      // Fetch user to check current password
      const res = await fetch(`http://localhost:5000/users/${user._id}`);
      const data = await res.json();
      if (!res.ok || !data.user) {
        setPwErr('User not found.');
        return;
      }
      if (data.user.password !== passwords.current) {
        setPwErr('Current password is incorrect.');
        return;
      }
      // Update password
      const updateRes = await fetch(`http://localhost:5000/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, password: passwords.new })
      });
      const updateData = await updateRes.json();
      if (updateRes.ok) {
        setPwMsg('Password updated!');
        setUser(updateData.user);
        localStorage.setItem('user', JSON.stringify(updateData.user));
        setShowPasswordForm(false);
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setPwErr(updateData.message || 'Password update failed');
      }
    } catch {
      setPwErr('Password update failed');
    }
  };

  if (!user) return null;

  return (
    <div className="profile-bg">
      <Header />
      <div className="profile-container-wide">
        <h2 style={{ marginBottom: 24 }}>My Profile</h2>
        <form
          className="profile-form"
          onSubmit={handleUpdate}
          onKeyDown={e => {
            if (!editMode && e.key === 'Enter') e.preventDefault();
          }}
        >
          <label htmlFor="full_name">Full Name</label>
          <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} disabled={!editMode} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" value={form.email} onChange={handleChange} disabled={!editMode} required />

          <label htmlFor="uni_id">University ID</label>
          <input id="uni_id" name="uni_id" value={form.uni_id} onChange={handleChange} disabled={!editMode} required />

          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={form.role} onChange={handleChange} disabled>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>

          <label htmlFor="contact_no">Contact Number</label>
          <input
            id="contact_no"
            name="contact_no"
            value={form.contact_no}
            onChange={handleChange}
            disabled={!editMode}
            required
            maxLength={10}
            pattern="[0-9]{10}"
            title="Contact number must be exactly 10 digits"
          />

          <label htmlFor="faculty">Faculty</label>
          <input id="faculty" name="faculty" value={form.faculty} onChange={handleChange} disabled={!editMode} required />

          {/* Only show Save button in edit mode, inside the form */}
          {editMode && (
            <button type="submit">Save</button>
          )}
        </form>

        {/* Show Edit button outside the form when not in edit mode */}
        {!editMode && (
          <button
            type="button"
            className="profile-delete-btn"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        )}

        <button
          className="profile-delete-btn"
          onClick={handleDelete}
        >
          Delete Account
        </button>
        <button
          className="profile-delete-btn"
          style={{ background: '#f39c12', marginTop: 12 }}
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
        </button>
        {msg && <div className="profile-success">{msg}</div>}
        {err && <div className="profile-error">{err}</div>}

        {showPasswordForm && (
          <form className="profile-form" style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 18 }} onSubmit={handlePasswordUpdate}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="current"
              placeholder="Current Password"
              value={passwords.current}
              onChange={handlePwChange}
              required
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="new"
              placeholder="New Password"
              value={passwords.new}
              onChange={handlePwChange}
              required
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirm"
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={handlePwChange}
              required
            />
            <label style={{ fontSize: 14, marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={e => setShowPassword(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Show Passwords
            </label>
            <button type="submit" style={{ background: '#2980b9', color: '#fff' }}>Update Password</button>
            {pwMsg && <div className="profile-success">{pwMsg}</div>}
            {pwErr && <div className="profile-error">{pwErr}</div>}
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;