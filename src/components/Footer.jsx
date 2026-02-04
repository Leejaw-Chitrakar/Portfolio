import React from 'react';
import { Github, Linkedin, Twitter, Mail, Heart, Instagram } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <Github size={20} />, url: 'https://github.com/Leejaw-Chitrakar', label: 'GitHub' },
    { icon: <Linkedin size={20} />, url: 'https://www.linkedin.com/in/leejaw-chitrakar-254151313/', label: 'LinkedIn' },
    { icon: <Instagram size={20} />, url: 'https://instagram.com/leejawchitrakar/', label: 'Instagram' },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="logo-text">Dev<span className="gradient-text">Portfolio</span></h3>
            <p className="footer-bio">Building digital experiences that matter. Focused on performance, aesthetics, and user experience.</p>
          </div>
          
          <div className="footer-links">
            <h4>Connect</h4>
            <div className="social-icons">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="social-link"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Leejaw Chitrakar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
