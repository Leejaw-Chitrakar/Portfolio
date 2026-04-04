import React from "react";
import ProjectCard from "../components/ProjectCard";
import "../styles/Projects.css";

const Projects = () => {
  const projectList = [
    {
      title: "VibeCouture Fashion Store",
      description:
        "A premium MERN stack fashion e-commerce platform featuring high-end aesthetics, robust state management, and a seamless shopping experience.",
      tech: ["MongoDB", "Express.js", "React", "Node.js", "Firebase"],
      image: "/projects/vibecouture.png",
      liveUrl: "https://vibecouture.web.app",
      githubUrl: "https://github.com/Leejaw-Chitrakar/VibeCouture",
    },
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
      liveUrl: "https://leejaw-chitrakar.github.io/Quiz-Game/",
      githubUrl: "https://github.com/Leejaw-Chitrakar/Quiz-Game",
    },
    {
      title: "Snake Game",
      description:
        "A modern, high-performance implementation of the classic Snake game featuring smooth animations, responsive controls, and a sleek, minimalist UI.",
      tech: ["HTML", "CSS", "JavaScript", "Animation"],
      image: "/projects/snake-game.png",
      liveUrl: "https://leejaw-chitrakar.github.io/Snake-Game/",
      githubUrl: "https://github.com/Leejaw-Chitrakar/Snake-Game",
    },
    {
      title: "Hult Prize at Samriddhi",
      description:
        "An official web platform for Hult Prize at Samriddhi College — empowering students to tackle the world's pressing social challenges through entrepreneurship and innovation.",
      tech: ["React", "Firebase", "CSS3", "Responsive Design"],
      image: "/projects/hultprize.png",
      liveUrl: "https://hultprizeatsamriddhi.web.app/",
      githubUrl: "#",
    },
    {
      title: "Hangman Game",
      description:
        "A classic Hangman game built in C, demonstrating core programming concepts such as arrays, loops, string handling, and game logic implementation in a console environment.",
      tech: ["C", "Console Application"],
      image:
        "https://images.unsplash.com/photo-1753285310764-54c9571eff70?q=80&w=665&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
