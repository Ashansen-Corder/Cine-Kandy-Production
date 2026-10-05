
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Home.css';
import studioImage from '../assets/studio-shoot.jpg';
import professionalEquipmentImage from '../assets/professional-equipment.jpg';
import experiencedTeamImage from '../assets/experienced-team.jpg';
import artboard1Icon from '../assets/Artboard-1-alt@4x.png';
import artboard2Icon from '../assets/Artboard-2@4x.png';
import bgVideo from '../assets/HB.mp4';


const Home = () => {
  const [shouldLoadHeroVideo, setShouldLoadHeroVideo] = useState(true);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection?.saveData ||
      ['slow-2g', '2g'].includes(connection?.effectiveType);
    const isLowMemoryDevice = navigator.deviceMemory && navigator.deviceMemory <= 2;

    // Keep the poster-only experience for constrained mobile devices.
    setShouldLoadHeroVideo(!isSlowConnection && !isLowMemoryDevice);
  }, []);

  const features = [
    {
      icon: (
        <img
          src={artboard1Icon}
          alt="Photography"
          className="feature-icon-image"
          loading="lazy"
        />
      ),
      title: 'Photography',
      description: 'Capturing timeless moments with artistic vision and technical excellence'
    },
    {
      icon: (
        <img
          src={artboard1Icon}
          alt="Videography"
          className="feature-icon-image"
          loading="lazy"
        />
      ),
      title: 'Videography',
      description: 'Creating cinematic stories that move hearts and inspire minds'
    },
    {
      icon: (
        <img
          src={artboard2Icon}
          alt="Dronography"
          className="feature-icon-image"
          loading="lazy"
        />
      ),
      title: 'Dronography',
      description: 'Aerial coverage with licensed pilots delivering sweeping cinematic perspectives'
    },
  ];

  const stats = [
    { number: '500+', label: 'Events Covered' },
    { number: '10K+', label: 'Photos Captured' },
    { number: '8+', label: 'Years Experience' },
    { number: '100%', label: 'Client Satisfaction' }
  ];

  // eslint-disable-next-line no-unused-vars
  const services = [

    {
      id: 1,
      title: 'Photography Services',
      subtitle: 'Professional Photo Sessions',
      description: 'Capturing timeless moments with artistic vision and technical excellence. From weddings to corporate events, we deliver stunning visual narratives.',
      icon: (
        <img
          src="/service-camera.svg"
          alt="Photography Services"
          className="service-icon-image"
          loading="lazy"
        />
      )
    },
    {
      id: 2,
      title: 'Videography Services',
      subtitle: 'Cinematic Video Production',
      description: 'Creating compelling video content that tells your story. Our team produces high-quality videos for events, commercials, and corporate communications.',
      icon: (
        <img
          src="/service-film.svg"
          alt="Videography Services"
          className="service-icon-image"
          loading="lazy"
        />
      )
    },
    {
      id: 3,
      title: 'Post Production',
      subtitle: 'Editing & Color Grading',
      description: 'Professional editing, color grading, and post-production services. We transform raw footage into polished, engaging final products.',
      icon: (
        <img
          src="/service-post.svg"
          alt="Post Production"
          className="service-icon-image"
          loading="lazy"
        />
      )
    },
    {
      id: 4,
      title: 'Dronography',
      subtitle: 'Aerial Drone Filming',
      description: 'Licensed pilots capturing sweeping aerial views, cinematic fly-throughs, and dynamic overhead shots for weddings, events, and commercials.',
      icon: (
        <img
          src={artboard2Icon}
          alt="Dronography"
          className="service-icon-image"
          loading="lazy"
        />
      )
    }
  ];

  const facilities = [
    {
      title: 'State-of-the-art Studio',
      description: 'Professional in-house studio equipped with the latest lighting and backdrop systems for controlled environment shoots.',
      image: studioImage
    },
    {
      title: 'Professional Equipment',
      description: 'We use industry-leading cameras, lenses, and lighting equipment to ensure the highest quality results for every project.',
      image: professionalEquipmentImage
    },
    {
      title: 'Experienced Team',
      description: 'Our team of dedicated professionals brings years of experience in photography, videography, and post-production.',
      image: experiencedTeamImage
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero hero-padded">
        <video
          autoPlay
          muted
          playsInline
          loop
          poster="/hero-poster.jpg"
          preload={shouldLoadHeroVideo ? 'metadata' : 'none'}
          className="hero-background-video"
          aria-hidden="true"
        >
          {shouldLoadHeroVideo && <source src={bgVideo} type="video/mp4" />}
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title hero-title-spaced">
            <span className="bw-gradient-text">Capturing Moments</span><br /><br />  
            <span className="gradient-text"> Creating Legacies </span><br /><br />  
          </h1>
          <p className="hero-subtitle">
            Expert film production for brands, events, and cinematic journeys
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="section features-section"
        style={{
          minHeight: '100vh',
          paddingTop: '200px',
          paddingBottom: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        <div className="container">
          <div data-scroll="blur-up" data-scroll-duration="slow">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">We bring stories to life through our lens</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                data-scroll="fade-up"
                data-scroll-delay={index * 150}
                data-scroll-easing="ease-out"
              >
                <motion.div
                  className="feature-card"
                  whileHover={{ 
                    y: -12,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section 
        className="section facilities-section"
        style={{
          minHeight: '100vh',
          paddingTop: '180px',
          paddingBottom: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        <div className="container">
          <div data-scroll="blur-up" data-scroll-duration="slow">
            <h2 className="section-title">Our Facilities</h2>
            <p className="section-subtitle">Top-tier equipment and professional studio space</p>
          </div>

          <div className="facilities-grid">
            {facilities.map((facility, index) => (
              <div
                key={index}
                data-scroll="rotate-up"
                data-scroll-delay={index * 200}
              >
                <div className="facility-card">
                  <div className="facility-image-container">
                    {facility.image && (
                      <img 
                        src={facility.image} 
                        alt={facility.title} 
                        className="facility-img-tag" 
                      />
                    )}
                  </div>
                  <h3 className="facility-title">{facility.title}</h3>
                  <p className="facility-description">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experienced Team Section */}
      <section 
        className="section studio-section"
        style={{
          minHeight: '100vh',
          paddingTop: '180px',
          paddingBottom: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        <div className="container">
          <div className="studio-content">
            <div data-scroll="blur-up" data-scroll-duration="slow" className="studio-text">
              <h2 className="section-title">Experienced Team</h2>
              <p className="section-subtitle">Dedicated professionals with years of expertise</p>
              <p className="studio-description">
                Our team brings together talented photographers, videographers, and post-production specialists with extensive experience across weddings, corporate events, and creative projects. We're passionate about delivering excellence in every frame.
              </p>
            </div>
            <div data-scroll="fade-up" className="studio-image-wrapper">
              <motion.img 
                src={experiencedTeamImage}
                alt="Experienced Team"
                className="studio-image"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                data-scroll="fade-up"
                data-scroll-delay={index * 150}
                className="stat-item"
              >
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="cta-section">
        <div data-scroll="blur-up" data-scroll-duration="slow" className="cta-content">
          <h2>Ready to Create Something Amazing?</h2>
          <p>Let's capture your special moments together</p>
          <Link to="/contact" className="btn btn-primary">
            Get In Touch <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;