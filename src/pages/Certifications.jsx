import React, { useState, useEffect, useMemo } from "react";
import { Award, ExternalLink, CalendarDays, X, Verified } from "lucide-react";
import { subscribeCollection, defaultCertifications } from "../services/portfolioService";
import "../styles/Certifications.css";

const themes = ["theme-blue", "theme-purple", "theme-emerald"];

const Certifications = () => {
  const [certs, setCerts] = useState(defaultCertifications);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    const unsub = subscribeCollection("certifications", (data) => {
      if (data && data.length > 0) {
        setCerts(data);
      } else {
        setCerts(defaultCertifications);
      }
    }, defaultCertifications);
    return () => unsub();
  }, []);

  const sortedCerts = useMemo(() => {
    return [...certs].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [certs]);

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
            {sortedCerts.map((cert, index) => {
              const themeClass = themes[index % 3];
              return (
                <div 
                  className={`cert-card glass-high-end ${themeClass}`} 
                  key={cert.id || index}
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
