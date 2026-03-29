import React, { useState, useEffect } from "react";
import { Award, ExternalLink, CalendarDays, X } from "lucide-react";
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

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleEsc);
    
    // Prevent scrolling when modal is open
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [selectedCert]);

  return (
    <>
      <div className="certs-page container section fade-in">
      <div className="section-header">
        <h2 className="gradient-text">Certifications</h2>
        <p>Credentials &amp; courses that have shaped my technical journey</p>
      </div>

      <div className="certs-grid">
        {certifications.map((cert, index) => {
          const hasLink = cert.credentialUrl && cert.credentialUrl !== "#";
          return (
            <div
              className="cert-card glass"
              key={index}
            >
              {/* Top accent bar */}
              <div className="cert-accent-bar" />

              <div className="cert-card-body">
                {/* Issuer Logo */}
                <div className="cert-logo-wrap">
                  <img
                    src={cert.logo}
                    alt={cert.issuer}
                    className="cert-logo"
                  />
                </div>

                {/* Badge icon */}
                <div className="cert-badge-icon">
                  <Award size={20} />
                </div>

                <h3 className="cert-title">{cert.title}</h3>

                <p className="cert-issuer">{cert.issuer}</p>

                <div className="cert-date">
                  <CalendarDays size={14} />
                  <span>{cert.date}</span>
                </div>
              </div>

              <div className="cert-card-footer">
                {hasLink ? (
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="btn btn-primary btn-sm cert-btn"
                  >
                    <ExternalLink size={14} /> View Certificate
                  </button>
                ) : (
                  <span className="cert-btn-unavailable">
                    Certificate not linked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div 
          className="cert-modal-overlay" 
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="cert-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="cert-modal-close" 
              onClick={() => setSelectedCert(null)}
            >
              <X size={32} />
            </button>
            <img 
              src={selectedCert.credentialUrl} 
              alt={selectedCert.title} 
              className="cert-modal-image"
            />
            <div className="cert-modal-info">
              <h3>{selectedCert.title}</h3>
              <p>{selectedCert.issuer} • {selectedCert.date}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Certifications;
