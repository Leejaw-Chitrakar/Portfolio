import React from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';
import '../styles/Resume.css';

const Resume = () => {
  return (
    <div className="resume-page container section fade-in">
      <div className="section-header">
        <h2 className="gradient-text">My Resume</h2>
        <p>Professional summary and technical background</p>
      </div>

      <div className="resume-actions">
        <button className="btn btn-primary">
          Download PDF <Download size={18} />
        </button>
      </div>

      <div className="resume-content glass">
        <div className="resume-main">
          <section className="resume-section">
            <h3>Summary</h3>
            <p>
              Dedicated Web Developer with a strong focus on building high-performance 
              React applications. Extensive experience in modern frontend architectures, 
              responsive design, and backend integration. Committed to delivering 
              exceptionally clean code and superior user experiences.
            </p>
          </section>

          <section className="resume-section">
            <h3>Experience</h3>
            <div className="experience-item">
              <div className="exp-header">
                <h4>Senior Web Developer</h4>
                <span>2022 - Present</span>
              </div>
              <p className="exp-company">TechFlow Solutions</p>
              <ul>
                <li>Led the development of a flagship SaaS platform using React and Redux.</li>
                <li>Optimized application performance, reducing load times by 40%.</li>
                <li>Mentored junior developers and implemented CI/CD pipelines.</li>
              </ul>
            </div>
            
            <div className="experience-item">
              <div className="exp-header">
                <h4>Frontend Developer</h4>
                <span>2021 - 2022</span>
              </div>
              <p className="exp-company">Creative Digital Agency</p>
              <ul>
                <li>Developed interactive UI components for high-traffic e-commerce sites.</li>
                <li>Collaborated with designers to implement pixel-perfect Figma designs.</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="resume-side">
          <section className="resume-section">
            <h3>Top Skills</h3>
            <div className="skill-tags">
              <span className="skill-tag">React</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">CSS3/HTML5</span>
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">Docker</span>
              <span className="skill-tag">Git</span>
            </div>
          </section>

          <section className="resume-section">
            <h3>Education</h3>
            <div className="edu-item">
              <h4>B.Sc in Computer Science</h4>
              <p>Tech Institute of Technology</p>
              <span>2018 - 2022</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resume;
