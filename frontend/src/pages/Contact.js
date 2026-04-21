import React, { useState } from 'react';
import { Send, Linkedin, Twitter } from 'lucide-react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    spouseName: '',
    phone: '',
    instagram: '',
    inquiryType: '',
    weddingDate: '',
    weddingLocation: '',
    budget: '',
    attracted: '',
    additionalInfo: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post('http://localhost:5000/api/contact', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `
Spouse Name: ${formData.spouseName}
Instagram: ${formData.instagram}
Inquiry Type: ${formData.inquiryType}
Wedding Date: ${formData.weddingDate}
Wedding Location: ${formData.weddingLocation}
Budget: ${formData.budget}
What Attracted You: ${formData.attracted}
Additional Info: ${formData.additionalInfo}
        `
      });
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        spouseName: '',
        phone: '',
        instagram: '',
        inquiryType: '',
        weddingDate: '',
        weddingLocation: '',
        budget: '',
        attracted: '',
        additionalInfo: ''
      });
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      setStatus('error');
      console.error('Contact form error:', error);
    }
  };

  return (
    <div className="contact-page">
      {/* Header Section */}
      <div className="contact-header">
        <h1 className="contact-main-heading">Let's connect together</h1>
        <p className="contact-sub-heading">Tell us your story and let's capture your most beautiful moments.</p>
      </div>

      {/* Form Section */}
      <div className="contact-container">
        <form className="inquiry-form" onSubmit={handleSubmit}>
          {/* Your Name */}
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Josh Rexford"
              required
            />
          </div>

          {/* Your Email */}
          <div className="form-group">
            <label htmlFor="email">Your Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@joshrexford.com"
              required
            />
          </div>

          {/* Spouse Name */}
          <div className="form-group">
            <label htmlFor="spouseName">What's your future spouse's name?</label>
            <input
              id="spouseName"
              type="text"
              name="spouseName"
              value={formData.spouseName}
              onChange={handleChange}
              placeholder="Kendyll Rexford"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone number (in case my response goes to your spam)</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="E.g. 541 444 0755"
            />
          </div>

          {/* Instagram */}
          <div className="form-group">
            <label htmlFor="instagram">Drop your Instagram handles so we can connect!</label>
            <input
              id="instagram"
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@joshrexford.com"
            />
          </div>

          {/* Inquiry Type */}
          <div className="form-group">
            <label htmlFor="inquiryType">What are you inquiring about specifically?</label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="wedding">Wedding Photography</option>
              <option value="engagement">Engagement Session</option>
              <option value="bridal">Bridal Photography</option>
              <option value="videography">Videography</option>
              <option value="dronography">Dronography</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Wedding Date */}
          <div className="form-group">
            <label htmlFor="weddingDate">Wedding Date</label>
            <input
              id="weddingDate"
              type="date"
              name="weddingDate"
              value={formData.weddingDate}
              onChange={handleChange}
            />
          </div>

          {/* Wedding Location */}
          <div className="form-group">
            <label htmlFor="weddingLocation">Wedding Location</label>
            <input
              id="weddingLocation"
              type="text"
              name="weddingLocation"
              value={formData.weddingLocation}
              onChange={handleChange}
              placeholder="Halfway around the world...or right here in Michigan?"
            />
          </div>

          {/* Budget */}
          <div className="form-group">
            <label htmlFor="budget">Approximate budget</label>
            <input
              id="budget"
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. $3,000 - $5,000"
            />
          </div>

          {/* What Attracted You */}
          <div className="form-group">
            <label htmlFor="attracted">What attracted you to my work?</label>
            <input
              id="attracted"
              type="text"
              name="attracted"
              value={formData.attracted}
              onChange={handleChange}
              placeholder="Tell us what you love about our style"
            />
          </div>

          {/* Additional Info */}
          <div className="form-group full-width">
            <label htmlFor="additionalInfo">Anything else you'd like to share? *</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Tell me your whole story or share fun wedding details – I'm all ears!"
              rows="5"
              required
            />
          </div>

          {/* Messages */}
          {status === 'success' && (
            <div className="success-msg">
              Message sent successfully! We will get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className="error-msg">
              Failed to send message. Please try again.
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={status === 'sending'}>
            <Send size={18} />
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* Meet Our Team Section */}
      <div className="meet-team-section">
        <h2 className="team-title">Meet Our Team</h2>
        <p className="team-subtitle">Passionate professionals dedicated to capturing your story</p>
        
        <div className="team-grid">
          {/* Team Member 1 */}
          <div className="team-member">
            <div className="team-member-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                alt="Saman Perera - Lead Photographer"
                className="team-member-image"
              />
            </div>
            <h3 className="team-member-name">Saman Perera</h3>
            <p className="team-member-role">Lead Photographer</p>
            <p className="team-member-tagline">"Every moment tells a story worth preserving forever"</p>
            <div className="team-social-icons">
              <a href="#" className="social-icon linkedin" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-icon twitter" title="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="team-member">
            <div className="team-member-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
                alt="Nimal Silva - Videographer"
                className="team-member-image"
              />
            </div>
            <h3 className="team-member-name">Nimal Silva</h3>
            <p className="team-member-role">Videographer</p>
            <p className="team-member-tagline">"Motion is the poetry of your life's most beautiful chapters"</p>
            <div className="team-social-icons">
              <a href="#" className="social-icon linkedin" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-icon twitter" title="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="team-member">
            <div className="team-member-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                alt="Kasun Fernando - Creative Director"
                className="team-member-image"
              />
            </div>
            <h3 className="team-member-name">Kasun Fernando</h3>
            <p className="team-member-role">Creative Director</p>
            <p className="team-member-tagline">"Artistry meets precision in every frame we create"</p>
            <div className="team-social-icons">
              <a href="#" className="social-icon linkedin" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-icon twitter" title="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
