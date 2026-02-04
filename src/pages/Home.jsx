import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Terminal, Sparkles, Zap, Layers } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const [text, setText] = useState('');
  const fullText = "Full-Stack Web Developer";
  const [index, setIndex] = useState(0);

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
            I'm a passionate developer who loves turning ideas into clean, 
            interactive, and user-friendly web experiences. Currently 
            building 3D showcases and expanding my frontend skills.
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
            <h2 className="gradient-text">3+</h2>
            <p>Years Experience</p>
          </div>
          <div className="stat-line"></div>
          <div className="stat-item">
            <h2 className="gradient-text">50+</h2>
            <p>Projects Delivered</p>
          </div>
          <div className="stat-line"></div>
          <div className="stat-item">
            <h2 className="gradient-text">25+</h2>
            <p>Satisfied Clients</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
