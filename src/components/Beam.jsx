import React from 'react';

const Beam = ({ position }) => {
  return (
    <div 
      className="beam"
      style={{
        left: `${position.x}%`,
        bottom: `${position.y}%`,
        width: '2px',
        height: '10px',
        backgroundColor: '#00FFFF',
        position: 'absolute',
      }}
    />
  );
};

export default Beam;