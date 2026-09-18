import * as THREE from 'three';

const LANE_WIDTH = 3;
const LANE_POSITIONS = [-LANE_WIDTH, 0, LANE_WIDTH];

const JUMP_FORCE = 16;
const GRAVITY = 38;

let currentLane = 1; // 0 = Left (-3), 1 = Center (0), 2 = Right (3)
let velocityY = 0;
let isJumping = false;
let runTime = 0;
let isShooting = false;
let shootTimer = 0;

// Texture Loader for High-Res Hero Artwork
const textureLoader = new THREE.TextureLoader();
const heroTexture = typeof document !== 'undefined' ? textureLoader.load('/assets/hero.jpg') : new THREE.Texture();

export function createHero() {
  const heroGroup = new THREE.Group();

  // 1. Hero 2.5D HD Character Cutout Card
  const heroGeo = new THREE.PlaneGeometry(1.7, 1.9);
  const heroMat = new THREE.MeshBasicMaterial({ 
    map: heroTexture,
    side: THREE.DoubleSide
  });
  const heroSprite = new THREE.Mesh(heroGeo, heroMat);
  heroSprite.position.y = 1.0;
  heroGroup.add(heroSprite);

  // 2. Glowing Cyan Border Frame
  const frameGeo = new THREE.BoxGeometry(1.76, 1.96, 0.08);
  const frameMat = new THREE.MeshLambertMaterial({ 
    color: 0x0284c7,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.4
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 1.0, -0.05);
  heroGroup.add(frame);

  // 3. Glowing Neon Thruster Ground Shadow Ring
  const ringGeo = new THREE.RingGeometry(0.35, 0.75, 24);
  const ringMat = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6
  });
  const shadowRing = new THREE.Mesh(ringGeo, ringMat);
  shadowRing.rotation.x = -Math.PI / 2;
  shadowRing.position.y = 0.02;
  heroGroup.add(shadowRing);

  // 4. Dual Plasma Muzzle Flashes
  const flashMat = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff,
    transparent: true,
    opacity: 0
  });
  const flashGeo = new THREE.ConeGeometry(0.2, 0.45, 6);
  flashGeo.rotateX(-Math.PI / 2);

  const leftFlash = new THREE.Mesh(flashGeo, flashMat);
  leftFlash.position.set(-0.75, 0.8, -0.4);
  heroGroup.add(leftFlash);

  const rightFlash = new THREE.Mesh(flashGeo, flashMat);
  rightFlash.position.set(0.75, 0.8, -0.4);
  heroGroup.add(rightFlash);

  heroGroup.userData = {
    heroSprite,
    frame,
    shadowRing,
    leftFlash,
    rightFlash
  };

  heroGroup.position.set(0, 0, 0);
  return heroGroup;
}

export function setLane(direction) {
  const newLane = currentLane + direction;
  if (newLane >= 0 && newLane <= 2) {
    currentLane = newLane;
  }
}

export function jump() {
  if (!isJumping) {
    isJumping = true;
    velocityY = JUMP_FORCE;
  }
}

export function triggerMuzzleFlash(hero) {
  isShooting = true;
  shootTimer = 0.1;
  if (hero && hero.userData) {
    const { leftFlash, rightFlash } = hero.userData;
    if (leftFlash && rightFlash) {
      leftFlash.material.opacity = 0.95;
      rightFlash.material.opacity = 0.95;
    }
  }
}

export function updatePlayer(hero, delta, isMoving = true) {
  if (!hero) return;

  runTime += delta * 14;

  // 1. Vertical Jump Physics
  if (isJumping) {
    velocityY -= GRAVITY * delta;
    hero.position.y += velocityY * delta;

    if (hero.position.y <= 0) {
      hero.position.y = 0;
      velocityY = 0;
      isJumping = false;
      hero.scale.set(1, 1, 1);
    } else {
      // Jump stretch animation
      hero.scale.set(0.9, 1.15, 1);
    }
  } else if (isMoving) {
    // Running stride hover bobbing
    const bob = Math.sin(runTime) * 0.08;
    const { heroSprite, frame, shadowRing } = hero.userData || {};
    if (heroSprite) heroSprite.position.y = 1.0 + bob;
    if (frame) frame.position.y = 1.0 + bob;
    if (shadowRing) {
      const ringScale = 1.0 + Math.sin(runTime * 2) * 0.15;
      shadowRing.scale.set(ringScale, ringScale, 1);
    }
  }

  // 2. Horizontal Lane Transition & Bank Lean
  const targetX = LANE_POSITIONS[currentLane];
  const diffX = targetX - hero.position.x;
  hero.position.x += diffX * 14 * delta;

  // Bank roll into turns
  const targetRoll = -diffX * 0.08;
  hero.rotation.z += (targetRoll - hero.rotation.z) * 12 * delta;

  // 3. Muzzle Flash Fade Out
  if (isShooting) {
    shootTimer -= delta;
    if (shootTimer <= 0) {
      isShooting = false;
      const { leftFlash, rightFlash } = hero.userData || {};
      if (leftFlash) leftFlash.material.opacity = 0;
      if (rightFlash) rightFlash.material.opacity = 0;
    }
  }
}

export function getLane() {
  return currentLane;
}

export function resetPlayer(hero) {
  currentLane = 1;
  velocityY = 0;
  isJumping = false;
  runTime = 0;
  isShooting = false;
  if (hero) {
    hero.position.set(0, 0, 0);
    hero.rotation.set(0, 0, 0);
    hero.scale.set(1, 1, 1);
  }
}

