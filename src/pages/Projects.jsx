import React from 'react';
import ProjectCard from '../components/ProjectCard';
import '../styles/Projects.css';

const Projects = () => {
  const projectList = [
    {
      title: "E-Commerce Nebula",
      description: "A futuristic shopping experience with real-time stock tracking and AI-powered recommendations.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Crypto Pulse Dashboard",
      description: "Real-time cryptocurrency monitoring tool with predictive analytics and portfolio tracking.",
      tech: ["React", "Chart.js", "WebSockets", "Tailwind"],
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Zenith Task Manager",
      description: "A minimal, productivity-focused task manager with offline support and cloud sync.",
      tech: ["React", "Firebase", "Redux", "Framer Motion"],
      image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Vortex Social Network",
      description: "A decentralized social platform focusing on privacy and user data ownership.",
      tech: ["React", "Web3.js", "Solidity", "IPFS"],
      image: "https://images.unsplash.com/photo-1522542550221-31fd1925fb3a?w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Kaaputale: Handcrafted Elegance",
      description: "A high-end, responsive e-commerce interface designed for a niche artisanal brand, featuring glassmorphism and immersive animations.",
      tech: ["React", "Tailwind CSS", "Framer Motion"],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      liveUrl: "#",
      githubUrl: "#"
    }
  ];

  return (
    <div className="projects-page container section fade-in">
      <div className="section-header">
        <h2 className="gradient-text">Featured Projects</h2>
        <p>A collection of my recent work and personal experiments</p>
      </div>

      <div className="projects-grid">
        {projectList.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
