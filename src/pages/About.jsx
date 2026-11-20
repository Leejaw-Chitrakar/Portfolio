import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Rocket,
  Sparkles,
  Gamepad2,
  Compass,
  ArrowRight,
  Calendar,
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

      {/* ── Journey So Far — Alternating Interactive Timeline ── */}
      <div className="experience-timeline">
        <div className="timeline-header-row">
          <div className="timeline-header-badge">
            <Sparkles size={14} style={{ color: "var(--accent)" }} />
            <span>Milestones &amp; Evolution</span>
          </div>
          <motion.h3
            className="sub-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            Journey So Far
          </motion.h3>
          <p className="timeline-header-sub">
            Key steps, academic foundations, and production software built along the way.
          </p>
        </div>

        <div className="timeline-container" ref={timelineRef}>
          {/* Animated central glowing scroll progress beam & track */}
          <div className="timeline-track" />
          <motion.div className="timeline-progress-bar" style={{ scaleY }} />

          <div className="timeline-list">
            {sortedMilestones.map((item, index) => {
              const isLeft = index % 2 === 0;
              const stepNumber = String(index + 1).padStart(2, "0");

              // Derive Category, Icon, and Color Class (strictly configured per milestone)
              const category = item.category || "Key Milestone";
              let IconComp = Sparkles;
              let colorCls = "meta-primary";
              let hasProjectLink = false;

              if (category === "Education & Degree") {
                IconComp = GraduationCap;
                colorCls = "meta-blue";
              } else if (category === "Project Launch") {
                IconComp = Rocket;
                colorCls = "meta-emerald";
                hasProjectLink = true;
              } else if (category === "Early Exploration") {
                IconComp = Gamepad2;
                colorCls = "meta-amber";
              } else if (category === "Industry Experience") {
                IconComp = Compass;
                colorCls = "meta-purple";
              } else {
                IconComp = Sparkles;
                colorCls = "meta-primary";
              }

              // Determine target link
              const targetLink = item.link && item.link.trim() ? item.link.trim() : (hasProjectLink ? "/projects" : null);
              const isExternalLink = targetLink && (targetLink.startsWith("http://") || targetLink.startsWith("https://"));

              // Extract Relevant Tech Tags (Requirement 3)
              const knownKeywords = [
                "React", "Node.js", "Firebase", "JavaScript", "Vite", "MongoDB",
                "MERN", "Express", "GSAP", "C++", "C", "HTML", "CSS", "SaaS",
                "E-Commerce", "REST APIs", "Firestore", "Split Billing", "Khata"
              ];
              const rawText = `${item.title || ""} ${item.desc || ""}`;
              const techTags = (item.tags && Array.isArray(item.tags))
                ? item.tags
                : knownKeywords.filter((kw) => {
                    const regex = new RegExp(`\\b${kw.replace("+", "\\+")}\\b`, "i");
                    return regex.test(rawText);
                  }).slice(0, 4);

              return (
                <motion.div
                  className={`timeline-row ${isLeft ? "row-left" : "row-right"}`}
                  key={item.id || index}
                  initial={{ opacity: 0, x: isLeft ? -35 : 35, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: 0.04 }}
                >
                  {/* Central Spine Node with Category Icon */}
                  <div className="timeline-spine-node" title={category}>
                    <div className={`timeline-node-halo ${colorCls}`} />
                    <div className={`timeline-node-core ${colorCls}`}>
                      <IconComp size={19} className="node-icon" />
                    </div>
                  </div>

                  {/* Horizontal Connector Branch linking Node directly to Card */}
                  <div className={`timeline-branch ${isLeft ? "branch-left" : "branch-right"} ${colorCls}`} />

                  {/* Glassmorphic Milestone Card */}
                  <div className="timeline-card glass">
                    {/* Glowing Accent Top Bar */}
                    <div className={`card-glow-bar ${colorCls}`} />

                    {/* Card Header: Category Badge + Date Pill */}
                    <div className="milestone-card-header">
                      <span className={`milestone-category-badge ${colorCls}`}>
                        <IconComp size={13} />
                        <span>{category}</span>
                      </span>
                      <span className="milestone-date-pill">
                        <Calendar size={12} />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    {/* Milestone Title */}
                    <h4 className="milestone-card-title">{item.title}</h4>

                    {/* Milestone Description */}
                    <p className="milestone-card-desc">{item.desc}</p>

                    {/* Tech Badges (Requirement 3) */}
                    {techTags.length > 0 && (
                      <div className="milestone-tags-row">
                        {techTags.map((tech, tIdx) => (
                          <span key={tIdx} className="milestone-tech-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Link */}
                    {targetLink && (
                      <div className="milestone-footer-row">
                        {isExternalLink ? (
                          <a href={targetLink} target="_blank" rel="noopener noreferrer" className="milestone-link-btn">
                            <span>Explore Project</span>
                            <ArrowRight size={13} />
                          </a>
                        ) : (
                          <Link to={targetLink} className="milestone-link-btn">
                            <span>Explore in Projects</span>
                            <ArrowRight size={13} />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
