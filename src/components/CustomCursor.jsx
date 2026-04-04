import React, { useEffect, useRef } from 'react';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => {
      particles.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        size: Math.random() * 25 + 15,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5 - 1.2, // Drift upwards faster
        opacity: 0.5,
        color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`, // White/Grey smoke
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
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateParticles();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="smoke-cursor-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        filter: 'blur(30px)', // The soft smoke effect
      }}
    />
  );
};

export default CustomCursor;
