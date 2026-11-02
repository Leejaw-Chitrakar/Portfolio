import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Sparkles, Zap, Layers, CalendarDays, MapPin, Users } from 'lucide-react';
import { subscribeCollection, defaultEvents } from '../services/portfolioService';
import '../styles/Home.css';

const Home = () => {
  const [text, setText] = useState('');
  const fullText = "Full-Stack Web Developer";
  const [index, setIndex] = useState(0);
  const [events, setEvents] = useState(defaultEvents);

  useEffect(() => {
    const unsubscribe = subscribeCollection("events", (data) => {
      if (data && data.length > 0) {
        setEvents(data);
      }
    }, defaultEvents);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div className="home-container fade-in">
      {/* Animated Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <section className="hero-section container">
        <div className="hero-content">
          <div className="badge glass">
            <Sparkles size={14} className="sparkle-icon" />
            <span>Available for new projects</span>
          </div>
          
          <h1 className="hero-title">
            Designing <span className="gradient-text">Exceptional</span> <br />
            Digital Experiences
          </h1>

          <div className="typewriter">
            <Terminal size={20} className="terminal-icon" />
            <span className="typewritten-text">{text}</span>
            <span className="cursor">|</span>
          </div>

          <p className="hero-description">
            I'm Leejaw Chitrakar — a passionate developer based in Kathmandu, Nepal, 
            who loves turning ideas into clean, interactive, and user-friendly web experiences. 
            Currently studying BSc.CSIT and building impactful MERN stack projects.
          </p>

          <div className="hero-actions">
            <NavLink to="/projects" className="btn btn-primary">
              Explore Projects <ArrowRight size={18} />
            </NavLink>
            <NavLink to="/contact" className="btn btn-outline">
              Let's Talk
            </NavLink>
          </div>
        </div>

        <div className="hero-visual-wrapper">
          <div className="floating-elements">
            <div className="floating-card glass card-1">
              <Zap size={24} color="#f59e0b" />
              <span>Fast Performance</span>
            </div>
            <div className="floating-card glass card-2">
              <Layers size={24} color="#ec4899" />
              <span>Scalable Architecture</span>
            </div>
          </div>
          <div className="hero-main-visual glass">
            <div className="code-snippet">
              <pre>
                <code>
                  <span className="code-keyword">const</span> <span className="code-name">developer</span> = &#123;<br />
                  &nbsp;&nbsp;name: <span className="code-string">'Leejaw Chitrakar'</span>,<br />
                  &nbsp;&nbsp;role: <span className="code-string">'Web Developer'</span>,<br />
                  &nbsp;&nbsp;location: <span className="code-string">'Kathmandu, Nepal'</span>,<br />
                  &nbsp;&nbsp;passion: <span className="code-string">'Clean Code'</span><br />
                  &#125;;
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container stats-glass glass">
          <div className="stat-item">
            <h2 className="gradient-text">8+</h2>
            <p>Projects Built</p>
          </div>
          <div className="stat-line"></div>
          <div className="stat-item">
            <h2 className="gradient-text">MERN</h2>
            <p>Stack Expertise</p>
          </div>
          <div className="stat-line"></div>
          <div className="stat-item">
            <h2 className="gradient-text">2024</h2>
            <p>BSc.CSIT Started</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section container">
        <motion.div
          className="events-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="gradient-text">Events I've Been Around</h2>
          <p>Workshops, industry visits, and community initiatives I've participated in or facilitated.</p>
        </motion.div>

        <div className="events-grid">
          {events.map((event, i) => (
            <motion.div
              className="event-card glass"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="event-card-top">
                <span className={`event-tag tag-${event.tagColor}`}>{event.tag}</span>
                <span className="event-role">{event.role}</span>
              </div>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-desc">{event.desc}</p>
              <div className="event-meta">
                <div className="event-meta-item">
                  <CalendarDays size={14} />
                  <span>{event.date}</span>
                </div>
                <div className="event-meta-item">
                  <MapPin size={14} />
                  <span>{event.venue}</span>
                </div>
                <div className="event-meta-item">
                  <Users size={14} />
                  <span>{event.attendees}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
