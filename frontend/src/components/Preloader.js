import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoVideo from '../assets/Logo Animation.mp4';
import './Preloader.css';

const PRELOADER_DURATION = 5000;

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    document.body.classList.add('intro-playing');
    const exitTimer = setTimeout(() => setIsLoading(false), PRELOADER_DURATION);

    return () => {
      clearTimeout(exitTimer);
      document.body.classList.remove('intro-playing');
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
            transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {!videoFailed ? (
            <video
              src={logoVideo}
              className="preloader-video"
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              onError={() => setVideoFailed(true)}
              aria-label="Cine Kandy"
            />
          ) : (
            <img
              src="/cinekandy-logo.png"
              className="preloader-logo"
              alt="Cine Kandy"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
