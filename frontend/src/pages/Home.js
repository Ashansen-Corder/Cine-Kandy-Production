import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Film, Award, Heart, Star, ArrowRight, Play } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Camera size={48} />,
      title: 'Photography',
      description: 'Capturing timeless moments with artistic vision and technical excellence'
    },
    {
      icon: <Film size={48} />,
      title: 'Videography',
      description: 'Creating cinematic stories that move hearts and inspire minds'
    },
    {
      icon: <Award size={48} />,
      title: 'Award Winning',
      description: 'Recognized excellence in visual storytelling across Sri Lanka'
    },
    {
      icon: <Heart size={48} />,
      title: 'Passion Driven',
      description: 'Every project is crafted with dedication and creative passion'
    }
  ];

  const stats = [
    { number: '500+', label: 'Events Covered' },
    { number: '10K+', label: 'Photos Captured' },
    { number: '8+', label: 'Years Experience' },
    { number: '100%', label: 'Client Satisfaction' }
  ];

  const recentWork = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      title: 'Royal Wedding',
      category: 'Wedding'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      title: 'Corporate Gala',
      category: 'Corporate'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
      title: 'Cultural Festival',
      category: 'Event'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&q=80',
      title: 'Pre-Wedding Shoot',
      category: 'Pre-Wedding'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slider">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1.5 }}
            />
          ))}
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hero-text"
          >
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Capturing Your
              <span className="gradient-text"> Precious Moments</span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Professional Photography & Videography Services in Kandy, Sri Lanka
            </motion.p>
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <Link to="/gallery" className="btn btn-primary">
                View Gallery <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="btn">
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="slider-dots">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Why Choose Us
            </motion.h2>
            <motion.p className="section-subtitle" variants={itemVariants}>
              We bring stories to life through our lens
            </motion.p>

            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: '0 20px 60px rgba(201, 160, 80, 0.3)'
                  }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Work Section */}
      <section className="section recent-work-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">Recent Work</h2>
            <p className="section-subtitle">
              Explore our latest photography and videography projects
            </p>

            <div className="work-grid">
              {recentWork.map((work, index) => (
                <motion.div
                  key={work.id}
                  className="work-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="work-image" style={{ backgroundImage: `url(${work.image})` }}>
                    <div className="work-overlay">
                      <span className="work-category">{work.category}</span>
                      <Play className="play-icon" size={48} />
                    </div>
                  </div>
                  <div className="work-info">
                    <h3>{work.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="work-cta"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/gallery" className="btn btn-primary">
                View Full Gallery <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ready to Create Something Amazing?</h2>
          <p>Let's capture your special moments together</p>
          <Link to="/contact" className="btn btn-primary">
            Get In Touch <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
