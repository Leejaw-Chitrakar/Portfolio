import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import MobileRadialNav from './MobileRadialNav';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled glass' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="logo">
            <Code2 size={32} className="logo-icon" />
            <span className="logo-text">Dev<span className="gradient-text">Portfolio</span></span>
          </Link>

          {/* Desktop Menu */}
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/resume" className="btn btn-primary btn-sm">Resume</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Floating Radial Arc Action Hub for Mobile & Tablet */}
      <MobileRadialNav />
    </>
  );
};

export default Navbar;
