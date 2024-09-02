import React, { useState, useEffect, useCallback, useRef } from 'react';
import Jet from './Jet';
import Asteroid from './Asteroid';
import Beam from './Beam';
import Background from './Background';
import Particles from './Particles';
import Shield from './Shield';
import TouchControls from './TouchControls';
import shootSoundFile from '../assets/sounds/shoot.mp3';
import explosionSoundFile from '../assets/sounds/explosion.mp3';
import gameOverSoundFile from '../assets/sounds/game-over.mp3';

const Game = () => {
  const shootSoundRef = useRef(null);
  const explosionSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);

  const [score, setScore] = useState(0);
  const [asteroids, setAsteroids] = useState([]);
  const [beams, setBeams] = useState([]);
  const [jetPosition, setJetPosition] = useState({ x: 50, y: 20 });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [asteroidSpawnRate, setAsteroidSpawnRate] = useState(0.05);
  const [particles, setParticles] = useState([]);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldTimer, setShieldTimer] = useState(null);
  const [powerUps, setPowerUps] = useState([]);
  const [showDifficultyButtons, setShowDifficultyButtons] = useState(false);

  const startGame = (selectedDifficulty) => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setAsteroids([]);
    setBeams([]);
    setJetPosition({ x: 50, y: 20 });
    setDifficulty(selectedDifficulty);
    setAsteroidSpawnRate(0.05 * selectedDifficulty);
    setShieldActive(false);
    clearTimeout(shieldTimer);
    setShieldTimer(null);
    setPowerUps([]);
  };

  const generateAsteroid = useCallback(() => {
    return {
      id: Date.now(),
      position: { x: Math.random() * 100, y: -10 },
      size: 15 * difficulty,
      speed: 0.5 * difficulty,
    };
  }, [difficulty]);

  const fireBeam = useCallback(() => {
    const newBeam = {
      id: Date.now(),
      position: { x: jetPosition.x + 1.5, y: jetPosition.y + 7.5 },
    };
    setBeams(prevBeams => [...prevBeams, newBeam]);
    playSound(shootSoundRef);
  }, [jetPosition]);

  const checkCollision = useCallback((rect1, rect2) => {
    const center1 = {
      x: rect1.left + (rect1.right - rect1.left) / 2,
      y: rect1.top + (rect1.bottom - rect1.top) / 2
    };
    const center2 = {
      x: rect2.left + (rect2.right - rect2.left) / 2,
      y: rect2.top + (rect2.bottom - rect2.top) / 2
    };
    const radius1 = Math.max(rect1.right - rect1.left, rect1.bottom - rect1.top) / 2;
    const radius2 = Math.max(rect2.right - rect2.left, rect2.bottom - rect2.top) / 2;
    
    const distance = Math.sqrt(
      Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2)
    );
    
    return distance < (radius1 + radius2);
  }, []);

  const createParticles = useCallback((x, y, color, count, size, lifetime) => {
    const newParticles = Array.from({ length: count }, () => ({
      x, y, color, size, lifetime
    }));
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const removeExpiredParticles = useCallback(() => {
    setParticles(prev => prev.filter(particle => particle.lifetime > 0));
  }, []);

  const activateShield = useCallback(() => {
    setShieldActive(true);
    clearTimeout(shieldTimer);
    const timer = setTimeout(() => {
      setShieldActive(false);
    }, 5000); // Shield lasts for 5 seconds
    setShieldTimer(timer);
  }, [shieldTimer]);

  const generatePowerUp = useCallback(() => {
    return {
      id: Date.now(),
      position: { x: Math.random() * 100, y: -10 },
      type: 'shield',
    };
  }, []);

  const handleTouchMove = useCallback((x) => {
    if (!gameStarted || gameOver) return;
    const gameWidth = window.innerWidth;
    const newX = (x / gameWidth) * 100;
    setJetPosition(prev => ({ ...prev, x: Math.max(0, Math.min(94, newX)) }));
  }, [gameStarted, gameOver]);

  const handleTouchFire = useCallback(() => {
    if (!gameStarted || gameOver) return;
    fireBeam();
  }, [gameStarted, gameOver, fireBeam]);

  const handleExplosion = useCallback(() => {
    // Create explosion particles
    createParticles(jetPosition.x, jetPosition.y, '#FFA500', 30, 3, 30);
    // Play explosion sound
    playSound(explosionSoundRef);
  }, [jetPosition, createParticles]);

  const handleGameOver = useCallback(() => {
    // Set game over state
    setGameOver(true);
    // Play game over sound
    playSound(gameOverSoundRef);
  }, []);

  const playSound = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  };

  const handleKeydown = useCallback((event) => {
    if (event.code === 'Space') {
      console.log('Space key pressed, playing shoot sound');
      playSound(shootSoundRef);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setAsteroids(prevAsteroids => {
        const updatedAsteroids = prevAsteroids
          .map(asteroid => ({
            ...asteroid,
            position: { ...asteroid.position, y: asteroid.position.y + asteroid.speed }
          }))
          .filter(asteroid => asteroid.position.y < 100);

        return updatedAsteroids;
      });

      setBeams(prevBeams => {
        const updatedBeams = prevBeams
          .map(beam => ({
            ...beam,
            position: { ...beam.position, y: beam.position.y + 2 }
          }))
          .filter(beam => beam.position.y < 100);

        return updatedBeams;
      });

      // Check for collisions
      setAsteroids(prevAsteroids => {
        return prevAsteroids.filter(asteroid => {
          const asteroidRect = {
            left: asteroid.position.x,
            right: asteroid.position.x + asteroid.size / 5,
            top: asteroid.position.y,
            bottom: asteroid.position.y + asteroid.size / 5
          };

          // Check collision with jet
          const jetRect = {
            left: jetPosition.x,
            right: jetPosition.x + 6,
            top: 100 - jetPosition.y - 9,
            bottom: 100 - jetPosition.y
          };

          if (checkCollision(asteroidRect, jetRect)) {
            if (shieldActive) {
              // Destroy asteroid but don't end game
              createParticles(asteroid.position.x, asteroid.position.y, '#00FFFF', 20, 2, 20);
              handleExplosion(); // Play explosion sound
              return false;
            } else {
              setGameOver(true);
              handleGameOver(); // Play game over sound
              return false;
            }
          }

          // Check collision with beams
          const hitByBeam = beams.some(beam => {
            const beamRect = {
              left: beam.position.x,
              right: beam.position.x + 0.4,
              top: 100 - beam.position.y - 2,
              bottom: 100 - beam.position.y
            };

            return checkCollision(asteroidRect, beamRect);
          });

          if (hitByBeam) {
            setScore(prevScore => prevScore + 10);
            createParticles(asteroid.position.x, asteroid.position.y, '#FFA500', 20, 2, 20);
            setBeams(prevBeams => prevBeams.filter(beam => !checkCollision(asteroidRect, {
              left: beam.position.x,
              right: beam.position.x + 0.4,
              top: 100 - beam.position.y - 2,
              bottom: 100 - beam.position.y
            })));
            handleExplosion(); // Play explosion sound
            return false;
          }

          return true;
        });
      });

      // Increase asteroid spawn chance
      if (Math.random() < asteroidSpawnRate) {
        setAsteroids(prevAsteroids => [...prevAsteroids, generateAsteroid()]);
      }

      // Increase difficulty over time
      setDifficulty(prevDifficulty => Math.min(prevDifficulty + 0.001, 2));

      setScore(prevScore => prevScore + 1);

      removeExpiredParticles();

      // Move power-ups
      setPowerUps(prevPowerUps => {
        const updatedPowerUps = prevPowerUps
          .map(powerUp => ({
            ...powerUp,
            position: { ...powerUp.position, y: powerUp.position.y + 0.5 }
          }))
          .filter(powerUp => powerUp.position.y < 100);

        return updatedPowerUps;
      });

      // Check for collisions with power-ups
      setPowerUps(prevPowerUps => {
        return prevPowerUps.filter(powerUp => {
          const powerUpRect = {
            left: powerUp.position.x,
            right: powerUp.position.x + 5,
            top: powerUp.position.y,
            bottom: powerUp.position.y + 5
          };

          const jetRect = {
            left: jetPosition.x,
            right: jetPosition.x + 6,
            top: 100 - jetPosition.y - 9,
            bottom: 100 - jetPosition.y
          };

          if (checkCollision(powerUpRect, jetRect)) {
            if (powerUp.type === 'shield') {
              activateShield();
            }
            return false;
          }

          return true;
        });
      });

      // Spawn power-ups
      if (Math.random() < 0.005) { // 0.5% chance each frame
        setPowerUps(prevPowerUps => [...prevPowerUps, generatePowerUp()]);
      }
    }, 50);

    // Increase asteroid spawn rate more frequently and by a larger amount
    const spawnRateInterval = setInterval(() => {
      setAsteroidSpawnRate(prevRate => Math.min(prevRate * 1.2, 0.3)); // Increase by 20% every 15 seconds, cap at 30%
    }, 15000);

    return () => {
      clearInterval(gameLoop);
      clearInterval(spawnRateInterval);
    };
  }, [gameStarted, gameOver, jetPosition, generateAsteroid, checkCollision, beams, asteroidSpawnRate, createParticles, removeExpiredParticles, shieldActive, activateShield, generatePowerUp]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver) return;

      switch(e.key) {
        case 'ArrowLeft':
          setJetPosition(prev => ({ ...prev, x: Math.max(0, prev.x - 2) }));
          break;
        case 'ArrowRight':
          setJetPosition(prev => ({ ...prev, x: Math.min(94, prev.x + 2) }));
          break;
        case ' ':
          fireBeam();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, fireBeam]);

  if (!gameStarted) {
    return (
      <div className="game-container">
        <Background />
        <div className="start-menu">
          <h1 className="game-title">JET HAVOC</h1>
          {!showDifficultyButtons ? (
            <button onClick={() => setShowDifficultyButtons(true)}>Start Game</button>
          ) : (
            <>
              <button onClick={() => startGame(1)}>Easy</button>
              <button onClick={() => startGame(1.5)}>Medium</button>
              <button onClick={() => startGame(2)}>Hard</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <Background />
      <div className="score">Score: {score}</div>
      <Jet position={jetPosition} />
      <Shield position={jetPosition} active={shieldActive} />
      {asteroids.map((asteroid) => (
        <Asteroid key={asteroid.id} position={asteroid.position} size={asteroid.size} />
      ))}
      {beams.map((beam) => (
        <Beam key={beam.id} position={beam.position} />
      ))}
      {powerUps.map((powerUp) => (
        <div
          key={powerUp.id}
          className="power-up"
          style={{
            position: 'absolute',
            left: `${powerUp.position.x}%`,
            top: `${powerUp.position.y}%`,
            width: '20px',
            height: '20px',
            backgroundColor: '#00FFFF',
            borderRadius: '50%',
            boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF',
          }}
        />
      ))}
      <Particles particles={particles} />
      <TouchControls 
        onMove={handleTouchMove} 
        onFire={handleTouchFire} 
        gameStarted={gameStarted}
        gameOver={gameOver}
      />
      {gameOver && (
        <div className="game-over">
          <p>Game Over</p>
          <p>Final Score: {score}</p>
          <button onClick={() => startGame(difficulty)}>Restart</button>
        </div>
      )}
      <audio src={shootSoundFile} ref={shootSoundRef} />
      <audio src={explosionSoundFile} ref={explosionSoundRef} />
      <audio src={gameOverSoundFile} ref={gameOverSoundRef} />
    </div>
  );
};

export default Game;