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
