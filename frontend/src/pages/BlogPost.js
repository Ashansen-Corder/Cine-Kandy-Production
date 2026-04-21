import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../apiClient';
import './Blog.css';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/blog/${id}`)
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
