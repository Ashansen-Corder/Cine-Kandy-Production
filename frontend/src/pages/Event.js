import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events').then(res => setEvents(res.data));
  }, []);

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '60px', fontFamily: "'Cormorant Garamond', serif", color: '#fff' }}>Events & News</h1>
        <div style={{ width: '60px', height: '1px', background: '#C9A05D', margin: '20px auto' }}></div>
        <p style={{ letterSpacing: '2px', opacity: 0.7, fontSize: '12px' }}>STAY UPDATED WITH OUR LATEST PROJECTS AND STORIES</p>
      </section>

      {/* Events List */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {events.map((event, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '80px', display: 'flex', flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', gap: '40px', alignItems: 'center' }}
          >
            {/* Media Area */}
            <div style={{ flex: 1 }}>
              {event.mediaType === 'Video' ? (
                <iframe src={event.mediaUrl} style={{ width: '100%', height: '350px', border: '1px solid #C9A05D' }} title={event.title}></iframe>
              ) : (
                <img src={event.mediaUrl} alt={event.title} style={{ width: '100%', height: 'auto', border: '1px solid #C9A05D' }} />
              )}
            </div>

            {/* Text Area */}
            <div style={{ flex: 1, textAlign: index % 2 === 0 ? 'left' : 'right' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A05D', fontSize: '32px' }}>{event.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>{event.description}</p>
              <span style={{ fontSize: '12px', color: '#C9A05D' }}>{new Date(event.date).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;