import React from "react";
import SkillBar from "../components/SkillBar.jsx";
import { Layout, Server, Database, Code2 } from "lucide-react";
import "../styles/Skills.css";

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Layout size={24} />,
      skills: [
        { name: "HTML5", percentage: 95 },
        { name: "CSS3", percentage: 92 },
        { name: "JavaScript (ES6+)", percentage: 70 },
        { name: "React / ReactJS", percentage: 70 },
      ],
    },
    {
      title: "Backend Development",
      icon: <Server size={24} />,
      skills: [
        { name: "Node.js", percentage: 65 },
        { name: "Express.js", percentage: 50 },
      ],
    },
    {
      title: "Database & Tools",
      icon: <Database size={24} />,
      skills: [
        { name: "MongoDB", percentage: 65 },
        { name: "Git & GitHub", percentage: 80 },
        { name: "Firebase", percentage: 50 },
      ],
    },
    {
      title: "Programming Languages",
      icon: <Code2 size={24} />,
      skills: [
        { name: "C", percentage: 70 },
        { name: "C++", percentage: 70 },
        { name: "Python", percentage: 60 },
      ],
    },
  ];

  return (
    <div className="skills-page container section fade-in">
      <div className="section-header">
        <h2 className="gradient-text">Skills &amp; Expertise</h2>
        <p>A technical breakdown of my capabilities and the tools I use</p>
      </div>

      <div className="skills-grid">
        {skillCategories.map((category, index) => (
          <div key={index} className="skill-category glass">
            <div className="category-head">
              <span className="category-icon">{category.icon}</span>
              <h3>{category.title}</h3>
            </div>
            <div className="skills-list">
              {category.skills.map((skill, sIndex) => (
                <SkillBar key={sIndex} {...skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
