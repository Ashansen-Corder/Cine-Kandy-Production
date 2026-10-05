import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoVideo from '../assets/Logo Animation.mp4';
import './Preloader.css';

const Preloader = ({ theme }) => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let exitTimer;

    const handleVideoEnd = () => {
      exitTimer = setTimeout(() => setIsLoading(false), 300);
    };

    if (!video) return undefined;

    video.addEventListener('ended', handleVideoEnd);

    // iOS Safari can reject autoplay until the video has been interacted with.
    // The timeout guarantees the app is never blocked behind the intro.
    const fallbackTimer = setTimeout(() => setIsLoading(false), 4500);
    const playPromise = video.play();
    playPromise?.catch(() => setIsLoading(false));

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(exitTimer);
      video.removeEventListener('ended', handleVideoEnd);
    };
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
