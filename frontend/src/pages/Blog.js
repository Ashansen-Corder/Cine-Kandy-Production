import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../apiClient';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/blog')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="blog-page">
      <motion.div 
        className="blog-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Events & News
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Stay updated with our latest projects and stories
        </motion.p>
      </motion.div>

      <div className="container section">
        <div data-scroll="blur-up" data-scroll-duration="slow">
          <h2 className="section-title">Latest Stories</h2>
          <p className="section-subtitle">Discover our recent events and behind-the-scenes moments</p>
        </div>
        <div className="zigzag-timeline-wrapper">
          <svg className="zigzag-wire" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="wireGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 50 0 L 50 10 Q 30 15 30 25 L 30 35 Q 40 40 50 45 L 50 55 Q 60 60 70 65 L 70 75 Q 50 80 50 90 L 50 100"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,3"
              filter="url(#wireGlow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="zigzag-timeline">
            {posts.map((post, i) => (
              <div 
                key={post._id} 
                className={`zigzag-item ${i % 2 === 0 ? 'left' : 'right'}`}
                data-scroll="split-up" 
                data-scroll-delay={i * 100}
              >
                <motion.div className="zigzag-card" whileHover={{ scale: 1.02, y: -5 }}>
                  <div className="blog-image" style={{ backgroundImage: `url(${post.image})` }} />
                  <div className="blog-content">
                    <span className="blog-category">{post.category}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <Link to={`/blog/${post._id}`} className="read-more">Read More →</Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
