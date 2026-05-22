import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Camera, Heart, Mail, Phone, MapPin } from 'lucide-react';
import buddika from '../assets/buddika.jpg';
import './About.css';

const About = () => {
  const values = [
    { icon: <Camera />, title: 'Quality', desc: 'Premium equipment and techniques' },
    { icon: <Heart />, title: 'Passion', desc: 'We love what we do' },
    { icon: <Users />, title: 'Experience', desc: '4+ years in the industry' },
    { icon: <Award />, title: 'Excellence', desc: 'Award-winning work' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <motion.div 
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="about-hero-title"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          About Cine Kandy
        </motion.h1>
        <motion.p
          className="about-hero-subtitle"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Luxury storytelling through premium cinematography
        </motion.p>
      </motion.div>

      {/* Marquee Section */}
      <section className="marquee-section">
        <div className="marquee-track">
          <span className="marquee-item">• Premium Cinematography</span>
          <span className="marquee-item">• Award-Winning Experts</span>
          <span className="marquee-item">• 4+ Years Excellence</span>
          <span className="marquee-item">• Luxury Production</span>
          <span className="marquee-item">• Premium Cinematography</span>
          <span className="marquee-item">• Award-Winning Experts</span>
          <span className="marquee-item">• 4+ Years Excellence</span>
          <span className="marquee-item">• Luxury Production</span>
        </div>
      </section>

      <div className="container about-content">
        {/* Our Story Section */}
        <motion.div 
          className="story-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="about-section-title">Our Story</h2>
          <p className="about-text">
            Cine Kandy Films represents the pinnacle of cinematic excellence in South Asia. 
            Founded with an unwavering commitment to capturing life's most precious moments, 
            we combine technical mastery with artistic vision. Our team brings together over 
            15 years of collective experience in wedding cinematography, event coverage, and 
            high-end visual production. Based in the cultural heart of Kandy, Sri Lanka, we 
            serve discerning clients who demand nothing but the very best.
          </p>
        </motion.div>

        {/* Values Section */}
        <motion.div 
          className="values-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="about-section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-desc">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Founder Section */}
        <motion.div 
          className="founder-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="about-section-title">The Visionary Behind Cine Kandy</h2>
          
          <motion.div 
            className="founder-card-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="founder-card-luxury" 
              whileHover={{ y: -16, transition: { duration: 0.3 } }}
            >
              <div className="founder-image-container">
                <img 
                  src={buddika}
                  alt="Buddika Senanayaka" 
                  className="founder-image"
                />
              </div>
              <div className="founder-card-content">
                <h3 className="founder-name">Buddika Senanayaka</h3>
                <p className="founder-title">Founder & Lead Storyteller</p>
                <p className="founder-biography">
                  A visionary artist with an unwavering passion for transforming precious moments into timeless visual narratives. 
                  With over 15 years of experience in cinematic production, Buddika founded Cine Kandy with the belief that every 
                  story deserves to be told with elegance, authenticity, and technical mastery. His artistic vision has shaped 
                  the company's commitment to luxury filmmaking and exceptional quality in every frame.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Contact Info Section (Form Removed) */}
        <motion.div 
          className="contact-cta-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="about-section-title">Get In Touch</h2>
          <p className="cta-subtitle">Connect with our team to discuss your vision</p>
          <div className="contact-grid">
            <motion.a 
              href="mailto:info@cinekandy.com"
              className="contact-card"
              whileHover={{ y: -8 }}
            >
              <Mail className="contact-icon" />
              <h3>Email</h3>
              <p>info@cinekandy.com</p>
            </motion.a>
            <motion.a 
              href="tel:+94701234567"
              className="contact-card"
              whileHover={{ y: -8 }}
            >
              <Phone className="contact-icon" />
              <h3>Phone</h3>
              <p>+94 70 123 4567</p>
            </motion.a>
            <motion.div 
              className="contact-card"
              whileHover={{ y: -8 }}
            >
              <MapPin className="contact-icon" />
              <h3>Location</h3>
              <p>Kandy, Sri Lanka</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;