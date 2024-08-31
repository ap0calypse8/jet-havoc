import React from 'react';

const Asteroid = ({ position, size }) => {
  const generatePath = () => {
    const points = [];
    const segments = 10;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const radius = size / 2 - 1 + Math.random() * 2; // Vary the radius slightly
      const x = Math.cos(angle) * radius + size / 2;
      const y = Math.sin(angle) * radius + size / 2;
      points.push(`${x},${y}`);
    }
    return `M${points.join(' L')}Z`;
  };

  return (
    <div 
      className="asteroid"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size}px`,
        height: `${size}px`,
        position: 'absolute',
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <path
          d={generatePath()}
          fill="#8B8989"
          stroke="#696969"
          strokeWidth="0.5"
        />
        <circle cx={size * 0.33} cy={size * 0.33} r={size * 0.067} fill="#696969" />
        <circle cx={size * 0.67} cy={size * 0.53} r={size * 0.1} fill="#696969" />
        <circle cx={size * 0.47} cy={size * 0.73} r={size * 0.067} fill="#696969" />
      </svg>
    </div>
  );
};

export default Asteroid;