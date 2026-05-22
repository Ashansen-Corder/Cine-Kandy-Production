import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Camera, Film, Video, Users, Heart, Sparkles, 
  CheckCircle, ArrowRight, Briefcase, Star 
} from 'lucide-react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: <Heart className="text-primary" size={40} />, // icon එක මෙතනට add කළා
      title: 'Wedding Photography',
      description: 'Capture every precious moment of your special day with our artistic wedding photography services.',
      features: ['Full Day Coverage', 'Pre-Wedding Shoot', 'Candid Photography', 'Traditional Photography', 'Photo Album Design', 'Digital Gallery'],
      price: 'From LKR 150,000'
    },
    {
      icon: <Film className="text-primary" size={40} />,
      title: 'Cinematic Videography',
      description: 'Create stunning cinematic films that tell your story with emotion and elegance.',
      features: ['4K Video Production', 'Drone Footage', 'Professional Editing', 'Color Grading', 'Background Music', 'Highlight Reel'],
      price: 'From LKR 200,000'
    },
    {
      icon: <Video className="text-primary" size={40} />,
      title: 'Dronography',
      description: 'Aerial cinematography by licensed pilots delivering sweeping perspectives, dynamic fly-throughs, and stabilized tracking shots.',
      features: ['Licensed Drone Pilots', '4K/60fps Capture', 'Cinematic Fly-Throughs', 'Live Monitoring Feed', 'Safety & Permits Assistance', 'RAW Footage & Edited Clips'],
      price: 'From LKR 120,000'
    },
    {
      icon: <Briefcase className="text-primary" size={40} />,
      title: 'Corporate Events',
      description: 'Professional coverage of conferences, seminars, and corporate gatherings.',
      features: ['Event Documentation', 'Team Photography', 'Brand Integration', 'Same Day Delivery', 'Multi-Camera Setup', 'Live Streaming'],
      price: 'Custom Quote'
    },
    {
      icon: <Star className="text-primary" size={40} />,
      title: 'Special Events',
      description: 'Birthday parties, anniversaries, and other milestone celebrations captured beautifully.',
      features: ['Party Coverage', 'Candid Moments', 'Decoration Photography', 'Guest Photography', 'Highlight Video', 'Online Gallery'],
      price: 'From LKR 75,000'
    },
    {
      icon: <Camera className="text-primary" size={40} />,
      title: 'Portrait Photography',
      description: 'Professional portraits for individuals, families, and professional headshots.',
      features: ['Studio Session', 'Outdoor Session', 'Professional Lighting', 'Retouching', 'Multiple Outfits', 'Digital Files'],
      price: 'From LKR 25,000'
    },
    {
      icon: <Sparkles className="text-primary" size={40} />,
      title: 'Commercial Videos',
      description: 'High-quality promotional videos and advertisements for businesses.',
      features: ['Concept Development', 'Scriptwriting', 'Professional Equipment', 'Motion Graphics', 'Voice Over', 'Social Media Formats'],
      price: 'Custom Quote'
    }
  ];

  const packages = [
    {
      name: 'Basic',
      price: 'LKR 100,000',
      duration: 'Half Day',
      features: [
        '6 Hours Coverage',
        '1 Photographer',
        '300+ Digital Photos',
        'Online Gallery',
        'Basic Editing'
      ]
    },
    {
      name: 'Premium',
      price: 'LKR 200,000',
      duration: 'Full Day',
      features: [
        '12 Hours Coverage',
        '2 Photographers',
        '600+ Digital Photos',
        'Online Gallery',
        'Advanced Editing',
        'Photo Album (30 Pages)',
        'Highlight Video (5 min)'
      ],
      popular: true
    },
    {
      name: 'Luxury',
      price: 'LKR 350,000',
      duration: 'Full Day',
      features: [
        '14 Hours Coverage',
        '3 Photographers',
        '1000+ Digital Photos',
        'Premium Online Gallery',
        'Professional Editing',
        'Photo Album (60 Pages)',
        'Cinematic Film (15 min)',
        'Drone Coverage',
        'Pre-Wedding Shoot'
      ]
    }
  ];

  return (
    <div className="services-page">
      <motion.div 
        className="services-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="services-hero-content">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Professional photography and videography services tailored to your needs
          </motion.p>
        </div>
      </motion.div>

      <div className="container section">
        <div>
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle">
            Comprehensive photography and videography solutions for every occasion
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index}>
                <motion.div
                  className="service-card"
                  whileHover={{ y: -10 }}
                >
                  {/* Icon එක මෙතන හරියට render වෙනවා */}
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="service-price">{service.price}</div>
                  <Link to="/contact" className="service-btn">
                    Book Now <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

      <div className="packages-section">
        <div className="container">
          <div>
            <h2 className="section-title">Wedding Packages</h2>
            <p className="section-subtitle">
              Choose the perfect package for your special day
            </p>
          </div>

          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <div key={index}>
                <motion.div
                  className={`package-card ${pkg.popular ? 'popular' : ''}`}
                  whileHover={{ y: -6 }}
                >
                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-price">{pkg.price}</div>
                  <div className="package-duration">{pkg.duration}</div>
                  <ul className="package-features">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle size={20} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="package-btn">
                    Select Package
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;