import React, { useState, useEffect } from 'react';
import './TimelineConnector.css';

const TimelineConnector = ({ cardCount = 6 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Ensure component renders after DOM is ready
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Create a simple S-curve path that spans the full height
  const pathData = `
    M 50%, 0
    Q 30%, 15%, 50%, 25%
    Q 70%, 35%, 50%, 45%
    Q 30%, 55%, 50%, 65%
    Q 70%, 75%, 50%, 85%
    Q 30%, 92%, 50%, 100%
  `;

  if (!show) return null;

  return (
    <svg
      className="timeline-connector"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <defs>
        <filter id="glowEffect">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathData}
        stroke="white"
        strokeWidth="0.5"
        fill="none"
        strokeDasharray="2, 2"
        filter="url(#glowEffect)"
        className="connector-path"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
};

export default TimelineConnector;
