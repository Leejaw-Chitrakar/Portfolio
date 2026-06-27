import React, { useState, useEffect } from "react";
import { Award, ExternalLink, CalendarDays, X, Verified } from "lucide-react";
import "../styles/Certifications.css";

const certifications = [
  {
    title: "Web Development Bootcamp",
    issuer: "Samriddhi IT Club",
    date: "July 2025",
    credentialUrl: "https://i.postimg.cc/LXNbsRvP/Bootcamp.png",
    logo: "https://i.postimg.cc/T2QBQjVT/Samriddhi-Logo.png",
  },
  {
    title: "Hult Prize Participation",
    issuer: "Hult Prize Foundation",
    date: "Feb 2025",
    credentialUrl: "https://i.postimg.cc/j5ZFjKvw/Hult_Participation.png",
    logo: "https://i.postimg.cc/cCXqnwmY/Hult-Logo.png",
  },
  {
    title: "Web & Tech Team - Hult Prize",
    issuer: "Hult Prize Samriddhi",
    date: "Feb 2026",
    credentialUrl: "https://i.postimg.cc/1XXYnTYV/Hult_Web_Tech.png",
    logo: "https://i.postimg.cc/cCXqnwmY/Hult-Logo.png",
  },
  {
    title: "Certificate of Appreciation – Lakshayrambha",
    issuer: "CSIT Association of Nepal",
    date: "June 2025",
    credentialUrl: "https://i.postimg.cc/0jjHM3HG/Lakshyaarambha.png",
    logo: "https://i.postimg.cc/pL0NTfTM/CSITAN.png",
  },
  {
    title: "Project Management Certificate",
    issuer: "Skill Lab",
    date: "Oct 2025",
    credentialUrl: "https://i.postimg.cc/qqqZhYZh/Project_Management.jpg",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
  },
  {
    title: "Linux Fundamentals (RH104)",
    issuer: "Red Hat Academy",
    date: "March 2025",
    credentialUrl: "https://i.postimg.cc/qRj570Q2/Redhat.jpg",
    logo: "https://i.postimg.cc/Xvcsq3xN/Red-Hat.png",
  },
  {
    title: "AI and Prompt Engineering",
    issuer: "Skill Lab",
    date: "Dec 2025",
    credentialUrl: "https://i.postimg.cc/yxMG63rg/AI-Prompting.png",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
  },
  {
    title: "Leadership Basic Course",
    issuer: "Skill Lab",
    date: "Dec 2025",
    credentialUrl: "https://i.postimg.cc/1XnTZrM9/Leadership-Basic.png",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
  },
  {
    title: "Portfolio Website Essentials",
    issuer: "CSIT Association of Nepal",
    date: "2026",
    credentialUrl: "https://i.postimg.cc/s22M8y1m/portfolio-website-essentials-2026.png",
    logo: "https://i.postimg.cc/pL0NTfTM/CSITAN.png",
  },
];

const themes = ["theme-blue", "theme-purple", "theme-emerald"];

const Certifications = () => {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setFullscreenImage(null);
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Prevent scrolling when modal is open
    if (fullscreenImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [fullscreenImage]);

  return (
    <>
      <div className="certs-page container section fade-in">
        <div className="section-header">
          <h2 className="gradient-text">Certifications</h2>
          <p>Credentials &amp; courses shaping my technical journey</p>
        </div>

        <div className="certifications-content">
          <div className="cert-grid">
            {certifications.map((cert, index) => {
              const themeClass = themes[index % 3];
              return (
                <div 
                  className={`cert-card glass-high-end ${themeClass}`} 
                  key={index}
                  onClick={() => {
                    if (cert.credentialUrl && cert.credentialUrl !== "#") {
                      setFullscreenImage(cert);
                    }
                  }}
                >
                  <div className="cert-card-inner">
                    <div className="verified-badge">
                      <Verified size={16} /> Verified
                    </div>

                    {/* Issuer Logo */}
                    <div className="cert-logo-wrap">
                      <img src={cert.logo} alt={cert.issuer} className="cert-logo" />
                    </div>

                    <h3 className="cert-title">{cert.title}</h3>
                    <p className="cert-issuer">{cert.issuer}</p>

                    <div className="cert-date">
                      <CalendarDays size={14} />
                      <span>{cert.date}</span>
                    </div>

                    {cert.credentialUrl && cert.credentialUrl !== "#" && (
                      <div className="view-cert-overlay">
                        <ExternalLink size={24} />
                        <span>View Certificate</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fullscreen Canvas Modal for Individual Certificate */}
      {fullscreenImage && (
        <div className="fullscreen-canvas-overlay" onClick={() => setFullscreenImage(null)}>
          <button 
            className="global-modal-close global-modal-close-canvas" 
            onClick={() => setFullscreenImage(null)}
          >
            <X size={32} />
          </button>

          <div className="cert-modal-scroll-area" onClick={(e) => e.stopPropagation()}>
            <div className="fullscreen-canvas-content">
              <img 
                src={fullscreenImage.credentialUrl} 
                alt={fullscreenImage.title} 
                className="canvas-image" 
              />
              <div className="canvas-details">
                <h3>{fullscreenImage.title}</h3>
                <p>{fullscreenImage.issuer}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Certifications;
