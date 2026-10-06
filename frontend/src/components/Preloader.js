import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoVideo from '../assets/Logo Animation.mp4';
import './Preloader.css';

const Preloader = ({ theme }) => {
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return sessionStorage.getItem('cinekandy-intro-played') !== 'true';
    } catch {
      return true;
    }
  });
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let exitTimer;
    let fallbackTimer;

    const handleVideoEnd = () => {
      clearTimeout(fallbackTimer);
      try {
        sessionStorage.setItem('cinekandy-intro-played', 'true');
      } catch {
        // Session storage can be unavailable in private browsing.
      }
      exitTimer = setTimeout(() => setIsLoading(false), 300);
    };

    if (!video || !isLoading) return undefined;

    video.addEventListener('ended', handleVideoEnd);

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        fallbackTimer = setTimeout(handleVideoEnd, (video.duration + 1) * 1000);
      }
    };
    const handlePlaybackError = () => {
      fallbackTimer = setTimeout(handleVideoEnd, 5000);
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('error', handlePlaybackError, { once: true });
    fallbackTimer = setTimeout(handleVideoEnd, 12000);
    video.play().catch(() => {
      // Keep the overlay visible if the browser delays muted autoplay.
    });
    document.body.classList.add('intro-playing');

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(exitTimer);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('error', handlePlaybackError);
      document.body.classList.remove('intro-playing');
    };
  }, [isLoading]);

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
            poster="/cinekandy-logo.png"
            autoPlay
            muted
            playsInline
            disablePictureInPicture
            aria-label="Cine Kandy"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
