import React from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import "../styles/About.css";

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
            src="https://i.postimg.cc/pdMD8NWc/B7A2955.jpg"
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
            Hi, I'm <strong>Leejaw Chitrakar</strong> — a highly motivated and
            detail-oriented Web Developer based in Kathmandu, Nepal. I love
            turning ideas into clean, interactive, and user-friendly web
            experiences, building things from scratch and understanding how
            everything works under the hood.
          </p>
          <p>
            I'm proficient in HTML and CSS, with intermediate skills in
            JavaScript, React, C, and C++. I'm actively expanding my skills in
            the MERN stack (MongoDB, Express, React, Node.js) and am passionate
            about responsive design, RESTful APIs, and continuous learning.
          </p>
          <div className="contact-info-list">
            <div className="contact-info-item">
              <Mail size={16} color="var(--primary)" />
              <span>leejaw.chitrakar10@gmail.com</span>
            </div>
            <div className="contact-info-item">
              <Phone size={16} color="var(--secondary)" />
              <span>9841996363</span>
            </div>
            <div className="contact-info-item">
              <MapPin size={16} color="var(--accent)" />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-grid secondary">
        <div className="about-stats">
          <div className="stat-card glass">
            <Briefcase size={32} color="var(--primary)" />
            <div className="stat-info">
              <h4>Role</h4>
              <p>Web Developer</p>
              <span>MERN Stack &amp; Frontend</span>
            </div>
          </div>

          <div className="stat-card glass">
            <GraduationCap size={32} color="var(--secondary)" />
            <div className="stat-info">
              <h4>Education</h4>
              <p>BSc.CSIT Student</p>
              <span>Tribhuvan University — 2024–Present</span>
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
              <h4>MERN Stack E-Commerce Project</h4>
              <span className="timeline-date">Present</span>
              <p>
                Built a fully functional MERN stack commerce site supporting
                local businesses, with secure user authentication and robust
                state management.
              </p>
            </div>
          </div>
          <div className="timeline-item glass">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Kaaputale E-Commerce Site</h4>
              <span className="timeline-date">Present</span>
              <p>
                Developed a responsive e-commerce platform using ReactJS with a
                focus on optimized UX and clean design across all devices.
              </p>
            </div>
          </div>
          <div className="timeline-item glass">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Interactive Games — Quiz &amp; Hangman</h4>
              <span className="timeline-date">Discovery Phase</span>
              <p>
                Created interactive browser games showcasing core JavaScript
                logic, programming concepts, and user engagement.
              </p>
            </div>
          </div>
          <div className="timeline-item glass">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>BSc.CSIT — Tribhuvan University</h4>
              <span className="timeline-date">2024</span>
              <p>
                Started Bachelor of Science in Computer Science and Information
                Technology at Kathmandu, Ason Ward 25, Bagmati Province.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
