import React from 'react';
import { User, Briefcase, GraduationCap } from 'lucide-react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page container section fade-in">
      <div className="section-header">
        <h2 className="gradient-text">About Me</h2>
        <p>Turning complex problems into elegant solutions</p>
      </div>

      <div className="about-grid">
        <div className="about-image-container glass">
          <img 
            src="https://media.licdn.com/dms/image/v2/D5603AQEQ6scsnRP-Fw/profile-displayphoto-shrink_800_800/B56ZbzKOvuHUAk-/0/1747836268039?e=1771459200&v=beta&t=iTQlTBaONN_QqJqtFtp4a1hOIq0v5Nq6D_3IKI-Id20" 
            alt="Leejaw Chitrakar" 
            className="about-image"
          />
        </div>

        <div className="about-bio glass">
          <div className="bio-head">
            <User size={40} className="bio-icon" />
            <h3>Professional Bio</h3>
          </div>
          <p>
            Hi, I'm Leejaw Chitrakar, a passionate Web Developer who loves turning ideas 
            into clean, interactive, and user-friendly web experiences. I enjoy building 
            things from scratch and understanding how everything works under the hood.
          </p>
          <p>
            I work mainly with HTML, CSS, JavaScript, and I'm actively expanding my skills 
            in React and modern frontend tools. I care deeply about clean code, good UI/UX, 
            and continuous learning. Currently, I'm studying at Samriddhi College and 
            focused on building impactful digital products.
          </p>
        </div>
      </div>

      <div className="about-grid secondary">
        <div className="about-stats">
          <div className="stat-card glass">
            <Briefcase size={32} color="var(--primary)" />
            <div className="stat-info">
              <h4>Experience</h4>
              <p>Aspiring Web Developer</p>
              <span>Learning & Building</span>
            </div>
          </div>
          
          <div className="stat-card glass">
            <GraduationCap size={32} color="var(--secondary)" />
            <div className="stat-info">
              <h4>Education</h4>
              <p>CSIT Student</p>
              <span>Samriddhi College</span>
            </div>
          </div>
        </div>
      </div>

      <div className="experience-timeline">
        <h3 className="sub-title">Journey So Far</h3>
        <div className="timeline">
          <div className="timeline-item glass">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Kaaputale: Handcrafted Elegance</h4>
              <span className="timeline-date">Present</span>
              <p>Developed a high-end e-commerce interface with glassmorphism and Framer Motion.</p>
            </div>
          </div>
          <div className="timeline-item glass">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Fashion Verse</h4>
              <span className="timeline-date">Present</span>
              <p>Building a 3D clothing showcase using Three.js and modern frontend tools.</p>
            </div>
          </div>
          <div className="timeline-item glass">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>College Exhibition</h4>
              <span className="timeline-date">2024</span>
              <p>Developed a Bluetooth-controlled car, showcasing hardware and software integration.</p>
            </div>
          </div>
          <div className="timeline-item glass">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Interactive Games</h4>
              <span className="timeline-date">Discovery Phase</span>
              <p>Created interactive quiz games to experiment with logic and user engagement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
