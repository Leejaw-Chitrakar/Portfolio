import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { subscribeCollection, defaultMilestones } from "../services/portfolioService";
import "../styles/About.css";

const AnimatedCharacter = ({ children }) => (
  <motion.span
    variants={{
      hidden: { opacity: 0, display: "none" },
      visible: { opacity: 1, display: "inline" },
    }}
  >
    {children}
  </motion.span>
);

const TypewriterParagraph = ({ children, delay = 0 }) => {
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10px" }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.01, delayChildren: delay },
        },
        hidden: {},
      }}
    >
      {React.Children.toArray(children).map((child, i) => {
        if (typeof child === "string") {
          return child
            .split("")
            .map((char, index) => (
              <AnimatedCharacter key={`${i}-${index}`}>
                {char}
              </AnimatedCharacter>
            ));
        }
        if (React.isValidElement(child) && child.type === "strong") {
          return (
            <strong key={`strong-${i}`}>
              {typeof child.props.children === "string"
                ? child.props.children
                    .split("")
                    .map((char, index) => (
                      <AnimatedCharacter key={`${i}-${index}`}>
                        {char}
                      </AnimatedCharacter>
                    ))
                : child.props.children}
            </strong>
          );
        }
        return child;
      })}
    </motion.p>
  );
};

const About = () => {
  const timelineRef = useRef(null);
  const [milestones, setMilestones] = useState(defaultMilestones);

  useEffect(() => {
    const unsub = subscribeCollection("milestones", (data) => {
      if (data && data.length > 0) {
        setMilestones(data);
      } else {
        setMilestones(defaultMilestones);
      }
    }, defaultMilestones);
    return () => unsub();
  }, []);

  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [milestones]);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 70%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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
              <span>+977 9841996363</span>
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
        <div className="timeline-header-row">
          <motion.h3
            className="sub-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            Journey So Far
          </motion.h3>
        </div>

        <div className="timeline" ref={timelineRef}>
          <motion.div className="timeline-progress-bar" style={{ scaleY }} />
          {sortedMilestones.map((item, index) => (
            <motion.div
              className="timeline-item glass"
              key={item.id || index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>{item.title}</h4>
                <span className="timeline-date">{item.date}</span>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
