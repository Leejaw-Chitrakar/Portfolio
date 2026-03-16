import React from "react";
import { GraduationCap, Award, Code2 } from "lucide-react";
import "../styles/Resume.css";

const Resume = () => {
  return (
    <div className="resume-page container section fade-in">
      <div className="section-header">
        <h2 className="gradient-text">My Resume</h2>
        <p>Professional summary and technical background</p>
      </div>

      <div className="resume-content glass">
        <div className="resume-main">
          <section className="resume-section">
            <h3>Professional Summary</h3>
            <p>
              Highly motivated and detail-oriented Web Developer seeking to
              leverage foundational skills in C, C++, HTML, and CSS to build
              functional and responsive interfaces. Eager to contribute to
              dynamic projects while expanding practical experience with
              JavaScript and React.
            </p>
          </section>

          <section className="resume-section">
            <h3>Projects</h3>

            <div className="experience-item">
              <div className="exp-header">
                <h4>MERN Stack E-Commerce Project</h4>
                <span>2024 – Present</span>
              </div>
              <p className="exp-company">
                <a
                  href="https://github.com/Leejaw-Chitrakar/MERN-PROJECT"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Leejaw-Chitrakar/MERN-PROJECT
                </a>
              </p>
              <ul>
                <li>
                  Built a fully functional MERN stack commerce site to support
                  local businesses.
                </li>
                <li>
                  Implemented secure user authentication flows demonstrating
                  full-stack capability.
                </li>
                <li>
                  Utilized MongoDB, Express/Node.js for backend API and React
                  for the frontend.
                </li>
              </ul>
            </div>

            <div className="experience-item">
              <div className="exp-header">
                <h4>Kaaputale E-Commerce Site</h4>
                <span>2024 – Present</span>
              </div>
              <p className="exp-company">
                <a
                  href="https://github.com/Leejaw-Chitrakar/Kaaputale"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Leejaw-Chitrakar/Kaaputale
                </a>
              </p>
              <ul>
                <li>
                  Developed an e-commerce platform focused on optimized UX and
                  clean, responsive design.
                </li>
                <li>
                  Ensured complete responsive functionality across mobile,
                  tablet, and desktop.
                </li>
                <li>
                  Built exclusively using ReactJS for component state and UI
                  management.
                </li>
              </ul>
            </div>

            <div className="experience-item">
              <div className="exp-header">
                <h4>Quiz Game &amp; Hangman</h4>
                <span>Discovery Phase</span>
              </div>
              <p className="exp-company">
                <a
                  href="https://github.com/Leejaw-Chitrakar/Quiz-Game"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quiz Game
                </a>
                &nbsp;|&nbsp;
                <a
                  href="https://github.com/Leejaw-Chitrakar/Hangman"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hangman
                </a>
              </p>
              <ul>
                <li>
                  Showcases interactive logic and core JavaScript
                  implementation.
                </li>
                <li>
                  Demonstrates core programming concepts and game logic
                  implementation.
                </li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h3>Certifications &amp; Training</h3>

            <div className="experience-item">
              <div className="exp-header">
                <h4>Project Management Certificate</h4>
                <span>October 2025</span>
              </div>
              <p className="exp-company">Skilllab</p>
              <ul>
                <li>
                  Mastered principles of project initiation, planning,
                  execution, and closing.
                </li>
                <li>
                  Trained in task management, resource allocation, and
                  maintaining project scope.
                </li>
              </ul>
              <p className="exp-company">
                <a
                  href="https://1drv.ms/b/c/e932a4b4043f333d/IQBe-LubboSBSYHdN5zqWgqNAQ2xHthcxBQhjnia_5HApv8?e=CJlgaz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Certificate ↗
                </a>
              </p>
            </div>

            <div className="experience-item">
              <div className="exp-header">
                <h4>Red Hat Academy – Linux Fundamentals</h4>
                <span>Completed</span>
              </div>
              <p className="exp-company">Red Hat Academy</p>
              <ul>
                <li>
                  Focused on command-line proficiency, file system management,
                  and server environments.
                </li>
                <li>
                  Provides a strong foundation for deploying and managing web
                  applications.
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div className="resume-side">
          <section className="resume-section">
            <h3>Top Skills</h3>
            <div className="skill-tags">
              <span className="skill-tag">HTML5</span>
              <span className="skill-tag">CSS3</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">React</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Express.js</span>
              <span className="skill-tag">MongoDB</span>
              <span className="skill-tag">Git &amp; GitHub</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">C / C++</span>
              <span className="skill-tag">Responsive Design</span>
            </div>
          </section>

          <section className="resume-section">
            <h3>Education</h3>
            <div className="edu-item">
              <h4>BSc. Computer Science &amp; IT</h4>
              <p>Tribhuvan University</p>
              <span>2024 – Present</span>
              <p style={{ fontSize: "0.8rem", marginTop: "4px", opacity: 0.7 }}>
                Kathmandu, Ason Ward 25, Bagmati Province, Nepal
              </p>
            </div>
          </section>

          <section className="resume-section">
            <h3>Contact</h3>
            <div className="edu-item">
              <p>leejaw.chitrakar10@gmail.com</p>
              <p>9841996363</p>
              <p>Kathmandu, Nepal</p>
              <a
                href="https://github.com/Leejaw-Chitrakar"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--primary)" }}
              >
                github.com/Leejaw-Chitrakar
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resume;
