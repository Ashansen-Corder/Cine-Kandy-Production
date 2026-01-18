import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get In Touch</h1>
        <p>Let's create something amazing together</p>
      </div>
      
      <div className="container section">
        <div className="contact-grid">
          <motion.div className="contact-info-section">
            <h2>Contact Information</h2>
            <div className="contact-info-card">
              <Phone className="info-icon" />
              <h3>Phone</h3>
              <p>+94 77 123 4567</p>
            </div>
            <div className="contact-info-card">
              <Mail className="info-icon" />
              <h3>Email</h3>
              <p>info@cinekandyfilms.com</p>
            </div>
            <div className="contact-info-card">
              <MapPin className="info-icon" />
              <h3>Location</h3>
              <p>Kandy, Sri Lanka</p>
            </div>
          </motion.div>

          <motion.form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send Us a Message</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <textarea
              placeholder="Your Message"
              rows="6"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
            <button type="submit" className="btn btn-primary">
              <Send size={20} /> Send Message
            </button>
            {status === 'success' && <p className="success-msg">Message sent successfully!</p>}
            {status === 'error' && <p className="error-msg">Failed to send message. Try again.</p>}
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
