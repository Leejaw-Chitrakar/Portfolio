import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import { subscribeCollection, defaultProjects } from "../services/portfolioService";
import "../styles/Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    const unsubscribe = subscribeCollection("projects", (data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    }, defaultProjects);

    return () => unsubscribe();
  }, []);

  return (
    <div className="projects-page fusion-container fade-in">
      <div className="fusion-background">
        <div className="light-leak-1"></div>
        <div className="light-leak-2"></div>
      </div>

      <div className="container section">
        <div className="section-header">
          <h2 className="gradient-text">Featured Projects</h2>
          <p className="fusion-subtitle">
            A collection of my real-world work and personal experiments
          </p>
        </div>

        <div className="fusion-grid">
          {projects.map((project, index) => {
            const formattedTech = Array.isArray(project.tech) 
              ? project.tech 
              : (typeof project.tech === "string" ? project.tech.split(",").map(t => t.trim()) : []);

            return (
              <ProjectCard 
                key={project.id || index} 
                {...project} 
                tech={formattedTech}
                index={index} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;
