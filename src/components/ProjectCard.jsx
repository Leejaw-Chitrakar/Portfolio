import React from "react";
import { ExternalLink, Github, WifiOff } from "lucide-react";
import "../styles/ProjectCard.css";

const ProjectCard = ({
  title,
  description,
  tech,
  image,
  liveUrl,
  githubUrl,
}) => {
  const hasDemo = liveUrl && liveUrl !== "#";

  return (
    <div className="project-card glass">
      <div className="project-image-container">
        <img src={image} alt={title} className="project-image" />

        {/* Demo Unavailable Badge */}
        {!hasDemo && (
          <div className="demo-unavailable-badge">
            <WifiOff size={13} />
            <span>Live Unavailable</span>
          </div>
        )}

        <div className="project-overlay">
          <div className="overlay-links">
            {hasDemo ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="overlay-btn"
                aria-label="Live Demo"
              >
                <ExternalLink size={24} />
              </a>
            ) : (
              <span
                className="overlay-btn overlay-btn--disabled"
                aria-label="Demo Unavailable"
              >
                <WifiOff size={24} />
              </span>
            )}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="overlay-btn"
              aria-label="GitHub Source"
            >
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tech">
          {tech.map((item, index) => (
            <span key={index} className="tech-tag">
              {item}
            </span>
          ))}
        </div>
        <div className="project-actions">
          {hasDemo ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <ExternalLink size={15} /> Live
            </a>
          ) : (
            <span
              className="btn btn-sm btn-demo-disabled"
              title="No live demo available"
            >
              <WifiOff size={15} /> Live Unavailable
            </span>
          )}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <Github size={16} /> Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
