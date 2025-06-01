import React, { useState, useEffect } from "react";

const Sparkle = ({ style }) => {
  return (
    <div
      className="absolute w-2 h-2 bg-amber-300 rounded-full animate-sparkle"
      style={style}
    ></div>
  );
};

const SparkleEffect = ({ x, y, onComplete }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Create random sparkles
    const newSparkles = [];
    const count = Math.floor(Math.random() * 5) + 8; // 8-12 sparkles

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2; // Random angle in radians
      const distance = Math.random() * 40 + 10; // Random distance 10-50px
      const size = Math.random() * 4 + 1; // Random size 1-5px
      const duration = Math.random() * 1 + 0.5; // Random duration 0.5-1.5s

      const sparkleX = Math.cos(angle) * distance;
      const sparkleY = Math.sin(angle) * distance;

      newSparkles.push({
        id: `sparkle-${i}-${Date.now()}`,
        style: {
          transform: `translate(${sparkleX}px, ${sparkleY}px)`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `rgb(255, ${
            Math.floor(Math.random() * 50) + 200
          }, ${Math.floor(Math.random() * 100)})`,
          animationDuration: `${duration}s`,
        },
      });
    }

    setSparkles(newSparkles);

    // Clean up after animation
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} style={sparkle.style} />
      ))}
    </div>
  );
};

export default SparkleEffect;
