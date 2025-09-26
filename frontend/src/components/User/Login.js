import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    // Check for hardcoded admin credentials first
    if (
      form.email.trim().toLowerCase() === 'admin@gmail.com' &&
      form.password === 'Admin'
    ) {
      // Optionally, you can set a dummy admin user in localStorage
      localStorage.setItem('Admin', JSON.stringify({
        email: 'admin@gmail.com',
        role: 'admin',
        full_name: 'Admin'
      }));
      navigate('/admin');
      return;
    }
    // Otherwise, proceed with normal login
    try {
      const res = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="auth-bg">
      <Header />
      <div className="auth-container">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit">Login</button>
          {error && <div className="auth-error">{error}</div>}
        </form>
        <div className="auth-link">
          Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;