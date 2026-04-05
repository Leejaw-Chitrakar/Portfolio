import React, { useEffect, useRef } from "react";
import "../styles/CustomCursor.css";

const CustomCursor = () => {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const particles = useRef([]);

  useEffect(() => {
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
      particles.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        size: Math.random() * 35 + 25,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5 - 1.2,
        opacity: 0.5,
        color: Math.random() > 0.5 ? "rgba(99, 102, 241, 0.4)" : "rgba(236, 72, 153, 0.4)",
      });
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoothly interpolate the white dot's position to the physical mouse
      // A high lerp factor (like 0.4) makes it very responsive yet silky smooth
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
  }, []);

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
          backgroundColor: "#fff",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000,
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.6)",
          willChange: "transform",
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
          filter: "blur(40px)",
        }}
      />
    </>
  );
};

export default CustomCursor;
