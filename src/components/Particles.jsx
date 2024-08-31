import React, { useState, useEffect } from 'react';

const Particle = ({ x, y, color, size, lifetime }) => {
  const [position, setPosition] = useState({ x, y });
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: prev.y + (Math.random() - 0.5) * 2
      }));
      setOpacity(prev => Math.max(0, prev - 1 / lifetime));
    }, 50);

    return () => clearInterval(interval);
  }, [lifetime]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        opacity: opacity,
        transition: 'opacity 0.05s linear',
      }}
    />
  );
};

const Particles = ({ particles }) => {
  return (
    <div className="particles">
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </div>
  );
};

export default Particles;