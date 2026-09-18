import { initScene, createGround } from './scene.js';
import { createHero, updatePlayer, resetPlayer, jump, setLane, triggerMuzzleFlash } from './player.js';
import { spawnObstacle, updateObstacles, resetObstacles, getObstacles, getCollectibles, createExplosion } from './obstacles.js';
import { fireLaser, updateLasers, resetLasers } from './weapons.js';
import { checkCollision, checkCollectiblePickup } from './collision.js';
import { getHighScore, saveHighScore } from './storage.js';
import { audio } from './audio.js';

// Setup Scene & Core Objects
const { scene, camera, renderer } = initScene();
const player = createHero();
scene.add(player);

const ground = createGround();
scene.add(ground);

// UI Elements
const startScreen = document.getElementById('start-screen');
const hud = document.getElementById('hud');
const scoreEl = document.getElementById('score');
const killsEl = document.getElementById('kills-count');
const highScoreEl = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const finalKillsEl = document.getElementById('final-kills');
const bestScoreEl = document.getElementById('best-score');
const restartBtn = document.getElementById('restart-btn');
const combatPopup = document.getElementById('combat-popup');

// Mobile In-Game Action Buttons
const mobileControls = document.getElementById('mobile-controls');
const btnMobileJump = document.getElementById('btn-mobile-jump');
const btnMobileFire = document.getElementById('btn-mobile-fire');

// Game State
let gameState = 'START'; // 'START' | 'PLAYING' | 'GAMEOVER'
let score = 0;
let kills = 0;
let distanceTraveled = 0;
let baseSpeed = 22;
let currentSpeed = baseSpeed;
let nextSpawnDistance = 14;
let distanceSinceLastSpawn = 0;
let lastTime = performance.now();
let cameraShake = 0;

// Initialize High Score Display
const initialBest = getHighScore();
if (highScoreEl) highScoreEl.textContent = `Best: ${initialBest}`;

// -------------------------------------------------------------
// Combat Popup Notice (Anime Style "BOOM! +50")
// -------------------------------------------------------------
function showPopup(text, color = '#38bdf8') {
  if (!combatPopup) return;
  combatPopup.textContent = text;
  combatPopup.style.color = color;
  combatPopup.style.opacity = '1';
  combatPopup.style.transform = 'translate(-50%, -50%) scale(1.2)';

  setTimeout(() => {
    combatPopup.style.opacity = '0';
    combatPopup.style.transform = 'translate(-50%, -80%) scale(0.9)';
  }, 450);
}

// -------------------------------------------------------------
// Game Lifecycle Functions
// -------------------------------------------------------------
function startGame() {
  audio.init();
  gameState = 'PLAYING';
  score = 0;
  kills = 0;
  distanceTraveled = 0;
  distanceSinceLastSpawn = 0;
  currentSpeed = baseSpeed;
  nextSpawnDistance = 14;

  resetPlayer(player);
  resetObstacles(scene);
  resetLasers(scene);

  // Update UI
  if (startScreen) startScreen.style.display = 'none';
  if (gameOverScreen) gameOverScreen.style.display = 'none';
  if (hud) hud.style.display = 'block';
  if (mobileControls) mobileControls.style.display = 'flex';
  if (scoreEl) scoreEl.textContent = 'Score: 0';
  if (killsEl) killsEl.textContent = 'Kills: 0';
  if (highScoreEl) highScoreEl.textContent = `Best: ${getHighScore()}`;

  // Initial obstacle
  spawnObstacle(scene, -45);
}

function handleGameOver() {
  gameState = 'GAMEOVER';
  audio.playGameOver();

  // Trigger defeat explosion on hero
  createExplosion(scene, player.position, 0x38bdf8);

  const best = saveHighScore(score);

  if (hud) hud.style.display = 'none';
  if (mobileControls) mobileControls.style.display = 'none';
  if (gameOverScreen) gameOverScreen.style.display = 'block';
  if (finalScoreEl) finalScoreEl.textContent = score;
  if (finalKillsEl) finalKillsEl.textContent = kills;
  if (bestScoreEl) bestScoreEl.textContent = best;
}

function handleShoot() {
  if (gameState !== 'PLAYING') return;
  triggerMuzzleFlash(player);
  fireLaser(scene, player);
  audio.playLaser();
}

function handleJump() {
  if (gameState !== 'PLAYING') return;
  jump();
  audio.playJump();
}

