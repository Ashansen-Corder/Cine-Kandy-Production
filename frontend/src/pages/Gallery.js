import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Play, X } from 'lucide-react';

import './Gallery.css';

const FALLBACK_GALLERY_ITEMS = [
  {
    _id: '1',
    title: 'EMILY + JEFF',
    subtitle: 'An Intimate Celebration',
    vimeoUrl: 'https://vimeo.com/1179892828',
    vimeoId: '1179892828',
    type: 'Video',
  },
  {
    _id: '2',
    title: 'JOSH + NICOLE',
    subtitle: 'Mountain Elopement',
    vimeoUrl: 'https://vimeo.com/1179885305',
    vimeoId: '1179885305',
    type: 'Video',
  },
  {
    _id: '3',
    title: 'ALYSSA + DAVID',
    subtitle: 'Desert Romance',
    vimeoUrl: 'https://vimeo.com/1179882525',
    vimeoId: '1179882525',
    type: 'Video',
  },
  {
    _id: '4',
    title: 'CHAMOD + AYESHA',
    subtitle: 'Tropical Paradise',
    vimeoUrl: 'https://vimeo.com/1179885805',
    vimeoId: '1179885805',
    type: 'Video',
  },
  {
    _id: '5',
    title: 'CHINTHAKA + DANANJALI',
    subtitle: 'Garden Elegance',
    vimeoUrl: 'https://vimeo.com/1179888247',
    vimeoId: '1179888247',
    type: 'Video',
  },
  {
    _id: '6',
    title: 'DINIDU + THISURI',
    subtitle: 'Beachside Bliss',
    vimeoUrl: 'https://vimeo.com/1179890087',
    vimeoId: '1179890087',
    type: 'Video',
  },
];

const getVimeoEmbedUrl = (item, isBackground = false) => {
  const url = item.vimeoUrl || item.videoUrl || item.url || '';
  let videoId = item.vimeoId || null;
  let hashParam = item.hash || item.h || '';

  if (url) {
    const unlistedMatch = url.match(/vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)/);
    if (unlistedMatch) {
      videoId = unlistedMatch[1];
      hashParam = unlistedMatch[2];
    } else {
      const stdMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
      if (stdMatch) {
        videoId = stdMatch[1];
      }
      const hMatch = url.match(/[?&]h=([a-zA-Z0-9]+)/);
      if (hMatch) {
        hashParam = hMatch[1];
      }
    }
  }

  if (!videoId && item._id && !isNaN(item._id)) {
    videoId = item._id;
  }

  if (!videoId) return null;

  const params = [];
  if (hashParam) params.push(`h=${hashParam}`);

  if (isBackground) {
    params.push('background=1');
    params.push('autoplay=1');
    params.push('loop=1');
    params.push('muted=1');
    params.push('autopause=0');
    params.push('dnt=1');
  } else {
    params.push('autoplay=1');
    params.push('portrait=0');
    params.push('title=0');
    params.push('byline=0');
    params.push('dnt=1');
  }

  return `https://player.vimeo.com/video/${videoId}?${params.join('&')}`;
};

const getYouTubeEmbedUrl = (item, isBackground = false) => {
  const url = item.youtubeUrl || item.videoUrl || item.url || '';
  let youtubeId = item.youtubeId || null;

  if (!youtubeId && url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) youtubeId = match[1];
  }

  if (!youtubeId) return null;

  if (isBackground) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&enablejsapi=1`;
  }
  return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1`;
};

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState(FALLBACK_GALLERY_ITEMS);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL || '';
        if (!API_URL) {
          // If no external API is configured, use fallback items directly on Netlify
          setGalleryItems(FALLBACK_GALLERY_ITEMS);
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_URL}/gallery`);
        const items = response.data.data || response.data;

        if (Array.isArray(items) && items.length > 0) {
          setGalleryItems(items);
        } else {
          setGalleryItems(FALLBACK_GALLERY_ITEMS);
        }
      } catch (err) {
        console.warn('API fetch failed, displaying fallback video gallery:', err.message);
        setGalleryItems(FALLBACK_GALLERY_ITEMS);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryData();
  }, []);

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

  const GalleryCard = ({ item, index }) => {
    const isLeft = index % 2 === 0;
    const cardVariants = {
      hidden: { opacity: 0, x: isLeft ? -50 : 50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: index * 0.1 } },
    };

    const vimeoEmbedUrl = getVimeoEmbedUrl(item, true);
    const youtubeEmbedUrl = getYouTubeEmbedUrl(item, true);

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
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000', overflow: 'hidden' }}>
            {vimeoEmbedUrl ? (
              <iframe
                src={vimeoEmbedUrl}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                title={item.title || 'Vimeo Video'}
              />
            ) : youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                title={item.title || 'YouTube Video'}
              />
            ) : (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' }}>
                <Play size={48} color="#C9A05D" />
              </div>
            )}

            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '15px',
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
        <TimelineDot />
      </motion.div>
    );
  };

  const Lightbox = ({ item, onClose }) => {
    const vimeoEmbedUrl = getVimeoEmbedUrl(item, false);
    const youtubeEmbedUrl = getYouTubeEmbedUrl(item, false);

    return (
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

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '90vw',
            maxWidth: '1100px',
            aspectRatio: '16/9',
            maxHeight: '80vh',
            backgroundColor: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(201, 160, 93, 0.4)'
          }}
        >
          {vimeoEmbedUrl ? (
            <iframe
              src={vimeoEmbedUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={item.title || 'Vimeo Player'}
            />
          ) : youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={item.title || 'YouTube Player'}
            />
          ) : (
            <div style={{ color: '#fff', fontSize: '18px', textAlign: 'center', padding: '40px' }}>Media unavailable</div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="gallery-page">
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
      </motion.section>

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