import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Maximize2 } from 'lucide-react';
import axios from 'axios';
import './Gallery.css';

// Load Vimeo API globally - runs once
const vimeoAPIPromise = (() => {
  return new Promise((resolve) => {
    if (window.Vimeo) {
      console.log('✓ Vimeo API already loaded');
      resolve();
    } else {
      console.log('Loading Vimeo API...');
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = () => {
        console.log('✓ Vimeo API loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Vimeo API');
        resolve();
      };
      document.head.appendChild(script);
    }
  });
})();

// Initialize Vimeo players with click handlers
const setupVimeoPlayers = () => {
  // Wait for Vimeo API to load
  vimeoAPIPromise.then(() => {
    const iframes = document.querySelectorAll('iframe[src*="vimeo"]');
    console.log(`Found ${iframes.length} Vimeo iframes`);

    iframes.forEach((iframe, index) => {
      // Skip if already initialized
      if (iframe.vimeoInitialized) return;
      iframe.vimeoInitialized = true;

      try {
        // Initialize Vimeo Player
        const player = new window.Vimeo.Player(iframe);
        console.log(`✓ Vimeo Player ${index + 1} initialized`);

        // Get the container that should receive clicks
        let clickContainer = iframe.closest('.inline-video-player') || 
                            iframe.closest('.gallery-video-player') || 
                            iframe.parentElement;

        // Add click handler to container
        clickContainer.addEventListener('click', (e) => {
          // Don't intercept fullscreen button clicks
          if (e.target.closest('.fullscreen-btn')) return;

          e.preventDefault();
          e.stopPropagation();

          console.log('Video clicked - toggling play/pause');

          // Toggle play/pause
          player.getPaused().then(paused => {
            if (paused) {
              console.log('Playing...');
              player.play().catch(err => console.error('Play error:', err));
            } else {
              console.log('Pausing...');
              player.pause().catch(err => console.error('Pause error:', err));
            }
          }).catch(err => console.error('Error:', err));
        });

        // Add cursor pointer to indicate clickability
        clickContainer.style.cursor = 'pointer';

      } catch (err) {
        console.error(`Failed to initialize Vimeo Player ${index + 1}:`, err);
      }
    });
  });
};

// Extract video ID from Vimeo URL - Robust & Foolproof
const extractVideoId = (urlString) => {
  if (!urlString || typeof urlString !== 'string') return null;
  
  // Try multiple regex patterns to extract Vimeo ID
  const patterns = [
    /vimeo\.com\/(\d+)/,           // https://vimeo.com/123456
    /vimeo\.com\/video\/(\d+)/,    // https://vimeo.com/video/123456
    /player\.vimeo\.com\/video\/(\d+)/, // https://player.vimeo.com/video/123456
    /^(\d+)$/                       // Just the number
  ];
  
  for (let pattern of patterns) {
    const match = urlString.match(pattern);
    if (match && match[1]) {
      const id = match[1];
      console.log(`✓ Extracted Vimeo ID: ${id} from URL: ${urlString}`);
      return id;
    }
  }
  
  console.log(`✗ Could not extract Vimeo ID from: ${urlString}`);
  return null;
};

