import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, FileText, Mail, LogOut, Plus, Trash2, Edit, LayoutDashboard, Settings, Film, Play, CalendarDays } from 'lucide-react';
import { authApi } from '../../apiClient';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [galleryItems, setGalleryItems] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState('image'); // 'image' or 'video'
  const [editingId, setEditingId] = useState(null); // Track which item is being edited
  const [editingEventId, setEditingEventId] = useState(null);

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    category: 'Weddings',
    type: 'Image',
    image: '',
    vimeoUrl: '',
    videoUrl: '',
    poster: ''
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: ''
  });
  
  const navigate = useNavigate();
  const api = authApi(localStorage.getItem('adminToken'));

  // Load all data
  const loadData = useCallback(async () => {
    try {
      // Load stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.data || statsRes.data);

      // Load appropriate tab data
      if (activeTab === 'gallery') {
        const galleryRes = await api.get('/gallery');
        setGalleryItems(galleryRes.data.data || galleryRes.data);
      } else if (activeTab === 'blogs') {
        const blogsRes = await api.get('/blog');
        setBlogs(blogsRes.data);
      } else if (activeTab === 'contacts') {
        const contactsRes = await api.get('/contact');
        setContacts(contactsRes.data);
      } else if (activeTab === 'events') {
        const eventsRes = await api.get('/events');
        setEvents(eventsRes.data.data || eventsRes.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('Auth failed, logging out...');
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
      console.error('Error loading data:', error.response?.data || error.message);
    }
  }, [activeTab, api, navigate]);

  useEffect(() => {
    loadData();
  }, [activeTab, loadData]);

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

  // Open edit modal with item data
  const openEditModal = (item) => {
    setEditingId(item._id);
    setModalType(item.type === 'Video' ? 'video' : 'image');
    setGalleryForm({
      title: item.title,
      description: item.description || '',
      category: item.category,
      type: item.type,
      image: item.image || '',
      vimeoUrl: item.vimeoUrl || '',
      videoUrl: item.videoUrl || '',
      poster: item.poster || ''
    });
    setShowModal(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setGalleryForm({
      title: '',
      description: '',
      category: 'Weddings',
      type: 'Image',
      image: '',
      vimeoUrl: '',
      videoUrl: '',
      poster: ''
    });
  };

  // Open event modal for edit
  const openEditEventModal = (event) => {
    setEditingEventId(event._id);
    setEventForm({
      title: event.title,
      description: event.description || '',
      date: event.date ? event.date.slice(0, 10) : '',
      location: event.location || '',
      image: event.image || ''
    });
    setShowEventModal(true);
  };

  // Close event modal
  const closeEventModal = () => {
    setShowEventModal(false);
    setEditingEventId(null);
    setEventForm({ title: '', description: '', date: '', location: '', image: '' });
  };

  // Handle event form submit
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) {
      alert('Please fill in title and date');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        location: eventForm.location,
        image: eventForm.image
      };
      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, payload);
        alert('Event updated successfully!');
      } else {
        await api.post('/events', payload);
        alert('Event added successfully!');
      }
      closeEventModal();
      loadData();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission for gallery items (both image and video)
  const handleGallerySubmit = async (e) => {
    e.preventDefault();

    if (!galleryForm.title || !galleryForm.category) {
      alert('Please fill in title and category');
      return;
    }

    // Validate type-specific fields
    if (modalType === 'image' && !galleryForm.image) {
      alert('Please provide an image URL');
      return;
    }

    if (modalType === 'video' && !galleryForm.vimeoUrl && !galleryForm.videoUrl) {
      alert('Please provide a Vimeo URL or direct video URL');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: galleryForm.title,
        description: galleryForm.description,
        category: galleryForm.category,
        type: modalType === 'image' ? 'Image' : 'Video',
        featured: false
      };

      if (modalType === 'image') {
        payload.image = galleryForm.image;
      } else {
        payload.vimeoUrl = galleryForm.vimeoUrl;
        payload.videoUrl = galleryForm.videoUrl;
        payload.poster = galleryForm.poster;
      }

      if (editingId) {
        // Update existing item
        await api.put(`/gallery/${editingId}`, payload);
        alert(`${modalType === 'image' ? 'Image' : 'Video'} updated successfully!`);
      } else {
        // Create new item
        await api.post('/gallery', payload);
        alert(`${modalType === 'image' ? 'Image' : 'Video'} added successfully!`);
      }
      
      closeModal();
      loadData();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-dashboard-premium">
      <div className="admin-sidebar-premium">
        <div className="sidebar-header">
          <h2>CINE KANDY</h2>
          <p>Admin Control</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            onClick={() => setActiveTab('stats')} 
            className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          >
            <LayoutDashboard size={22} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('gallery')} 
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          >
            <Image size={22} />
            <span>Gallery</span>
          </button>
          <button 
            onClick={() => setActiveTab('blogs')} 
            className={`nav-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          >
            <FileText size={22} />
            <span>Blog Posts</span>
          </button>
          <button 
            onClick={() => setActiveTab('contacts')} 
            className={`nav-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          >
            <Mail size={22} />
            <span>Inquiries</span>
          </button>
          <button 
            onClick={() => setActiveTab('events')} 
            className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
          >
            <CalendarDays size={22} />
            <span>Events</span>
          </button>
          <button className="nav-btn">
            <Settings size={22} />
            <span>Settings</span>
          </button>
        </nav>

        <button onClick={handleLogout} className="logout-btn-premium">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <div className="admin-content-premium">
        {activeTab === 'stats' && (
          <div className="dashboard-premium">
            <div className="dashboard-header">
              <h1>Dashboard Overview</h1>
              <p>Welcome back to your admin control center</p>
            </div>

            <div className="stats-grid-premium">
              <div className="glass-card stat-card-premium">
                <div className="stat-icon projects">📊</div>
                <div className="stat-content">
                  <h3>{stats.gallery || 0}</h3>
                  <p>Total Projects</p>
                </div>
              </div>

              <div className="glass-card stat-card-premium">
                <div className="stat-icon videos">🎬</div>
                <div className="stat-content">
                  <h3>{stats.videos || 0}</h3>
                  <p>Total Videos</p>
                </div>
              </div>

              <div className="glass-card stat-card-premium">
                <div className="stat-icon inquiries">📧</div>
                <div className="stat-content">
                  <h3>{stats.newContacts || 0}</h3>
                  <p>New Inquiries</p>
                </div>
              </div>

              <div className="glass-card stat-card-premium">
                <div className="stat-icon views">👁️</div>
                <div className="stat-content">
                  <h3>{stats.blogs || 0}</h3>
                  <p>Total Views</p>
                </div>
              </div>

              <div className="glass-card stat-card-premium">
                <div className="stat-icon contacts">📞</div>
                <div className="stat-content">
                  <h3>{stats.totalContacts || 0}</h3>
                  <p>Total Contacts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className="dashboard-header">
              <h1>Gallery Management</h1>
              <p>Upload and manage your portfolio (images and videos)</p>
            </div>

            {/* ===== MODAL FOR ADD GALLERY ITEM ===== */}
            {showModal && (
              <div className="modal-overlay-gallery" onClick={closeModal}>
                <div className="modal-content-gallery" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-gallery">
                    <h2>{editingId ? 'Edit' : 'Add New'} {modalType === 'video' ? 'Video' : 'Image'}</h2>
                    <button 
                      className="modal-close-btn"
                      onClick={closeModal}
                    >
                      ✕
                    </button>
                  </div>

                  <form className="gallery-form" onSubmit={handleGallerySubmit}>
                    <div className="form-group-gallery">
                      <label htmlFor="title">Title *</label>
                      <input
                        id="title"
                        type="text"
                        placeholder="Enter project title"
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group-gallery">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        placeholder="Project description..."
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                        rows="3"
                      />
                    </div>

                    <div className="form-group-gallery">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})}
                        required
                      >
                        <option value="Weddings">Weddings</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Events">Events</option>
                      </select>
                    </div>

                    {modalType === 'image' ? (
                      <div className="form-group-gallery">
                        <label htmlFor="imageUrl">Image URL *</label>
                        <input
                          id="imageUrl"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={galleryForm.image}
                          onChange={(e) => setGalleryForm({...galleryForm, image: e.target.value})}
                          required
                        />
                      </div>
                    ) : (
                      <div className="form-group-gallery">
                        <label htmlFor="vimeoUrl">Vimeo URL</label>
                        <input
                          id="vimeoUrl"
                          type="url"
                          placeholder="https://vimeo.com/123456789"
                          value={galleryForm.vimeoUrl}
                          onChange={(e) => setGalleryForm({...galleryForm, vimeoUrl: e.target.value})}
                        />
                        <label htmlFor="videoUrl">Direct MP4/WebM URL</label>
                        <input
                          id="videoUrl"
                          type="url"
                          placeholder="https://cdn.example.com/video.mp4"
                          value={galleryForm.videoUrl}
                          onChange={(e) => setGalleryForm({...galleryForm, videoUrl: e.target.value})}
                        />
                        <label htmlFor="posterUrl">Poster / thumbnail URL</label>
                        <input
                          id="posterUrl"
                          type="url"
                          placeholder="https://cdn.example.com/video-poster.jpg"
                          value={galleryForm.poster}
                          onChange={(e) => setGalleryForm({...galleryForm, poster: e.target.value})}
                        />
                      </div>
                    )}

                    <div className="modal-actions-gallery">
                      <button 
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : editingId ? 'Update Item' : 'Save Item'}
                      </button>
                      <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* ===== END MODAL ===== */}
            
            {galleryItems.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>No gallery items yet. Start by adding your first project.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setModalType('image');
                      setShowModal(true);
                    }}
                  >
                    <Plus size={20} /> Add Image
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setModalType('video');
                      setShowModal(true);
                    }}
                  >
                    <Film size={20} /> Add Video
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '2rem', textAlign: 'right', display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setModalType('image');
                      setShowModal(true);
                    }}
                  >
                    <Plus size={20} /> Add Image
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setModalType('video');
                      setShowModal(true);
                    }}
                  >
                    <Film size={20} /> Add Video
                  </button>
                </div>

                {/* Unified Gallery Grid - Both Images and Videos */}
                <div className="admin-grid">
                  {galleryItems.map(item => (
                    <div key={item._id} className="admin-card">
                      {item.type === 'Image' ? (
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                      ) : (
                        <div className="video-thumbnail-preview" style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={32} />
                        </div>
                      )}
                      <div className="admin-card-content">
                        <h3>{item.title}</h3>
                        <p>{item.category}</p>
                        <small style={{ color: '#C9A050' }}>{item.type}</small>
                      </div>
                      <div className="card-actions">
                        <button className="edit-btn" onClick={() => openEditModal(item)}><Edit size={18} /></button>
                        <button className="delete-btn" onClick={() => deleteItem('gallery', item._id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <div className="dashboard-header">
              <h1>Blog Posts</h1>
              <p>Create and manage your blog content</p>
            </div>
            {blogs.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>No blog posts yet. Start creating engaging content.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }}><Plus size={20} /> Create New Post</button>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div className="dashboard-header">
              <h1>Client Inquiries</h1>
              <p>Manage incoming contact messages and requests</p>
            </div>
            {contacts.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>No inquiries yet. Your contact messages will appear here.</p>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="dashboard-header">
              <h1>Events</h1>
              <p>Manage your upcoming and past events</p>
            </div>

            {/* ===== EVENT MODAL ===== */}
            {showEventModal && (
              <div className="modal-overlay-gallery" onClick={closeEventModal}>
                <div className="modal-content-gallery" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-gallery">
                    <h2>{editingEventId ? 'Edit Event' : 'Add New Event'}</h2>
                    <button className="modal-close-btn" onClick={closeEventModal}>✕</button>
                  </div>
                  <form className="gallery-form" onSubmit={handleEventSubmit}>
                    <div className="form-group-gallery">
                      <label>Title *</label>
                      <input
                        type="text"
                        placeholder="Event title"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group-gallery">
                      <label>Description</label>
                      <textarea
                        placeholder="Event description..."
                        value={eventForm.description}
                        onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                        rows="3"
                      />
                    </div>
                    <div className="form-group-gallery">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group-gallery">
                      <label>Location</label>
                      <input
                        type="text"
                        placeholder="Event location"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      />
                    </div>
                    <div className="form-group-gallery">
                      <label>Cover Image URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={eventForm.image}
                        onChange={(e) => setEventForm({...eventForm, image: e.target.value})}
                      />
                    </div>
                    <div className="modal-actions-gallery">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : editingEventId ? 'Update Event' : 'Save Event'}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={closeEventModal}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* ===== END EVENT MODAL ===== */}

            {events.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>No events yet. Start by adding your first event.</p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setShowEventModal(true)}
                >
                  <Plus size={20} /> Add Event
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
                  <button className="btn btn-primary" onClick={() => setShowEventModal(true)}>
                    <Plus size={20} /> Add Event
                  </button>
                </div>
                <div className="events-grid">
                  {events.map(event => (
                    <div key={event._id} className="event-card">
                      {event.image && (
                        <img src={event.image} alt={event.title} className="event-card-img" />
                      )}
                      {!event.image && (
                        <div className="event-card-img-placeholder">
                          <CalendarDays size={40} color="#C9A050" />
                        </div>
                      )}
                      <div className="event-card-body">
                        <h3>{event.title}</h3>
                        {event.date && (
                          <p className="event-date">📅 {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        )}
                        {event.location && (
                          <p className="event-location">📍 {event.location}</p>
                        )}
                        {event.description && (
                          <p className="event-desc">{event.description}</p>
                        )}
                      </div>
                      <div className="card-actions">
                        <button className="edit-btn" onClick={() => openEditEventModal(event)}><Edit size={18} /></button>
                        <button className="delete-btn" onClick={() => deleteItem('events', event._id)}><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default AdminDashboard;
