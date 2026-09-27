import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Camera, Film, Video, Heart, Sparkles, 
  CheckCircle, ArrowRight, Briefcase, Star,
  Clock, ShieldCheck, ChevronDown, Award, HelpCircle
} from 'lucide-react';
import './Services.css';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'photography', label: 'Photography' },
    { id: 'videography', label: 'Cinematography & Drone' },
    { id: 'events', label: 'Corporate & Events' }
  ];

  const services = [
    {
      id: 'wedding-photography',
      category: 'photography',
      icon: <Heart size={28} />,
      tag: 'MOST POPULAR',
      title: 'Wedding Photography',
      description: 'Capture every emotional, precious moment of your special day with signature artistic framing and timeless tones.',
      features: [
        'Full Day Coverage',
        'Pre-Wedding Conceptual Shoot',
        'Candid & Traditional Coverage',
        'Luxury Leather Photo Album Design',
        'High-Res Digital Online Gallery'
      ],
      price: 'From LKR 150,000'
    },
    {
      id: 'cinematic-videography',
      category: 'videography',
      icon: <Film size={28} />,
      tag: 'SIGNATURE FILM',
      title: 'Cinematic Videography',
      description: 'High-definition 4K film production telling your unique love story with emotion, color grading, and cinematic elegance.',
      features: [
        '4K Cinema Camera Production',
        'Pro Audio Recording & Sound Design',
        'Hollywood Grade Color Grading',
        'Included Aerial Drone Coverage',
        'Cinematic Teaser & Highlight Film'
      ],
      price: 'From LKR 200,000'
    },
    {
      id: 'dronography',
      category: 'videography',
      icon: <Video size={28} />,
      tag: 'AERIAL EXCELLENCE',
      title: 'Dronography Aerial Filming',
      description: 'Dynamic aerial cinematography by certified drone pilots delivering sweeping perspectives and ultra-smooth tracking shots.',
      features: [
        'Licensed & Certified Drone Pilots',
        '4K 60fps High Bitrate Video',
        'Dynamic Fly-Through & Orbit Shots',
        'Safety & Location Permits Support',
        'RAW Footage & Color Graded Clips'
      ],
      price: 'From LKR 120,000'
    },
    {
      id: 'corporate-events',
      category: 'events',
      icon: <Briefcase size={28} />,
      tag: 'ENTERPRISE',
      title: 'Corporate & Brand Coverage',
      description: 'High-impact media production for corporate summits, product launches, brand commercials, and executive headshots.',
      features: [
        'Multi-Camera High-Res Recording',
        'Same-Day Highlights Edit Option',
        'Brand Identity & Logo Integration',
        'Licensed Commercial Usage Rights',
        'Dedicated On-Site Producer'
      ],
      price: 'Custom Quote'
    },
    {
      id: 'special-events',
      category: 'events',
      icon: <Star size={28} />,
      tag: 'CELEBRATIONS',
      title: 'Special Milestone Events',
      description: 'Anniversaries, grand galas, birthday celebrations, and cultural festivals documented with vibrant detail.',
      features: [
        'Comprehensive Event Coverage',
        'Candid Guest Moments & Decor',
        'Fast 48-Hour Digital Delivery',
        'Sharable Private Web Gallery',
        'High-Resolution Digital Files'
      ],
      price: 'From LKR 75,000'
    },
    {
      id: 'portrait-photography',
      category: 'photography',
      icon: <Camera size={28} />,
      tag: 'STUDIO & OUTDOOR',
      title: 'Luxury Portrait Sessions',
      description: 'Bespoke portraiture for individuals, model portfolios, and families in studio or exotic outdoor locations.',
      features: [
        'Studio & Outdoor Shoot Locations',
        'Professional Master Lighting Setup',
        'High-End Beauty Retouching',
        'Multiple Wardrobe Changes',
        'Full Resolution Master Files'
      ],
      price: 'From LKR 25,000'
    },
    {
      id: 'commercial-videos',
      category: 'videography',
      icon: <Sparkles size={28} />,
      tag: 'PROMOTIONAL',
      title: 'Commercial Ads & Reels',
      description: 'Custom promotional campaigns and social media video ads engineered to captivate audiences and elevate brands.',
      features: [
        'Concept & Storyboard Design',
        'Professional Voiceover & Scoring',
        'Motion Graphics & Visual Effects',
        'Social Media Formats (9:16 / 16:9)',
        'Full Commercial Broadcasting Rights'
      ],
      price: 'Custom Quote'
    }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(service => service.category === activeCategory);

  const packages = [
    {
      name: 'Silver Collection',
      badge: 'ESSENTIAL',
      price: 'LKR 100,000',
      duration: 'Half Day (6 Hours)',
      description: 'Essential high-quality coverage for intimate ceremonies and smaller gatherings.',
      features: [
        '6 Hours Professional Coverage',
        '1 Senior Photographer',
        '300+ Color-Corrected Photos',
        'Private Digital Online Gallery',
        'Standard Retouching & Delivery'
      ],
      popular: false
    },
    {
      name: 'Gold Signature',
      badge: 'MOST REQUESTED',
      price: 'LKR 200,000',
      duration: 'Full Day (12 Hours)',
      description: 'Complete luxury coverage crafted to capture every milestone from morning preparations to evening celebrations.',
      features: [
        '12 Hours Full Day Coverage',
        '2 Senior Photographers',
        '600+ Master Retouched Photos',
        '30-Page Premium Flush-Mount Album',
        'Cinematic Highlight Video (5 mins)',
        'Pre-Wedding Mini Session',
        'Private Online Digital Gallery'
      ],
      popular: true
    },
    {
      name: 'Platinum Luxury',
      badge: 'ROYAL EXPERIENCE',
      price: 'LKR 350,000',
      duration: 'Full Day (14 Hours)',
      description: 'The ultimate royal experience featuring multi-camera cinema team, drone aerials, and luxury heirloom albums.',
      features: [
        '14 Hours Comprehensive Coverage',
        '3 Photographers & 2 Videographers',
        '1000+ Master Retouched Photos',
        '60-Page Custom Leather Heirloom Album',
        '15-Minute Cinematic Story Film',
        '4K Drone Aerial Filming Included',
        'Pre-Wedding Concept Shoot',
        '2 Parent Mini Albums Included'
      ],
      popular: false
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Consultation & Vision',
      description: 'We meet to understand your event story, timeline, preferred aesthetic, and special requirements.'
    },
    {
      number: '02',
      title: 'Creative Planning',
      description: 'Developing detailed shot lists, lighting plans, and location scouting tailored to your venue.'
    },
    {
      number: '03',
      title: 'Cinematic Production',
      description: 'Capturing moments seamlessly with state-of-the-art 4K cameras, prime lenses, and audio gear.'
    },
    {
      number: '04',
      title: 'Master Editing & Delivery',
      description: 'Meticulous color grading, album layout design, audio mastering, and fast digital delivery.'
    }
  ];

  const faqs = [
    {
      question: 'How early should we book Cine Kandy for our wedding or event?',
      answer: 'We recommend booking 3 to 6 months in advance, especially for peak wedding seasons, to ensure availability for your chosen dates.'
    },
    {
      question: 'Do you travel outside of Kandy for photo and video shoots?',
      answer: 'Yes! We provide island-wide coverage across Sri Lanka as well as international destination weddings and commercial projects.'
    },
    {
      question: 'How long does it take to receive final photos and videos?',
      answer: 'Sneak-peek highlight photos and short clips are delivered within 48-72 hours. Complete master retouched galleries and films take 3-4 weeks.'
    },
    {
      question: 'Can we customize any of the pricing packages?',
      answer: 'Absolutely. Every client and event is unique. We are happy to build a fully tailored custom package matching your exact scope and budget.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="services-page cinematic-bg">
      {/* Hero Section */}
      <motion.div 
        className="services-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="services-hero-content">
          <motion.div 
            className="hero-badge"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Award size={14} />
            <span>CINEMATIC EXCELLENCE</span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Bespoke Services & Packages
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Crafting timeless photography and cinematic visual narratives tailored with gold-standard precision
          </motion.p>
        </div>
      </motion.div>

      {/* Services Grid Section */}
      <div className="container section">
        <div className="section-header">
          <span className="section-tag">WHAT WE OFFER</span>
          <h2 className="section-title">Our Specialized Offerings</h2>
          <p className="section-subtitle">
            Explore our range of professional media services crafted to capture your visual legacy
          </p>
        </div>

        {/* Category Filters */}
        <div className="category-filter-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Cards */}
        <div className="services-grid">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div 
                key={service.id} 
                className="service-card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="service-card">
                  <div className="service-card-top">
                    <div className="service-icon-wrapper">
                      {service.icon}
                    </div>
                    <span className="service-tag">{service.tag}</span>
                  </div>

                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-divider"></div>

                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle size={16} className="feature-check-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="service-card-bottom">
                    <div className="service-price">{service.price}</div>
                    <Link to="/contact" className="service-btn">
                      <span>Book Now</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Wedding & Event Packages Section */}
      <div className="packages-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">INVESTMENT PACKAGES</span>
            <h2 className="section-title">Wedding & Event Packages</h2>
            <p className="section-subtitle">
              Select a comprehensive package tailored for your celebration, or inquire for custom builds
            </p>
          </div>

          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <div key={index} className="package-card-wrapper">
                <div className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                  {pkg.popular && (
                    <div className="popular-badge">
                      <Sparkles size={12} />
                      <span>{pkg.badge}</span>
                    </div>
                  )}

                  {!pkg.popular && pkg.badge && (
                    <span className="package-tier-badge">{pkg.badge}</span>
                  )}

                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-price">{pkg.price}</div>
                  <div className="package-duration">
                    <Clock size={14} />
                    <span>{pkg.duration}</span>
                  </div>

                  <p className="package-desc">{pkg.description}</p>
                  
                  <div className="package-divider"></div>

                  <ul className="package-features">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <ShieldCheck size={16} className="package-check-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/contact" className="package-btn">
                    Select Package
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Creative Process Section */}
      <div className="container section process-section">
        <div className="section-header">
          <span className="section-tag">OUR METHODOLOGY</span>
          <h2 className="section-title">The Creative Process</h2>
          <p className="section-subtitle">
            How we bring your vision to life with seamless organization and artistic precision
          </p>
        </div>

        <div className="process-grid">
          {processSteps.map((step, idx) => (
            <motion.div 
              key={idx}
              className="process-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className="process-number">{step.number}</div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="container section faq-section">
        <div className="section-header">
          <span className="section-tag">GOT QUESTIONS?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about our services, booking process, and deliverables
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openFaq === index ? 'open' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <div className="faq-title-group">
                  <HelpCircle size={20} className="faq-icon" />
                  <h4>{faq.question}</h4>
                </div>
                <ChevronDown className="faq-arrow" size={20} />
              </div>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Quote CTA Section */}
      <div className="services-cta-section">
        <div className="container">
          <div className="services-cta-card">
            <div className="cta-content">
              <span className="cta-badge">CUSTOM TAILORED SOLUTIONS</span>
              <h2>Have a Unique Event or Vision?</h2>
              <p>
                Whether it's an international destination wedding, grand cultural gala, or brand commercial, we craft bespoke media packages aligned with your budget.
              </p>
              <Link to="/contact" className="cta-btn">
                <span>Request Custom Quote</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;