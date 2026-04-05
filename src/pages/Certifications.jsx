import React, { useState, useEffect } from "react";
import { Award, ExternalLink, CalendarDays, X, ChevronRight, Verified } from "lucide-react";
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
    title: "Certificate of Appreciation – Lakshayrambh",
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
    logo: "https://i.postimg.cc/Xvcsq3xN/Red-Hat.pngng",
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
    title: "Project Management",
    issuer: "Skill Lab",
    date: "Oct 2025",
    credentialUrl: "https://i.postimg.cc/zvsQDHPg/Project-Management.png",
    logo: "https://i.postimg.cc/3wMqWtTZ/SKill-Lab.png",
  },
];

// Grouping into sets of 3 for the Multi-Stack Grid
const stackedCerts = [
  {
    id: "stack-1",
    category: "Tech & Development",
    theme: "theme-blue",
    certs: [certifications[0], certifications[5], certifications[6]],
  },
  {
    id: "stack-2",
    category: "Leadership & Management",
    theme: "theme-purple",
    certs: [certifications[4], certifications[7], certifications[8]],
  },
  {
    id: "stack-3",
    category: "Community & Awards",
    theme: "theme-emerald",
    certs: [certifications[2], certifications[1], certifications[3]],
  },
];

const Certifications = () => {
  const [selectedStack, setSelectedStack] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setFullscreenImage(null);
        setSelectedStack(null);
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Prevent scrolling when either modal is open
    if (selectedStack || fullscreenImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [selectedStack, fullscreenImage]);

  return (
    <>
      <div className="certs-page container section fade-in">
        <div className="section-header">
          <h2 className="gradient-text">Certifications</h2>
          <p>Credentials &amp; courses shaping my technical journey</p>
        </div>

        <div className="multi-stack-grid">
          {stackedCerts.map((stack) => (
            <div 
              className={`cert-stack-column ${stack.theme}`} 
              key={stack.id}
              onClick={() => setSelectedStack(stack)}
            >
              <div className="stack-header">
                <h3>{stack.category}</h3>
                <span className="view-all-text">View Stack <ChevronRight size={16} /></span>
              </div>
              
              <div className="cert-stack-container">
                {stack.certs.map((cert, index) => (
                  <div className="stack-card glass-high-end" key={index}>
                    <div className="stack-card-inner">
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Overlay / Full Teaser List */}
      {selectedStack && (
        <div className="cert-modal-overlay" onClick={() => setSelectedStack(null)}>
          <button className="global-modal-close" onClick={() => setSelectedStack(null)}>
            <X size={32} />
          </button>

          <div className="cert-modal-scroll-area" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-content">
              <h2 className="modal-stack-title text-gradient">{selectedStack.category} Credentials</h2>
              <div className="modal-gallery-grid">
                {selectedStack.certs.map((cert, idx) => {
                  const hasLink = cert.credentialUrl && cert.credentialUrl !== "#";
                  return (
                    <div key={idx} className="modal-gallery-item glass-high-end">
                      <img src={cert.credentialUrl} alt={cert.title} className="modal-cert-image" />
                      <div className="modal-cert-info">
                        <h4>{cert.title}</h4>
                        <p>{cert.issuer} • {cert.date}</p>
                        {hasLink && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullscreenImage(cert);
                            }} 
                            className="btn btn-outline btn-sm"
                          >
                            <ExternalLink size={14} /> View Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

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