// -------------------------------------------------------------
// Input Handlers (Keyboard, Mouse & Mobile Touch)
// -------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    e.preventDefault();
    if (gameState === 'START') {
      startGame();
    } else if (gameState === 'PLAYING') {
      handleJump();
    } else if (gameState === 'GAMEOVER') {
      startGame();
    }
  } else if (e.code === 'KeyF' || e.code === 'KeyJ' || e.code === 'KeyE') {
    e.preventDefault();
    handleShoot();
  } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    e.preventDefault();
    if (gameState === 'PLAYING') setLane(-1);
  } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    e.preventDefault();
    if (gameState === 'PLAYING') setLane(1);
  }
});

// Click / Left-Click on screen to shoot during gameplay
window.addEventListener('mousedown', (e) => {
  if (e.target.closest('#mobile-controls') || e.target.closest('.modal-card')) return;
  if (gameState === 'PLAYING') {
    handleShoot();
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
  // Ignore touches on UI buttons
  if (e.target.closest('#mobile-controls') || e.target.closest('.modal-card')) return;
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
    if (!e.target.closest('#restart-btn')) {
      startGame();
    }
    return;
  }

  // Swipe or Tap detection
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
    // Horizontal swipe for lane switch
    setLane(deltaX > 0 ? 1 : -1);
  } else if (deltaY < -35) {
    // Swipe Up to Jump
    handleJump();
  } else if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20 && deltaTime < 250) {
    // Tap to Shoot
    handleShoot();
  }
}, { passive: true });

// Mobile On-Screen Action Buttons
if (btnMobileJump) {
  btnMobileJump.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleJump();
  });
}

if (btnMobileFire) {
  btnMobileFire.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleShoot();
  });
}

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
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  const time = now * 0.001;

  if (gameState === 'PLAYING') {
    // 1. Update Player
    updatePlayer(player, delta, true);

    // 2. Increase speed gradually
    currentSpeed = Math.min(baseSpeed + (distanceTraveled / 100), 48);

    // 3. Advance world distance
    const frameDistance = currentSpeed * delta;
    distanceTraveled += frameDistance;
    distanceSinceLastSpawn += frameDistance;

    // 4. Obstacle & Villain spawning
    if (distanceSinceLastSpawn >= nextSpawnDistance) {
      spawnObstacle(scene, -65);
      distanceSinceLastSpawn = 0;
      nextSpawnDistance = Math.max(12, 22 - (currentSpeed * 0.18) + (Math.random() * 7));
    }

    // 5. Update Obstacles & Particles
    updateObstacles(scene, currentSpeed, delta, time);

    // 6. Update Lasers & Weapon Hits on Villains
    updateLasers(scene, delta, getObstacles(), (hitVillain, pos) => {
      kills++;
      score += 50; // +50 points per villain kill
      cameraShake = 0.25;
      audio.playExplosion();
      showPopup('💥 DESTROYED! +50', '#ef4444');

      if (killsEl) killsEl.textContent = `Kills: ${kills}`;
      if (scoreEl) scoreEl.textContent = `Score: ${score}`;
    });

    // 7. Check Collectible Pickups
    checkCollectiblePickup(scene, player, getCollectibles(), () => {
      score += 20; // +20 points for energy crystal
      audio.playCoin();
      showPopup('⭐ ENERGY! +20', '#facc15');
      if (scoreEl) scoreEl.textContent = `Score: ${score}`;
    });

    // 8. Check for Player Collision with Villains
    if (checkCollision(player, getObstacles())) {
      handleGameOver();
    }

    // 9. Update distance score
    score += Math.floor(frameDistance * 0.5);
    if (scoreEl) scoreEl.textContent = `Score: ${score}`;

  } else {
    // Idle gentle hover animation in start / gameover state
    if (player) {
      player.position.y = Math.sin(now * 0.003) * 0.12;
      updatePlayer(player, delta, false);
    }
  }

  // Camera Shake Effect on explosions
  if (cameraShake > 0) {
    camera.position.x += (Math.random() - 0.5) * cameraShake;
    camera.position.y += (Math.random() - 0.5) * cameraShake;
    cameraShake -= delta * 1.5;
    if (cameraShake < 0) cameraShake = 0;
  }

  // Render Frame
  renderer.render(scene, camera);
}

animate();
