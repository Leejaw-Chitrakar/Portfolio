import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import '../styles/ProjectCard.css';

const ProjectCard = ({ title, description, tech, image, liveUrl, githubUrl }) => {
  return (
    <div className="project-card glass">
      <div className="project-image-container">
        <img src={image} alt={title} className="project-image" />
        <div className="project-overlay">
          <div className="overlay-links">
            <a href={liveUrl} className="overlay-btn" aria-label="Live Demo"><ExternalLink size={24} /></a>
            <a href={githubUrl} className="overlay-btn" aria-label="GitHub Source"><Github size={24} /></a>
          </div>
        </div>
      </div>
      
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tech">
          {tech.map((item, index) => (
            <span key={index} className="tech-tag">{item}</span>
          ))}
        </div>
        <div className="project-actions">
          <a href={liveUrl} className="btn btn-primary btn-sm">Live Demo</a>
          <a href={githubUrl} className="btn btn-outline btn-sm"><Github size={16} /> Code</a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
