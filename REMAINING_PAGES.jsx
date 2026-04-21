// ==================== Contact.js ====================
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
              <p>0752026577</p>
            </div>
            <div className="contact-info-card">
              <Mail className="info-icon" />
              <h3>Email</h3>
              <p>kaizersen570@gmail.com</p>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

// ==================== About.js ====================
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Camera, Heart } from 'lucide-react';
import './About.css';

const About = () => {
  const team = [
    {
      name: 'Saman Perera',
      role: 'Lead Photographer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
    },
    {
      name: 'Nimal Silva',
      role: 'Videographer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
    },
    {
      name: 'Kasun Fernando',
      role: 'Editor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
    }
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Capturing life's beautiful moments since 2016</p>
      </div>

      <div className="container section">
        <div className="about-content">
          <h2 className="section-title">Our Story</h2>
          <p className="about-text">
            Cine Kandy Films was founded with a passion for capturing life's most precious moments.
            Based in the beautiful city of Kandy, Sri Lanka, we specialize in wedding photography,
            event coverage, and cinematic videography.
          </p>

          <div className="values-grid">
            {[
              { icon: <Camera />, title: 'Quality', desc: 'Premium equipment and techniques' },
              { icon: <Heart />, title: 'Passion', desc: 'We love what we do' },
              { icon: <Users />, title: 'Experience', desc: '8+ years in the industry' },
              { icon: <Award />, title: 'Excellence', desc: 'Award-winning work' }
            ].map((value, i) => (
              <motion.div key={i} className="value-card" whileHover={{ y: -10 }}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, i) => (
              <motion.div key={i} className="team-card" whileHover={{ scale: 1.05 }}>
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

// ==================== Blog.js ====================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/blog')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <h1>Events & News</h1>
        <p>Stay updated with our latest projects and stories</p>
      </div>

      <div className="container section">
        <div className="blog-grid">
          {posts.map((post, i) => (
            <motion.div key={post._id} className="blog-card" whileHover={{ y: -10 }}>
              <div className="blog-image" style={{ backgroundImage: `url(${post.image})` }} />
              <div className="blog-content">
                <span className="blog-category">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post._id}`} className="read-more">Read More →</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

// ==================== BlogPost.js ====================
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Blog.css';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blog/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!post) return <div className="loading">Loading...</div>;

  return (
    <div className="blog-post-page">
      <div className="post-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="post-hero-content">
          <h1>{post.title}</h1>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="container section">
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default BlogPost;
