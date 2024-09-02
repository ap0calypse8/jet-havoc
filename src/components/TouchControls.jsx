import React, { useCallback, useRef, useEffect } from 'react';

const TouchControls = ({ onMove, onFire, gameStarted, gameOver }) => {
  const fireButtonRef = useRef(null);

  const handleTouchMove = useCallback((e) => {
    if (!gameStarted || gameOver) return;
    const touch = e.touches[0];
    onMove(touch.clientX);
  }, [gameStarted, gameOver, onMove]);

  const handleTouchStart = useCallback((e) => {
    if (!gameStarted || gameOver) return;
    const touch = e.touches[0];
    const fireButton = fireButtonRef.current;
    
    if (fireButton) {
      const rect = fireButton.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        e.preventDefault();
        onFire();
      }
    }
  }, [gameStarted, gameOver, onFire]);

  useEffect(() => {
    const touchControls = document.querySelector('.touch-controls');
    touchControls.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      touchControls.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleTouchStart]);

  return (
    <div 
      className="touch-controls"
      onTouchMove={handleTouchMove}
    >
      <div className="fire-button" ref={fireButtonRef}>FIRE</div>
    </div>
  );
};

export default React.memo(TouchControls);