// VideoCard Component - Lazy loads video on inline play
const VideoCard = ({ video, onFullscreenClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);
  // Use pre-computed vimeoId or extract from URL as fallback
  let videoId = video.vimeoId;
  if (!videoId) {
    videoId = extractVideoId(video.url);
  }

  // Re-initialize video players when component mounts or isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        setupVimeoPlayers();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    console.log('🎯 Thumbnail clicked - loading video');
    setIsPlaying(true);
  };

  const handleFullscreenClick = (e) => {
    e.stopPropagation();
    onFullscreenClick(video);
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    onFullscreenClick(video);
  };

  // Render even without valid video ID (show placeholder)
  if (!videoId) {
    console.warn('⚠️ VideoCard: No valid video ID found for:', video);
    return (
      <motion.div
        className="gallery-item"
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <div className="gallery-video-thumbnail" style={{ backgroundColor: '#222' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
            <p>Invalid video</p>
          </div>
        </div>
        <div className="gallery-item-overlay">
          <h4>{video.title}</h4>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="gallery-item"
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      {!isPlaying ? (
        // Thumbnail with Play Icon (Lazy Load - Initially Shown)
        <div className="gallery-video-thumbnail">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            loading="lazy"
            className="video-thumbnail-img"
          />
          <motion.div 
            className="play-icon-overlay"
            onClick={handlePlayClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="play-icon-inner"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play size={42} fill="#C9A05D" color="#C9A05D" />
            </motion.div>
          </motion.div>
          <div className="video-duration-badge">
            <span>Click to Play</span>
          </div>
          <div className="gallery-item-overlay" onClick={handleTitleClick}>
            <h4>{video.title}</h4>
          </div>
        </div>
      ) : (
        // Inline Video Player (Loaded Only After isPlaying = true)
        <div 
          className="inline-video-player gallery-video-player" 
          title="Click to play/pause"
          style={{ cursor: 'pointer' }}
        >
          {videoId && (
            <iframe
              ref={iframeRef}
              title={video.title}
              src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=false&portrait=false&title=false&byline=false`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          <motion.button
            className="fullscreen-btn"
            onClick={handleFullscreenClick}
            aria-label="Open fullscreen"
          >
            <Maximize2 size={24} />
          </motion.button>
        </div>
      )}
      {isPlaying && (
        <div className="gallery-item-overlay" onClick={handleTitleClick}>
          <h4>{video.title}</h4>
        </div>
      )}
    </motion.div>
  );
};

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Category mapping
  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'Weddings', label: 'Weddings' },
    { id: 'Corporate', label: 'Corporate' },
    { id: 'Events', label: 'Events' }
  ];

  // Initialize video players on mount
  useEffect(() => {
    setupVimeoPlayers();
  }, []);

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        console.log('🎨 [GALLERY] Fetching from: http://localhost:5000/api/gallery');
        
        const response = await axios.get('http://localhost:5000/api/gallery', {
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('🎨 [GALLERY] API Response:', response.data);
        
        // Extract items - API returns {data: array}
        let items = response.data.data || response.data;
        
        if (!Array.isArray(items)) {
          console.warn('⚠️  [GALLERY] Response not an array');
          items = [];
        }
        
        console.log(`✅ [GALLERY] Loaded ${items.length} items`);
        setGalleryItems(items);
        setLoading(false);
      } catch (error) {
        console.error('❌ [GALLERY] Fetch Error:', error);
        setApiError(error.message);
        setGalleryItems([]);
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Filter items by category and type
  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  // Re-initialize Vimeo players when items change
  useEffect(() => {
    if (filteredItems.length > 0) {
      const timer = setTimeout(() => {
        setupVimeoPlayers();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filteredItems]);

  // Debug log
  console.log('🎨 GALLERY RENDER STATE:', {
    loading,
    totalItems: galleryItems.length,
    selectedCategory,
    filteredItems: filteredItems.length
  });

  // Debug log before rendering
  console.log('🎬 GALLERY RENDER STATE:', {
    loading,
    totalVideos: galleryItems.length,
    selectedCategory,
    filteredVideos: filteredItems.length,
    videos: galleryItems
  });

  return (
    <div className="gallery-page" id="gallery-section">
      <motion.div
        className="gallery-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="gallery-hero-content">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our Gallery
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A Collection of Our Finest Work Capturing Life's Beautiful Moments
          </motion.p>
        </div>
      </motion.div>

      <div className="gallery-container container">
        {/* CONDITIONAL DEBUG PANEL - Only show if no data */}
        {galleryItems.length === 0 && (
          <div style={{ 
            backgroundColor: '#ff3333', 
            border: '3px solid #ffff00', 
            padding: '30px', 
            margin: '30px auto', 
            maxWidth: '800px',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#fff'
          }}>
            <h2 style={{ color: '#fff', marginTop: 0, fontSize: '2rem' }}>🔴 DEBUG: NO DATA FROM API</h2>
            <p style={{ fontSize: '1.5rem', margin: '10px 0' }}>
              {loading ? '⏳ Still loading...' : '❌ Gallery array is empty'}
            </p>
            {apiError && (
              <p style={{ fontSize: '1.2rem', margin: '10px 0', color: '#ffff00' }}>
                Error: {apiError}
              </p>
            )}
            <div style={{ backgroundColor: '#333', padding: '15px', margin: '20px 0', borderRadius: '5px', textAlign: 'left' }}>
              <p>📋 Status Check:</p>
              <p>• Backend URL: http://localhost:5000/api/gallery ✓</p>
              <p>• Loading: {loading ? '✅ TRUE' : '❌ FALSE'}</p>
              <p>• Endpoint exists: Check console for network tab</p>
              <p>• Database has items: {galleryItems.length > 0 ? '✅ YES' : '❌ NO'}</p>
            </div>
            <p style={{ marginBottom: 0 }}>💡 Check browser console (F12) for detailed error logs</p>
          </div>
        )}

        <div data-scroll="blur-up" data-scroll-duration="slow">
          <h2 className="section-title">Browse Our Work</h2>
          <p className="section-subtitle">Images and videos from our latest projects</p>
        </div>
        <motion.div
          className="gallery-filters"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="gallery-timeline"
          layout
        >
          {loading || !Array.isArray(filteredItems) ? (
            <motion.div 
              className="gallery-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="loading-spinner"></div>
              <p>� Loading gallery...</p>
            </motion.div>
          ) : filteredItems.length === 0 && galleryItems.length > 0 ? (
            <motion.div 
              className="gallery-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p>📭 No items found in this category. Try selecting a different category.</p>
            </motion.div>
          ) : (
            <>
              <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', padding: '2rem 0' }}>
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      className="gallery-item"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      onClick={() => setSelectedItem(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.type === 'Image' ? (
                        // Image Display
                        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', height: '300px' }}>
                          <img 
                            src={item.image} 
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                          }} className="hover-overlay">
                            <Maximize2 size={40} color="#C9A050" />
                          </div>
                        </div>
                      ) : (
                        // Video Display
                        <div style={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '8px',
                          height: '300px',
                          backgroundColor: '#1a1a2e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img 
                            src={item.vimeoId ? `https://vumbnail.com/${item.vimeoId}.jpg` : 'https://via.placeholder.com/300x300?text=Video'}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
                          />
                          <Play size={60} color="#C9A050" style={{ position: 'relative', zIndex: 10 }} />
                        </div>
                      )}
                      
                      {/* Item Title */}
                      <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderTop: '1px solid rgba(201, 160, 80, 0.3)' }}>
                        <h3 style={{ margin: '0.5rem 0', color: '#fff', fontSize: '1rem' }}>{item.title}</h3>
                        <p style={{ margin: '0.25rem 0', color: '#C9A050', fontSize: '0.85rem' }}>{item.category}</p>
                        <small style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{item.type}</small>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Lightbox for Images and Videos */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.button
              className="lightbox-close"
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={() => setSelectedItem(null)}
            >
              <X size={32} />
            </motion.button>
            <motion.div
              className="lightbox-video-container"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            >
              {selectedItem.type === 'Image' ? (
                <img 
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                />
              ) : selectedItem.vimeoId ? (
                <iframe
                  key={selectedItem?._id}
                  title={selectedItem.title}
                  src={`https://player.vimeo.com/video/${selectedItem.vimeoId}?autoplay=1&loop=false&portrait=false&title=true&byline=false`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '90vh' }}
                ></iframe>
              ) : (
                <p style={{ color: '#fff' }}>Video unavailable</p>
              )}
            </motion.div>
            <motion.div
              className="lightbox-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {selectedItem.title}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
