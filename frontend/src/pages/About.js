import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Camera, Heart } from 'lucide-react';
import './About.css';

const About = () => {
  const team = [
    {
      name: 'Saman Perera',
      role: 'Lead Photographer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
    },
    {
      name: 'Nimal Silva',
      role: 'Videographer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
    },
    {
      name: 'Kasun Fernando',
      role: 'Editor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
    }
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Capturing life's beautiful moments since 2016</p>
      </div>

      <div className="container section">
        <div className="about-content">
          <h2 className="section-title">Our Story</h2>
          <p className="about-text">
            Cine Kandy Films was founded with a passion for capturing life's most precious moments.
            Based in the beautiful city of Kandy, Sri Lanka, we specialize in wedding photography,
            event coverage, and cinematic videography.
          </p>

          <div className="values-grid">
            {[
              { icon: <Camera />, title: 'Quality', desc: 'Premium equipment and techniques' },
              { icon: <Heart />, title: 'Passion', desc: 'We love what we do' },
              { icon: <Users />, title: 'Experience', desc: '8+ years in the industry' },
              { icon: <Award />, title: 'Excellence', desc: 'Award-winning work' }
            ].map((value, i) => (
              <motion.div key={i} className="value-card" whileHover={{ y: -10 }}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, i) => (
              <motion.div key={i} className="team-card" whileHover={{ scale: 1.05 }}>
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
