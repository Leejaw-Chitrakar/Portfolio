import React, { useEffect, useRef, useState } from "react";
import "../styles/CustomCursor.css";

const CustomCursor = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const particles = useRef([]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const createParticle = () => {
      particles.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        size: Math.random() * 35 + 25, // Larger initial smoke puffs
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5 - 1.2, // Drift upwards faster
        opacity: 0.5,
        color: Math.random() > 0.5 ? "rgba(99, 102, 241, 0.4)" : "rgba(236, 72, 153, 0.4)", // Mix primary/secondary colors
      });
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only create particles if mouse has moved or at a slower rate
      if (Math.random() > 0.3) createParticle();

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.size += 0.8; // Particles grow as they disperse
        p.opacity -= 0.008; // Particles fade out slower

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
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    updateParticles();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "10px",
          height: "10px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000,
          transform: `translate3d(${mousePos.x - 5}px, ${mousePos.y - 5}px, 0)`,
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.6)",
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
          filter: "blur(40px)", // More diffusion for larger smoke
        }}
      />
    </>
  );
};

export default CustomCursor;
