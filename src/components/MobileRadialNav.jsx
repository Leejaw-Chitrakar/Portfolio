import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  X,
  Home,
  User,
  Cpu,
  FolderGit2,
  Award,
  Mail,
  FileText,
  Sparkles,
  Compass,
} from "lucide-react";
import "../styles/MobileRadialNav.css";

const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home, color: "#f59e0b", badge: "01" },
  { name: "About", path: "/about", icon: User, color: "#60a5fa", badge: "02" },
  { name: "Skills", path: "/skills", icon: Cpu, color: "#a855f7", badge: "03" },
  { name: "Projects", path: "/projects", icon: FolderGit2, color: "#10b981", badge: "04" },
  { name: "Certifications", path: "/certifications", icon: Award, color: "#ec4899", badge: "05" },
  { name: "Contact", path: "/contact", icon: Mail, color: "#38bdf8", badge: "06" },
  { name: "Resume", path: "/resume", icon: FileText, color: "#f97316", badge: "PDF" },
];

// Crescent Arc Coordinates curving upward & outward around the thumb
const ARC_OFFSETS = [
  { x: -8,   y: -64  },
  { x: -26,  y: -118 },
  { x: -48,  y: -172 },
  { x: -64,  y: -226 },
  { x: -50,  y: -280 },
  { x: -26,  y: -334 },
  { x: -8,   y: -388 },
];

const MobileRadialNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSelect = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="radial-nav-wrapper">
      {/* Dimmed Ambient Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="radial-nav-backdrop"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Radial Arc Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="radial-nav-arc-layer" onClick={() => setIsOpen(false)}>
            {NAV_ITEMS.map((item, index) => {
              const IconComp = item.icon;
              const isActive = location.pathname === item.path;
              const offset = ARC_OFFSETS[index] || { x: 0, y: -(index * 54 + 60) };

              return (
                <motion.div
                  key={item.path}
                  className={`radial-arc-item ${isActive ? "is-active" : ""}`}
                  style={{
                    "--item-color": item.color,
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                  animate={{
                    opacity: 1,
                    x: offset.x,
                    y: offset.y,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 26,
                      delay: index * 0.03,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: 0,
                    y: 0,
                    scale: 0.3,
                    transition: {
                      duration: 0.18,
                      delay: (NAV_ITEMS.length - 1 - index) * 0.02,
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item.path);
                  }}
                >
                  {/* Floating Glass Label Pill */}
                  <span className="radial-pill-tag">
                    <span className="pill-badge">{item.badge}</span>
                    <span className="pill-name">{item.name}</span>
                    {isActive && <span className="active-dot" />}
                  </span>

                  {/* Circular Glass Icon Bubble */}
                  <div className="radial-bubble-orb">
                    <IconComp size={18} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Floating Action Button (FAB) */}
      <motion.button
        type="button"
        className={`radial-fab-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close navigation hub" : "Open navigation hub"}
        whileTap={{ scale: 0.92 }}
      >
        {/* Pulsing beacon glow ring when closed */}
        {!isOpen && <span className="radial-fab-beacon" />}

        <motion.div
          className="radial-fab-icon-wrap"
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
        >
          {isOpen ? <X size={24} /> : <Code2 size={24} />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default MobileRadialNav;
