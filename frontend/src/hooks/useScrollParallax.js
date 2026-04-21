import { useEffect, useRef, useState } from 'react';

/**
 * Premium Scroll Animation System
 * Inspired by modern portfolio websites with smooth reveals
 */

// Initialize all scroll animations on the page
export const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.scrollDelay) || 0;
        
        setTimeout(() => {
          el.classList.add('is-visible');
          
          // Animate text characters if it's a text reveal
          if (el.classList.contains('text-reveal')) {
            const chars = el.querySelectorAll('.char');
            chars.forEach((char, i) => {
              setTimeout(() => {
                char.classList.add('is-visible');
              }, i * 30);
            });
          }
          
          // Handle staggered children
          const children = el.querySelectorAll('[data-scroll-item]');
          children.forEach((child, index) => {
            const childDelay = parseInt(child.dataset.scrollItemDelay) || index * 100;
            setTimeout(() => {
              child.classList.add('is-visible');
            }, childDelay);
          });
        }, delay);
        
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  // Observe all scroll elements
  document.querySelectorAll('[data-scroll]').forEach((el) => observer.observe(el));

  return () => observer.disconnect();
};

/**
 * Hook for smooth scroll reveal animations
 */
export const useScrollReveal = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref: elementRef, isVisible };
};

/**
 * Hook to enable scroll-based parallax animations
 */
export const useScrollParallax = (options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px'
      }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return elementRef;
};

/**
 * Hook for scroll-based animations with multiple elements
 */
export const useScrollAnimations = () => {
  useEffect(() => {
    const cleanup = initScrollAnimations();
    return cleanup;
  }, []);
};

/**
 * Hook for parallax movement based on scroll position
 */
export const useParallax = (speed = 0.5) => {
  const elementRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const scrolled = window.scrollY;
        const yPos = -(scrolled * speed);
        setOffset(yPos);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref: elementRef, offset, style: { transform: `translateY(${offset}px)` } };
};

/**
 * Hook for scroll progress tracking
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};

/**
 * Hook for magnetic cursor effect on elements
 */
export const useMagneticEffect = (strength = 0.3) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = 'translate(0, 0)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
};

export default useScrollParallax;

