import { initScene, createPlayer, createGround } from './scene.js';
import { updatePlayer, resetPlayer, jump, setLane } from './player.js';
import { spawnObstacle, updateObstacles, resetObstacles, getObstacles } from './obstacles.js';
import { checkCollision } from './collision.js';
import { getHighScore, saveHighScore } from './storage.js';

// Setup Scene & Core Objects
const { scene, camera, renderer } = initScene();
const player = createPlayer();
scene.add(player);

const ground = createGround();
scene.add(ground);

// UI Elements
const startScreen = document.getElementById('start-screen');
const hud = document.getElementById('hud');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const bestScoreEl = document.getElementById('best-score');
const restartBtn = document.getElementById('restart-btn');

// Game State
let gameState = 'START'; // 'START' | 'PLAYING' | 'GAMEOVER'
let score = 0;
let distanceTraveled = 0;
let baseSpeed = 20;
let currentSpeed = baseSpeed;
let nextSpawnDistance = 15;
let distanceSinceLastSpawn = 0;
let lastTime = performance.now();

// Initialize High Score Display
const initialBest = getHighScore();
if (highScoreEl) highScoreEl.textContent = `Best: ${initialBest}`;

// -------------------------------------------------------------
// Game Lifecycle Functions
// -------------------------------------------------------------
function startGame() {
  gameState = 'PLAYING';
  score = 0;
  distanceTraveled = 0;
  distanceSinceLastSpawn = 0;
  currentSpeed = baseSpeed;
  nextSpawnDistance = 14;

  resetPlayer(player);
  resetObstacles(scene);

  // Update UI
  if (startScreen) startScreen.style.display = 'none';
  if (gameOverScreen) gameOverScreen.style.display = 'none';
  if (hud) hud.style.display = 'block';
  if (scoreEl) scoreEl.textContent = 'Score: 0';
  if (highScoreEl) highScoreEl.textContent = `Best: ${getHighScore()}`;

  // Initial obstacle
  spawnObstacle(scene, -45);
}

function handleGameOver() {
  gameState = 'GAMEOVER';

  const best = saveHighScore(score);

  if (hud) hud.style.display = 'none';
  if (gameOverScreen) gameOverScreen.style.display = 'block';
  if (finalScoreEl) finalScoreEl.textContent = score;
  if (bestScoreEl) bestScoreEl.textContent = best;
}

// -------------------------------------------------------------
// Input Handlers (Keyboard & Mobile Touch/Gestures)
// -------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    e.preventDefault();
    if (gameState === 'START') {
      startGame();
    } else if (gameState === 'PLAYING') {
      jump();
    } else if (gameState === 'GAMEOVER') {
      startGame();
    }
  } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    e.preventDefault();
    if (gameState === 'PLAYING') {
      setLane(-1);
    }
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    e.preventDefault();
    if (gameState === 'PLAYING') {
      setLane(1);
    }
  }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

window.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = performance.now();
  }
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (e.changedTouches.length === 0) return;

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const deltaTime = performance.now() - touchStartTime;

  if (gameState === 'START') {
    startGame();
    return;
  }
  if (gameState === 'GAMEOVER') {
    // Only restart if not clicking restart button directly
    if (!e.target.closest('#restart-btn')) {
      startGame();
    }
    return;
  }

  // Swipe or Tap detection
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
    // Horizontal swipe
    setLane(deltaX > 0 ? 1 : -1);
  } else if (deltaY < -30) {
    // Swipe Up to Jump
    jump();
  } else if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20 && deltaTime < 300) {
    // Quick Tap to Jump
    jump();
  }
}, { passive: true });

// UI Button Listeners
if (startScreen) {
  startScreen.addEventListener('click', () => {
    if (gameState === 'START') startGame();
  });
}

if (restartBtn) {
  restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
  });
}

// -------------------------------------------------------------
// Main Game Animation Loop
// -------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.1); // clamp to avoid physics jumps
  lastTime = now;

  if (gameState === 'PLAYING') {
    // Update player
    updatePlayer(player, delta);

    // Increase speed gradually over time
    currentSpeed = Math.min(baseSpeed + (distanceTraveled / 120), 45);

    // Advance world distance
    const frameDistance = currentSpeed * delta;
    distanceTraveled += frameDistance;
    distanceSinceLastSpawn += frameDistance;

    // Obstacle spawning
    if (distanceSinceLastSpawn >= nextSpawnDistance) {
      spawnObstacle(scene, -60);
      distanceSinceLastSpawn = 0;
      // Randomize distance for next obstacle (shorter distance as speed increases)
      nextSpawnDistance = Math.max(12, 22 - (currentSpeed * 0.2) + (Math.random() * 8));
    }

    // Update obstacles
    updateObstacles(scene, currentSpeed, delta);

    // Check for collisions
    if (checkCollision(player, getObstacles())) {
      handleGameOver();
    }

    // Update score (1 point per 2 meters)
    score = Math.floor(distanceTraveled / 2);
    if (scoreEl) scoreEl.textContent = `Score: ${score}`;
  } else {
    // Idle gentle hover animation in start / gameover state
    if (player) {
      player.position.y = 0.5 + Math.sin(now * 0.003) * 0.1;
    }
  }

  // Render Frame
  renderer.render(scene, camera);
}

animate();
