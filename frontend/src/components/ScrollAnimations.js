import React, { useEffect } from 'react';
import { initScrollAnimations, useScrollProgress } from '../hooks/useScrollParallax';

/**
 * ScrollAnimationProvider - Add to App.js to enable global scroll animations
 * Automatically animates any element with data-scroll attribute
 */
export const ScrollAnimationProvider = ({ children }) => {
  useEffect(() => {
    // Initialize scroll animations
    const cleanup = initScrollAnimations();
    
    // Re-observe on DOM changes (for route changes)
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-scroll]:not(.is-visible)').forEach((el) => {
        const scrollObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.scrollDelay) || 0;
                setTimeout(() => {
                  entry.target.classList.add('is-visible');
                }, delay);
                scrollObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
        );
        scrollObserver.observe(el);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);
  
  return <>{children}</>;
};

/**
 * ScrollProgressBar - Shows reading progress at the top of the page
 */
export const ScrollProgressBar = () => {
  const progress = useScrollProgress();
  
  return (
    <div 
      className="scroll-progress" 
      style={{ width: `${progress}%` }}
    />
  );
};

/**
 * ScrollReveal Component - Wrapper for scroll animations
 * @param {string} animation - Animation type: fade-up, fade-down, fade-left, fade-right, zoom-in, zoom-out, blur-up, rotate-up, split-up, clip-left, clip-right, clip-up, slide-up, flip-up, bounce-in
 * @param {string} duration - Animation speed: fast, normal, slow, slower
 * @param {string} easing - Easing function: ease, ease-out, ease-in-out, bounce, smooth
 * @param {number} delay - Delay in milliseconds before animation
 */
export const ScrollReveal = ({ 
  children, 
  animation = 'fade-up',
  duration = 'normal',
  easing = 'ease-out',
  delay = 0,
  className = '',
  ...props 
}) => {
  return (
    <div
      data-scroll={animation}
      data-scroll-duration={duration}
      data-scroll-easing={easing}
      data-scroll-delay={delay}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * StaggeredContainer - Container that staggers children animations
 */
export const StaggeredContainer = ({ 
  children, 
  animation = 'fade-up',
  staggerDelay = 100,
  className = '',
  ...props 
}) => {
  return (
    <div
      data-scroll={animation}
      className={className}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <div 
          data-scroll-item
          data-scroll-item-delay={index * staggerDelay}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * ImageReveal - Image with reveal animation
 */
export const ImageReveal = ({ 
  src, 
  alt = '', 
  className = '',
  ...props 
}) => {
  return (
    <div data-scroll="fade-up" className={`image-reveal ${className}`} {...props}>
      <img src={src} alt={alt} />
    </div>
  );
};

/**
 * TextReveal - Text with character-by-character reveal
 */
export const TextReveal = ({ 
  children, 
  className = '',
  tag: Tag = 'span',
  ...props 
}) => {
  const text = typeof children === 'string' ? children : '';
  
  return (
    <Tag data-scroll="fade-up" className={`text-reveal ${className}`} {...props}>
      {text.split('').map((char, index) => (
        <span key={index} className="char" style={{ transitionDelay: `${index * 30}ms` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
};

export default ScrollAnimationProvider;
