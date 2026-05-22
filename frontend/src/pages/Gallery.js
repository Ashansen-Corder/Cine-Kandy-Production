import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Play, X, Maximize2 } from 'lucide-react';
import './Gallery.css'; 

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/gallery');
        const items = response.data.data || response.data;

        if (Array.isArray(items)) {
          setGalleryItems(items);
        } else {
          throw new Error('Invalid data format from API');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load gallery');
        setLoading(false);
      }
    };
    fetchGalleryData();
  }, []);


  // Wavy SVG Timeline
  const WavyTimeline = () => (
    <svg
      className="wavy-timeline"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: '80px',
        height: '100%',
        transform: 'translateX(-50%)',
        zIndex: 1
      }}
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C9A05D" stopOpacity="0" />
          <stop offset="20%" stopColor="#C9A05D" stopOpacity="1" />
          <stop offset="80%" stopColor="#C9A05D" stopOpacity="1" />
          <stop offset="100%" stopColor="#C9A05D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 50 0 C 70 100, 30 200, 50 300 C 70 400, 30 500, 50 600 C 70 700, 30 800, 50 900 C 70 1000, 30 1100, 50 1200"
        stroke="url(#waveGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );

  // Timeline Dot
  const TimelineDot = () => (
    <motion.div
      className="timeline-dot"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400 }}
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '16px',
        height: '16px',
        backgroundColor: '#C9A05D',
        borderRadius: '50%',
        border: '3px solid #0f0f0f',
        boxShadow: '0 0 15px rgba(201, 160, 93, 0.6)',
      }}
    />
  );

  // Gallery Card
  const GalleryCard = ({ item, index }) => {
    const isLeft = index % 2 === 0;
    const cardVariants = {
      hidden: { opacity: 0, x: isLeft ? -50 : 50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: index * 0.1 } },
    };

    return (
      <motion.div
        className={`timeline-item ${isLeft ? 'left' : 'right'}`}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        style={{
          display: 'flex',
          justifyContent: isLeft ? 'flex-end' : 'flex-start',
          marginBottom: '80px',
          position: 'relative',
        }}
      >
        <motion.div
          className="gallery-card"
          onClick={() => setSelectedItem(item)}
          whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(201, 160, 93, 0.3)' }}
          style={{
            width: '45%',
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px solid rgba(201, 160, 93, 0.3)',
            position: 'relative'
          }}
        >
          {/* Media Container */}
          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#000', overflow: 'hidden' }}>
            {item.type === 'Video' && item.vimeoId ? (
              <iframe
                src={`https://player.vimeo.com/video/${item.vimeoId}?background=1`}
                frameBorder="0"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                title={item.title}
              />
            ) : item.type === 'Image' && item.image ? (
              <img src={item.image} alt={item.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' }}>
                <Play size={48} color="#C9A05D" />
              </div>
            )}

            {/* Title Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '15px',
              width: 'auto',
              zIndex: 3,
              pointerEvents: 'none'
            }}>
              <h3 style={{ 
                margin: '0', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: 'rgba(255, 255, 255, 0.9)',
                textTransform: 'uppercase',
                letterSpacing: '3px', 
                textShadow: '2px 2px 8px rgba(0,0,0,0.9)', 
                textAlign: 'left'
              }}>
                {item.title || 'Untitled'}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Timeline Dot */}
        <TimelineDot />
      </motion.div>
    );
  };

  // Lightbox Modal
  const Lightbox = ({ item, onClose }) => (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    >
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1, rotate: 90 }}
        style={{ position: 'absolute', top: '30px', right: '30px', width: '50px', height: '50px', backgroundColor: '#C9A05D', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}
      >
        <X size={28} color="#000" />
      </motion.button>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
        {item.type === 'Video' && item.vimeoId ? (
          <iframe src={`https://player.vimeo.com/video/${item.vimeoId}?autoplay=1&portrait=false&title=false&byline=false`} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ width: '90vw', height: '90vh', maxWidth: '1200px', maxHeight: '800px', borderRadius: '8px' }} title={item.title} />
        ) : item.type === 'Image' && item.image ? (
          <img src={item.image} alt={item.title} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px', objectFit: 'contain' }} />
        ) : (
          <div style={{ color: '#fff', fontSize: '18px', textAlign: 'center' }}>Media unavailable</div>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="gallery-page">
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ 
          textAlign: 'center', 
          padding: '160px 20px', 
          position: 'relative',
          backgroundImage: `url('https://static.showit.co/file/XMEb1lCbSG-ba5brtN5MxQ/205136/cliffwalk.gif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center -220%', 
          backgroundAttachment: 'fixed',
          borderBottom: '1px solid rgba(201, 160, 93, 0.2)' 
        }}
      >
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            fontSize: '42px', 
            fontWeight: '800', 
            color: '#000000', 
            margin: '0 0 20px 0', 
            letterSpacing: '8px', 
            textTransform: 'uppercase',
            textShadow: '2px 4px 15px rgb(255, 255, 255)' 
          }}
        >
          Our Gallery
        </motion.h1>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ 
            fontSize: '10px', 
            color: '#000000', 
            margin: '0', 
            maxWidth: '700px', 
            marginLeft: 'auto', 
            marginRight: 'auto',
            letterSpacing: '2px',
            textShadow: '4px 4px 20px rgba(255, 255, 255, 0.94)' 
          }}
        >
          A collection of our finest work capturing life's most beautiful moments
        </motion.p>
      </motion.section>

      {/* 🔴 Added Browse Our Work Section */}
      <section style={{ 
        padding: '80px 20px 20px 20px', 
        textAlign: 'center',
        background: 'var(--primary-dark)' 
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontFamily: "'Cormorant Garamond', serif",
            color: '#C9A05D',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            margin: '0 0 10px 0',
            fontWeight: '400'
          }}>
            Browse Our Work
          </h2>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(201, 160, 93, 0.4)', margin: '15px auto' }}></div>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: '300',
            letterSpacing: '1px',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
            Explore our visual storytelling through a curated selection of cinematic films and timeless photography.
          </p>
        </motion.div>
      </section>

      {loading && (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#C9A05D' }}>
          <p>Loading gallery...</p>
        </div>
      )}

      {!loading && galleryItems.length > 0 && (
        <section className="gallery-timeline" style={{ padding: '100px 20px', position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
          <WavyTimeline />
          <AnimatePresence>
            {galleryItems.map((item, index) => (
              <GalleryCard key={item._id || index} item={item} index={index} />
            ))}
          </AnimatePresence>
        </section>
      )}

      <AnimatePresence>
        {selectedItem && <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;