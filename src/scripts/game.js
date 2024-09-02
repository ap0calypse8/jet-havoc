// Load sounds
const shootSound = new Audio("shoot.mp3");
const explosionSound = new Audio('src/assets/sounds/explosion.mp3');
const gameOverSound = new Audio('src/assets/sounds/game-over.mp3');

// Error handling for audio loading
shootSound.onerror = () => console.error('Error loading shoot sound');
explosionSound.onerror = () => console.error('Error loading explosion sound');
gameOverSound.onerror = () => console.error('Error loading game over sound');

// Function to play shoot sound
function playShootSound() {
    shootSound.play().catch(error => console.error('Error playing shoot sound:', error));
}

// Function to play explosion sound
function playExplosionSound() {
    explosionSound.play().catch(error => console.error('Error playing explosion sound:', error));
}

// Function to play game over sound
function playGameOverSound() {
    gameOverSound.play().catch(error => console.error('Error playing game over sound:', error));
}

// Example usage: Call these functions at appropriate game events
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        console.log('Space key pressed, playing shoot sound');
        playShootSound();
    }
});

// Call playExplosionSound() when an explosion occurs
function handleExplosion() {
    // ... existing explosion logic ...
    console.log('Explosion occurred, playing explosion sound');
    playExplosionSound();
}

// Call playGameOverSound() when the game is over
function handleGameOver() {
    // ... existing game over logic ...
    console.log('Game over, playing game over sound');
    playGameOverSound();
}

// Example of integrating with existing game logic
function updateGame() {
    // ... existing game update logic ...

    // Example: Check for collisions and handle explosion
    if (checkCollision(player, asteroid)) {
        handleExplosion();
    }

    // Example: Check if game is over
    if (isGameOver()) {
        handleGameOver();
    }
}

