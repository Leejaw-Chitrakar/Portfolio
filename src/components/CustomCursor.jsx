import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/CustomCursor.css";

const CustomCursor = () => {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const { theme } = useTheme();

  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const particles = useRef([]);
  const themeRef = useRef(theme);

  // Keep themeRef updated so the animation loop always picks up current theme colors
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Convert hex / rgb string to rgba with given alpha
  const hexToRgba = (hexOrRgb, alpha = 0.45) => {
    if (!hexOrRgb) return `rgba(226, 180, 189, ${alpha})`;
    if (hexOrRgb.startsWith("rgba")) {
      return hexOrRgb.replace(/[\d\.]+\)$/g, `${alpha})`);
    }
    if (hexOrRgb.startsWith("rgb(")) {
      return hexOrRgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    }
    if (hexOrRgb.startsWith("#")) {
      let hex = hexOrRgb.replace("#", "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(226, 180, 189, ${alpha})`;
  };

  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const createParticle = () => {
      const currentTheme = themeRef.current || {};
      const primaryRgba = hexToRgba(currentTheme.primary, 0.48);
      const secondaryRgba = hexToRgba(
        currentTheme.secondary || currentTheme.primaryDark || currentTheme.accent, 
        0.42
      );

      particles.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        size: Math.random() * 32 + 22,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5 - 1.2,
        opacity: 0.55,
        color: Math.random() > 0.45 ? primaryRgba : secondaryRgba,
      });
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth interpolation for the cursor dot
      pos.current.x += (mouse.current.x - pos.current.x) * 0.4;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.4;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x - 5}px, ${pos.current.y - 5}px, 0)`;
      }

      if (Math.random() > 0.3) createParticle();

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.size += 0.8;
        p.opacity -= 0.008;

        if (p.opacity <= 0) {
          particles.current.splice(i, 1);
          i--;
          continue;
        }

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(updateParticles);
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    updateParticles();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "10px",
          height: "10px",
          backgroundColor: theme?.primary || "#ffffff",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000,
          boxShadow: `0 0 16px ${theme?.primary || "#ffffff"}, 0 0 6px #ffffff`,
          willChange: "transform",
          transition: "background-color 0.25s ease, box-shadow 0.25s ease",
        }}
      />
      <canvas
        ref={canvasRef}
        className="smoke-cursor-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          filter: "blur(38px)",
        }}
      />
    </>
  );
};

export default CustomCursor;
