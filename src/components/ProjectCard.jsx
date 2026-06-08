import React from "react";
import { Github } from "lucide-react";
import "../styles/ProjectCard.css";

const ProjectCard = ({
  title,
  description,
  tech,
  image,
  liveUrl,
  githubUrl,
  index
}) => {
  const hasDemo = liveUrl && liveUrl !== "#";
  const hasGithub = githubUrl && githubUrl !== "#";
  // Alternate heights to create a prominent staggered masonry effect
  const cardHeightClass = index % 3 === 0 ? "h-tall" : index % 3 === 1 ? "h-medium" : "h-short";

  return (
    <div className={`fusion-card ${cardHeightClass}`}>
      <img src={image} alt={title} className="fusion-card-image" />
      
      <div className="fusion-card-glass">
        {/* Default state: Only faint, elegant category labels */}
        <div className="fusion-card-default">
          <span className="fusion-category">{tech[0]}</span>
        </div>

        {/* Hover state content */}
        <div className="fusion-card-hover">
          <h3 className="fusion-title">{title}</h3>
          <p className="fusion-desc">{description}</p>
          
          <div className="fusion-tech-stack">
            {tech.slice(0, 3).map((item, i) => (
              <span key={i} className="fusion-tech-tag">{item}</span>
            ))}
          </div>

          <div className="fusion-actions">
            {hasDemo ? (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="fusion-btn discover-btn">
                Discover
              </a>
            ) : (
              <span className="fusion-btn disabled-btn">Unavailable</span>
            )}
            {hasGithub && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="fusion-btn outline-btn">
                <Github size={16} /> Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
