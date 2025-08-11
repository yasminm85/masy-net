import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const InfinityLoop = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height, colorGradient;
    let t = 0;

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.scale(ratio, ratio);

      colorGradient = ctx.createLinearGradient(0, 0, width, height);
      colorGradient.addColorStop(0, "#0303FC  ");
      colorGradient.addColorStop(1, "#E80000");
    };

    resizeCanvas();

    const drawInfinityPath = () => {
      const size = Math.min(width, height) / 3;
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.01) {
        const x = width / 2 + size * Math.sin(angle) / (1 + Math.pow(Math.cos(angle), 2));
        const y = height / 2 + size * Math.sin(angle) * Math.cos(angle) / (1 + Math.pow(Math.cos(angle), 2));
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colorGradient;
      ctx.lineWidth = 5;
      ctx.stroke();
    };

    const drawGlowCircle = (time) => {
      const size = Math.min(width, height) / 3;
      const angle = time;
      const x = width / 2 + size * Math.sin(angle) / (1 + Math.pow(Math.cos(angle), 2));
      const y = height / 2 + size * Math.sin(angle) * Math.cos(angle) / (1 + Math.pow(Math.cos(angle), 2));

      const glow = ctx.createRadialGradient(x, y, 0, x, y, 12);
      glow.addColorStop(0, "rgba(255,255,255,0.9)");
      glow.addColorStop(1, "rgba(0,0,255,0.5)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawInfinityPath();
      drawGlowCircle(t);
      t += 0.015;
      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      ></canvas>

      {/* Crypto Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            x: [0, Math.random() * 600 - 300],
            y: [0, Math.random() * 400 - 200],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: `linear-gradient(to right, #6402db, #c502db)`,
            boxShadow: "0 0 8px #ffffff",
          }}
        />
      ))}
    </div>
  );
};

export default InfinityLoop;
