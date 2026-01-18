import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, FileText, Mail, LogOut, Plus, Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [gallery, setGallery] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      if (activeTab === 'gallery') {
        const galleryRes = await api.get('/gallery');
        setGallery(galleryRes.data);
      } else if (activeTab === 'blogs') {
        const blogsRes = await api.get('/blog');
        setBlogs(blogsRes.data);
      } else if (activeTab === 'contacts') {
        const contactsRes = await api.get('/contact');
        setContacts(contactsRes.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/admin');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const deleteItem = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/${type}/${id}`);
        loadData();
      } catch (error) {
        alert('Error deleting item');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Cine Kandy Admin</h2>
        <nav>
          <button 
            onClick={() => setActiveTab('stats')} 
            className={activeTab === 'stats' ? 'active' : ''}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('gallery')} 
            className={activeTab === 'gallery' ? 'active' : ''}
          >
            <Image size={20} /> Gallery
          </button>
          <button 
            onClick={() => setActiveTab('blogs')} 
            className={activeTab === 'blogs' ? 'active' : ''}
          >
            <FileText size={20} /> Blog Posts
          </button>
          <button 
            onClick={() => setActiveTab('contacts')} 
            className={activeTab === 'contacts' ? 'active' : ''}
          >
            <Mail size={20} /> Contacts
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && (
          <div className="stats-dashboard">
            <h1>Dashboard Overview</h1>
            <div className="stats-cards">
              <div className="stat-card">
                <h3>{stats.gallery || 0}</h3>
                <p>Gallery Items</p>
              </div>
              <div className="stat-card">
                <h3>{stats.blogs || 0}</h3>
                <p>Blog Posts</p>
              </div>
              <div className="stat-card">
                <h3>{stats.newContacts || 0}</h3>
                <p>New Contacts</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalContacts || 0}</h3>
                <p>Total Contacts</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className="admin-header">
              <h1>Gallery Management</h1>
              <button className="btn btn-primary"><Plus size={20} /> Add Item</button>
            </div>
            <div className="admin-grid">
              {gallery.map(item => (
                <div key={item._id} className="admin-card">
                  <img src={item.image} alt={item.title} />
                  <div className="admin-card-content">
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                  </div>
                  <div className="card-actions">
                    <button className="edit-btn"><Edit size={18} /></button>
                    <button className="delete-btn" onClick={() => deleteItem('gallery', item._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <div className="admin-header">
              <h1>Blog Posts</h1>
              <button className="btn btn-primary"><Plus size={20} /> New Post</button>
            </div>
            <div className="blog-list">
              {blogs.map(post => (
                <div key={post._id} className="blog-item">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="blog-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                  <div className="card-actions">
                    <button className="edit-btn"><Edit size={18} /></button>
                    <button className="delete-btn" onClick={() => deleteItem('blog', post._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h1>Contact Messages</h1>
            <div className="contacts-list">
              {contacts.map(contact => (
                <div key={contact._id} className="contact-item">
                  <h3>{contact.name}</h3>
                  <p><strong>Email:</strong> {contact.email} | <strong>Phone:</strong> {contact.phone}</p>
                  <p className="contact-message">{contact.message}</p>
                  <span className={`status ${contact.status}`}>{contact.status}</span>
                  <button className="delete-btn" onClick={() => deleteItem('contact', contact._id)}>
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
