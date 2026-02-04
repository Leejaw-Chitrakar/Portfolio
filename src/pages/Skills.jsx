import React from 'react';
import SkillBar from '../components/SkillBar.jsx';
import { Layout, Server, Database } from 'lucide-react';
import '../styles/Skills.css';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Layout size={24} />,
      skills: [
        { name: "ReactJS", percentage: 90 },
        { name: "JavaScript (ES6+)", percentage: 80 },
        { name: "HTML5/CSS3", percentage: 90 },
        // { name: "Next.js", percentage: 80 }
      ]
    },
    {
      title: "Backend Development",
      icon: <Server size={24} />,
      skills: [
        { name: "Node.js", percentage: 85 },
        { name: "Express.js", percentage: 75 },
        // { name: "Python", percentage: 70 },
        // { name: "GraphQL", percentage: 65 }
      ]
    },
    // {
    //   title: "Databases & Tools",
    //   icon: <Database size={24} />,
    //   skills: [
    //     { name: "MongoDB", percentage: 85 },
    //     { name: "PostgreSQL", percentage: 75 },
    //     { name: "Docker", percentage: 60 },
    //     { name: "Git", percentage: 90 }
    //   ]
    // }
  ];

  return (
    <div className="skills-page container section fade-in">
      <div className="section-header">
        <h2 className="gradient-text">Skills & Expertise</h2>
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
