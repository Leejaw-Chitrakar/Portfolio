import React from 'react';

const Placeholder = ({ name }) => (
  <div className="container section fade-in">
    <h2 className="gradient-text">{name} Page</h2>
    <p>This section is currently under construction.</p>
  </div>
);

export const Contact = () => <Placeholder name="Contact" />;
export const Resume = () => <Placeholder name="Resume" />;
export const Skills = () => <Placeholder name="Skills" />;
export const Projects = () => <Placeholder name="Projects" />;
