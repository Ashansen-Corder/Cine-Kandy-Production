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
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    let exitTimer;
    let fallbackTimer;

    const handleVideoEnd = () => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      clearTimeout(fallbackTimer);
      try {
        sessionStorage.setItem('cinekandy-intro-played', 'true');
      } catch {
        // Session storage can be unavailable in private browsing.
      }
      exitTimer = setTimeout(() => setIsLoading(false), 300);
    };

    if (!video || !isLoading) return undefined;

    hasCompletedRef.current = false;
    video.addEventListener('ended', handleVideoEnd);

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        clearTimeout(fallbackTimer);
        fallbackTimer = setTimeout(handleVideoEnd, (video.duration + 1) * 1000);
      }
    };
    const handlePlaybackError = () => {
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(handleVideoEnd, 1500);
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('error', handlePlaybackError, { once: true });
    // Always complete even when mobile Safari/Chrome delays media events.
    fallbackTimer = setTimeout(handleVideoEnd, 10000);
    video.play().catch(() => {
      // The poster remains visible while autoplay is blocked, then the
      // guaranteed fallback lets the page become interactive.
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(handleVideoEnd, 1500);
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
            preload="auto"
            disablePictureInPicture
            aria-label="Cine Kandy"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
