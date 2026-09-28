import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Facebook, Mail, Phone, MapPin, Linkedin, Youtube, Play } from 'lucide-react';
import './App.css';
import peraheraParade from './assets/perahera-parade.png';
import asLogo from './assets/Artboard-1@4x.png';
// Components
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dronography from './pages/Dronography';
import { ScrollAnimationProvider, ScrollProgressBar } from './components/ScrollAnimations';
import Preloader from './components/Preloader';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/services', label: 'Services' },
    { path: '/dronography', label: 'Dronography' },
    { path: '/blog', label: 'Events' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/cinekandy-logo.png" alt="Cinekandy Production logo" className="logo-image" />
        </Link>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <button 
          className="menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </motion.nav>
  );
}

function Layout({ children }) {
  return (
    <div className="video-wrapper">
      {/* --- Background Video eka methana --- */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src="./assets/HB.mp4" type="video/mp4" />
      </video>

      {/* --- Oyage Content eka methana --- */}
      <div className="content-layer">
        {children}
      </div>
    </div>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-content-wrapper">
          <div className="footer-logo-container">
            <img src={asLogo} alt="Artboard Logo" className="footer-logo" />
          </div>
          
          <div className="footer-social-icons">
            <a href="https://www.facebook.com/share/1DESzFWA97/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Facebook">
              <Facebook size={24} />
            </a>
            <a href="https://www.instagram.com/cinekandy_production" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Instagram">
              <Instagram size={24} />
            </a>
            <a href="https://wa.me/94752026577" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="WhatsApp">
              <Play size={24} />
            </a>
            <a href="mailto:contact@example.com" className="footer-social-icon" title="Email">
              <Mail size={24} />
            </a>
          </div>
        </div>
        
        <p className="footer-location">Based in Sri Lanka // Traveling Worldwide</p>
        
        <p className="footer-copyright">&copy; 2026 CodeThree. All rights reserved. Site by CodeThree</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <Preloader />
      <ScrollAnimationProvider>
        <div className="app">
          <ScrollProgressBar />
          <Navigation />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/dronography" element={<Dronography />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </ScrollAnimationProvider>
    </Router>
  );
  
}

export default App;
