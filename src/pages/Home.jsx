import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  Zap, 
  Layers, 
  MapPin, 
  Users, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  Camera,
  Calendar,
} from 'lucide-react';
import { subscribeCollection, defaultEvents } from '../services/portfolioService';
import '../styles/Home.css';

const Home = () => {
  const [text, setText] = useState('');
  const fullText = "Full-Stack Web Developer";
  const [index, setIndex] = useState(0);
  const [events, setEvents] = useState(defaultEvents);
  const [showEventsSection, setShowEventsSection] = useState(true);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeCollection("events", (data) => {
      if (data && data.length > 0) {
        // Read section-level setting if present
        const settingsDoc = data.find(d => d.id === "_settings");
        if (settingsDoc && typeof settingsDoc.showEventsSection === "boolean") {
          setShowEventsSection(settingsDoc.showEventsSection);
        }

        // Filter out _settings and _theme, and map events
        const actualEvents = data.filter(d => d.id !== "_settings" && d.id !== "_theme");

        const merged = actualEvents.map((ev, i) => {
          const defaultMatch = defaultEvents.find(
            d => (d.order && ev.order && Number(d.order) === Number(ev.order)) ||
                 (d.title && ev.title && d.title.toLowerCase().trim() === ev.title.toLowerCase().trim())
          ) || defaultEvents[i] || {};

          return {
            ...defaultMatch,
            ...ev,
            visible: ev.visible !== undefined ? ev.visible : (defaultMatch.visible !== undefined ? defaultMatch.visible : true),
            polaroidNote: ev.polaroidNote || defaultMatch.polaroidNote || ev.title,
            image: ev.image || defaultMatch.image || ev.fallback || defaultMatch.fallback,
            rotation: ev.rotation || defaultMatch.rotation
          };
        })
        .filter(ev => ev.visible !== false) // Only display visible events
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

        setEvents(merged);
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

  /* Keyboard controls & body scroll locking for lightbox */
  useEffect(() => {
    if (activeLightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setActiveLightboxIndex(null);
        if (e.key === 'ArrowRight') {
          setActiveLightboxIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0));
        }
        if (e.key === 'ArrowLeft') {
          setActiveLightboxIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [activeLightboxIndex, events.length]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        // Swipe left -> next
        setActiveLightboxIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0));
      } else {
        // Swipe right -> prev
        setActiveLightboxIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
      }
    }
    setTouchStartX(null);
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [events]);

  const currentEvent = activeLightboxIndex !== null ? sortedEvents[activeLightboxIndex] : null;

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

      {/* =====================================================================
           POLAROID MOMENT GALLERY SECTION (Interactive Moments & Lightbox)
      ====================================================================== */}
      {showEventsSection && events.length > 0 && (
        <section className="events-section container" id="polaroid-events">
          <motion.div
            className="polaroid-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="header-info">
              <span className="moments-badge">
                <Camera size={13} />
                <span>Milestones &amp; Moments</span>
              </span>
              <h2 className="gradient-text">Captured Along the Way</h2>
              <p>
                Snapshots from workshops, tech visits, hackathons, and community initiatives. Click any Polaroid for the full story.
              </p>
            </div>
            <div className="header-tip-col">
              <div className="header-tip">
                Tip: <span>Click any photo for fullscreen lightbox</span>
              </div>
            </div>
          </motion.div>

          {/* Polaroid Cards Grid */}
          <div className="polaroid-grid">
            {sortedEvents.map((event, i) => {
              const tiltClasses = ["tilt-n2", "tilt-p2", "tilt-n1", "tilt-p3", "tilt-n2", "tilt-p1"];
              const tiltClass = tiltClasses[i % tiltClasses.length];

              const displayImage = event.image || event.fallback || "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80";
              const fallbackImage = event.fallback || "https://placehold.co/800x600/1e293b/fbbf24?text=Event+Snapshot";

              return (
                <motion.figure
                  key={event.id || i}
                  className={`polaroid-card ${tiltClass}`}
                  onClick={() => setActiveLightboxIndex(i)}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {/* Instant Film Frame */}
                  <div className="polaroid-photo-frame">
                    <img
                      src={displayImage}
                      alt={event.title}
                      className="polaroid-photo"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                    {/* Subtle warm vintage film tint */}
                    <div className="polaroid-vintage-tint"></div>
                    
                    {/* Date Badge */}
                    <span className="polaroid-date-badge">
                      {event.date}
                    </span>
                    
                    {/* Tag Badge */}
                    {event.tag && (
                      <span className={`polaroid-tag-badge tag-${event.tagColor || 'primary'}`}>
                        {event.tag}
                      </span>
                    )}
                  </div>

                  {/* Handwritten Caption & Venue */}
                  <figcaption className="polaroid-caption">
                    <p className="polaroid-note">
                      {event.polaroidNote || event.title}
                    </p>
                    
                    <div className="polaroid-footer">
                      <span className="polaroid-venue" title={event.venue}>
                        <MapPin size={12} /> {event.venue}
                      </span>
                      <span className="polaroid-story-pill">
                        View Story <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
           FULLSCREEN POLAROID LIGHTBOX VIEWER (Mounted to Portal)
      ====================================================================== */}
      {activeLightboxIndex !== null && currentEvent && createPortal(
        <div
          className="polaroid-lightbox-backdrop"
          onClick={() => setActiveLightboxIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Event Snapshot Lightbox"
        >
          {/* Lightbox Shell Container */}
          <div className="polaroid-lightbox-shell" onClick={(e) => e.stopPropagation()}>
            
            {/* Top Bar: Counter & Close Button */}
            <div className="lightbox-topbar">
              <span className="lightbox-counter">
                {activeLightboxIndex + 1} / {events.length}
              </span>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setActiveLightboxIndex(null)}
                aria-label="Close Lightbox"
              >
                <span>Close (Esc)</span>
                <X size={16} />
              </button>
            </div>

            {/* Stage: Prev Button + Photo + Story + Next Button */}
            <div className="lightbox-stage">
              <button
                type="button"
                className="lightbox-nav-btn prev-btn"
                onClick={() => setActiveLightboxIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1))}
                aria-label="Previous snapshot"
              >
                <ChevronLeft size={28} />
              </button>

              <div className="lightbox-content-box">
                <div className="lightbox-image-wrapper">
                  <img
                    src={currentEvent.image || currentEvent.fallback || "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"}
                    alt={currentEvent.title}
                    className="lightbox-main-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = currentEvent.fallback || "https://placehold.co/800x600/1e293b/fbbf24?text=Event+Snapshot";
                    }}
                  />
                </div>

                <div className="lightbox-details">
                  <p className="lightbox-handwritten-caption">
                    "{currentEvent.polaroidNote || currentEvent.title}"
                  </p>

                  <div className="lightbox-meta-row">
                    <span className="lightbox-event-title">{currentEvent.title}</span>
                    <span className="lightbox-dot">•</span>
                    <span className="lightbox-event-venue">{currentEvent.venue}</span>
                    <span className="lightbox-dot">•</span>
                    <span className="lightbox-event-date">{currentEvent.date}</span>
                  </div>

                  <p className="lightbox-story-text">
                    {currentEvent.desc}
                  </p>

                  <div className="lightbox-badges-row">
                    {currentEvent.role && (
                      <span className="lightbox-badge-role">
                        Role: {currentEvent.role}
                      </span>
                    )}
                    {currentEvent.attendees && (
                      <span className="lightbox-badge-attendees">
                        <Users size={12} /> {currentEvent.attendees}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="lightbox-nav-btn next-btn"
                onClick={() => setActiveLightboxIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0))}
                aria-label="Next snapshot"
              >
                <ChevronRight size={28} />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default Home;
