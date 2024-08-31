import React, { useState, useEffect } from 'react';

const Jet = ({ position }) => {
  const [flameSize, setFlameSize] = useState(20);

  useEffect(() => {
    const flameInterval = setInterval(() => {
      setFlameSize(Math.random() * 10 + 15);
    }, 100);

    return () => clearInterval(flameInterval);
  }, []);

  return (
    <div 
      className="jet"
      style={{
        left: `${position.x}%`,
        bottom: `${position.y}%`,
        width: '40px',
        height: '60px',
        position: 'absolute',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0L40 50H0L20 0Z" fill="#8B0000"/> {/* Dark red body */}
        <path d="M15 50L20 60L25 50H15Z" fill="#8B0000"/> {/* Tail */}
        <path d="M5 40L0 50H15L5 40Z" fill="#A52A2A"/> {/* Left wing */}
        <path d="M35 40L40 50H25L35 40Z" fill="#A52A2A"/> {/* Right wing */}
        <path d="M18 5L22 5L24 15L16 15L18 5Z" fill="#D3D3D3"/> {/* Cockpit */}
      </svg>
      <div 
        className="flame"
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: `${flameSize}px`,
          backgroundColor: 'orange',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default Jet;