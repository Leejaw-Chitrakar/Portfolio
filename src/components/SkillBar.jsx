import React, { useEffect, useState } from 'react';
import '../styles/SkillBar.css';

const SkillBar = ({ name, percentage }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="skill-item">
      <div className="skill-info">
        <span className="skill-name">{name}</span>
        <span className="skill-percentage">{percentage}%</span>
      </div>
      <div className="skill-bar-container">
        <div 
          className="skill-bar-progress" 
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;
