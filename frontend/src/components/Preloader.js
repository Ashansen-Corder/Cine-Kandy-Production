import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const PRELOADER_DURATION = 1500;
const PRELOADER_STORAGE_KEY = 'cinekandy-intro-played';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return sessionStorage.getItem(PRELOADER_STORAGE_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!isLoading) return undefined;

    try {
      sessionStorage.setItem(PRELOADER_STORAGE_KEY, 'true');
    } catch {
      // Session storage can be unavailable in private browsing.
    }
    document.body.classList.add('intro-playing');
    const exitTimer = setTimeout(() => setIsLoading(false), PRELOADER_DURATION);

    return () => {
      clearTimeout(exitTimer);
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
            transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default Preloader;
