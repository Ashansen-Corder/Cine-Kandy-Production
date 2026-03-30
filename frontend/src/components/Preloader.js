import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';
import logoVideo from '../assets/Ashan/Logo Animation.mp4';

const Preloader = ({ theme }) => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleVideoEnd = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      // Fallback: Hide preloader after 5 seconds if video doesn't end
      const fallbackTimer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => {
        clearTimeout(fallbackTimer);
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          <video
            ref={videoRef}
            src={logoVideo}
            className="preloader-video"
            autoPlay
            muted
            playsInline
            disablePictureInPicture
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
