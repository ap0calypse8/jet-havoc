import React from 'react';

const Shield = ({ position, active }) => {
  if (!active) return null;

  return (
    <div 
      className="shield"
      style={{
        position: 'absolute',
        left: `${position.x - 2}%`,
        bottom: `${position.y - 2}%`,
        width: '44px',
        height: '64px',
        border: '2px solid #00FFFF',
        borderRadius: '50%',
        boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF',
        opacity: 0.7,
        zIndex: 2,
      }}
    />
  );
};

export default Shield;