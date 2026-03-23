import React from "react";
import ProjectCard from "../components/ProjectCard";
import "../styles/Projects.css";

const Projects = () => {
  const projectList = [
    // {
    //   title: "MERN Stack E-Commerce",
    //   description:
    //     "A fully functional MERN stack commerce site built to support local businesses, featuring secure user authentication flows and robust state management.",
    //   tech: ["MongoDB", "Express.js", "React", "Node.js"],
    //   image:
    //     "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    //   liveUrl: "#",
    //   githubUrl: "https://github.com/Leejaw-Chitrakar/MERN-PROJECT",
    // },
    {
      title: "Kaaputale E-Commerce Site",
      description:
        "An e-commerce platform with a focus on delivering optimized user experience (UX) and a clean, responsive design across mobile, tablet, and desktop.",
      tech: ["ReactJS", "CSS3", "Responsive Design"],
      image: "https://i.postimg.cc/htsg4YZd/IMG-20260207-WA0000.jpg",
      liveUrl: "https://kaaputale.web.app",
      githubUrl: "https://github.com/Leejaw-Chitrakar/Kaaputale",
    },
    {
      title: "Quiz Game",
      description:
        "An interactive browser-based quiz game showcasing dynamic JavaScript logic, DOM manipulation, and engaging user interaction flows.",
      tech: ["HTML", "CSS", "JavaScript"],
      image: "https://i.postimg.cc/rwPn9CKY/quiz_Game.png",
      liveUrl: "#",
      githubUrl: "https://github.com/Leejaw-Chitrakar/Quiz-Game",
    },
    {
      title: "Hangman Game",
      description:
        "A classic Hangman game built in C, demonstrating core programming concepts such as arrays, loops, string handling, and game logic implementation in a console environment.",
      tech: ["C", "Console Application"],
      image:
        "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&q=80",
      liveUrl: "#",
      githubUrl: "https://github.com/Leejaw-Chitrakar/Hangman",
    },
  ];

  return (
    <div className="projects-page container section fade-in">
      <div className="section-header">
        <h2 className="gradient-text">Featured Projects</h2>
        <p>A collection of my real-world work and personal experiments</p>
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
