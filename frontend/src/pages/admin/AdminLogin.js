import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { api } from '../../apiClient';
import './Admin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!credentials.username || !credentials.password) {
        setError('Please enter username and password');
        return;
      }
      const response = await api.post('/admin/login', credentials);
      if (response.data.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin/dashboard');
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('Login error:', err);
      
      // More specific error messages
      if (err.code === 'ECONNREFUSED' || err.message === 'Network Error' || !err.response) {
        setError('Cannot connect to server. Is the backend running on port 5000?');
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || 'Invalid request');
      } else {
        setError(errorMsg || 'Invalid credentials. Try username: admin, password: admin123');
      }
    }
  };

  return (
    <div className="admin-login-page">
      <motion.div 
        className="login-card" 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Admin Login</h1>
        <p className="login-subtitle">Cine Kandy Films</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <User size={20} />
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
