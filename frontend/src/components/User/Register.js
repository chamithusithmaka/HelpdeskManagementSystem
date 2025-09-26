import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import './Auth.css';

const onlyLetters = value => /^[A-Za-z\s]*$/.test(value);
const onlyEmailChars = value => /^[A-Za-z0-9@.]*$/.test(value);
const onlyNumbers = value => /^[0-9]*$/.test(value);

const Register = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    uni_id: '',
    password: '',
    role: 'student',
    contact_no: '',
    faculty: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! You can now login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="auth-bg">
      <Header />
      <div className="auth-container">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="full_name">Full Name</label>
          <input id="full_name" name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />

          <label htmlFor="uni_id">University ID</label>
          <input id="uni_id" name="uni_id" placeholder="University ID" value={form.uni_id} onChange={handleChange} required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>

          <label htmlFor="contact_no">Contact Number</label>
          <input
            id="contact_no"
            name="contact_no"
            placeholder="Contact Number"
            value={form.contact_no}
            onChange={handleChange}
            required
            maxLength={10}
            pattern="[0-9]{10}"
            title="Contact number must be exactly 10 digits"
          />

          <label htmlFor="faculty">Faculty</label>
          <input id="faculty" name="faculty" placeholder="Faculty" value={form.faculty} onChange={handleChange} required />

          <button type="submit">Register</button>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
        </form>
        <div className="auth-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;