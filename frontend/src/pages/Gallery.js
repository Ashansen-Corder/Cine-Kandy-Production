import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import axios from 'axios';
import './Gallery.css';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  // Sample data - replace with API call
  useEffect(() => {
    const sampleImages = [
      { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', category: 'wedding', title: 'Royal Wedding' },
      { id: 2, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', category: 'corporate', title: 'Corporate Event' },
      { id: 3, url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80', category: 'event', title: 'Cultural Festival' },
      { id: 4, url: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&q=80', category: 'portrait', title: 'Portrait Session' },
      { id: 5, url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80', category: 'wedding', title: 'Garden Wedding' },
      { id: 6, url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', category: 'event', title: 'Music Festival' },
      { id: 7, url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', category: 'event', title: 'Outdoor Concert' },
      { id: 8, url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80', category: 'wedding', title: 'Beach Wedding' },
      { id: 9, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', category: 'corporate', title: 'Conference' },
      { id: 10, url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', category: 'portrait', title: 'Fashion Portrait' },
      { id: 11, url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80', category: 'event', title: 'Birthday Party' },
      { id: 12, url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80', category: 'wedding', title: 'Traditional Wedding' }
    ];
    setImages(sampleImages);
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'event', label: 'Events' },
    { id: 'portrait', label: 'Portraits' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="gallery-page">
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
            A collection of our finest work capturing life's beautiful moments
          </motion.p>
        </div>
      </motion.div>

      <div className="gallery-container container">
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
          className="gallery-grid"
          layout
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="gallery-item"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image.url} alt={image.title} loading="lazy" />
                <div className="gallery-item-overlay">
                  <ZoomIn size={32} />
                  <p>{image.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.button 
              className="lightbox-close"
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </motion.button>
            <motion.img
              src={selectedImage.url}
              alt={selectedImage.title}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            />
            <motion.div 
              className="lightbox-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {selectedImage.title}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
