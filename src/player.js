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

export function createHero() {
  const heroGroup = new THREE.Group();

  // Materials
  const armorMat = new THREE.MeshLambertMaterial({ 
    color: 0x0284c7, // Hero Blue Armor
    emissive: 0x0369a1,
    emissiveIntensity: 0.15
  });
  const chestPlateMat = new THREE.MeshLambertMaterial({ 
    color: 0x38bdf8 // Bright Cyan Accent
  });
  const visorMat = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff // Glowing Neon Cyan Visor
  });
  const coreMat = new THREE.MeshBasicMaterial({ 
    color: 0xfacc15 // Golden Power Core
  });
  const jetpackMat = new THREE.MeshLambertMaterial({ 
    color: 0x334155 // Dark Slate Jetpack
  });
  const flameMat = new THREE.MeshBasicMaterial({ 
    color: 0xf97316 // Orange/Yellow Plasma Flame
  });
  const blasterMat = new THREE.MeshLambertMaterial({ 
    color: 0x475569 // Gunmetal Blaster
  });
  const muzzleFlashMat = new THREE.MeshBasicMaterial({ 
    color: 0x38bdf8,
    transparent: true,
    opacity: 0
  });

  // 1. Torso
  const torsoGeo = new THREE.BoxGeometry(0.85, 0.9, 0.65);
  const torso = new THREE.Mesh(torsoGeo, armorMat);
  torso.position.y = 0.75;
  heroGroup.add(torso);

  // Chest Plate & Core
  const chestGeo = new THREE.BoxGeometry(0.65, 0.5, 0.1);
  const chest = new THREE.Mesh(chestGeo, chestPlateMat);
  chest.position.set(0, 0.8, -0.32);
  heroGroup.add(chest);

  const coreGeo = new THREE.BoxGeometry(0.25, 0.25, 0.05);
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 0.8, -0.36);
  heroGroup.add(core);

  // 2. Head & Visor
  const headGeo = new THREE.BoxGeometry(0.6, 0.55, 0.55);
  const head = new THREE.Mesh(headGeo, armorMat);
  head.position.set(0, 1.4, 0);
  heroGroup.add(head);

  // Hero Anime Visor (Eyes)
  const visorGeo = new THREE.BoxGeometry(0.52, 0.2, 0.08);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 1.4, -0.28);
  heroGroup.add(visor);

  // Antenna / Fin on head
  const finGeo = new THREE.ConeGeometry(0.08, 0.3, 4);
  const fin = new THREE.Mesh(finGeo, chestPlateMat);
  fin.position.set(0, 1.75, 0);
  heroGroup.add(fin);

  // 3. Dual Blaster Arms
  const blasterGeo = new THREE.BoxGeometry(0.2, 0.25, 0.85);
  
  const leftArm = new THREE.Mesh(blasterGeo, blasterMat);
  leftArm.position.set(-0.55, 0.7, -0.15);
  heroGroup.add(leftArm);

  const rightArm = new THREE.Mesh(blasterGeo, blasterMat);
  rightArm.position.set(0.55, 0.7, -0.15);
  heroGroup.add(rightArm);

  // Muzzle Flashes
  const flashGeo = new THREE.ConeGeometry(0.18, 0.4, 6);
  flashGeo.rotateX(-Math.PI / 2);

  const leftFlash = new THREE.Mesh(flashGeo, muzzleFlashMat);
  leftFlash.position.set(-0.55, 0.7, -0.7);
  heroGroup.add(leftFlash);

  const rightFlash = new THREE.Mesh(flashGeo, muzzleFlashMat);
  rightFlash.position.set(0.55, 0.7, -0.7);
  heroGroup.add(rightFlash);

  // 4. Jetpack & Flames
  const jetpackGeo = new THREE.BoxGeometry(0.55, 0.65, 0.25);
  const jetpack = new THREE.Mesh(jetpackGeo, jetpackMat);
  jetpack.position.set(0, 0.8, 0.4);
  heroGroup.add(jetpack);

  const flameGeo = new THREE.ConeGeometry(0.12, 0.45, 6);
  flameGeo.rotateX(Math.PI);

  const leftFlame = new THREE.Mesh(flameGeo, flameMat);
  leftFlame.position.set(-0.16, 0.35, 0.4);
  heroGroup.add(leftFlame);

  const rightFlame = new THREE.Mesh(flameGeo, flameMat);
  rightFlame.position.set(0.16, 0.35, 0.4);
  heroGroup.add(rightFlame);

  // 5. Animated Running Legs
  const legGeo = new THREE.BoxGeometry(0.26, 0.45, 0.28);

  const leftLeg = new THREE.Mesh(legGeo, armorMat);
  leftLeg.position.set(-0.25, 0.25, 0);
  heroGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, armorMat);
  rightLeg.position.set(0.25, 0.25, 0);
  heroGroup.add(rightLeg);

  // Store references for dynamic animation
  heroGroup.userData = {
    leftLeg,
    rightLeg,
    leftFlame,
    rightFlame,
    leftFlash,
    rightFlash,
    torso,
    head,
    leftArm,
    rightArm
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
  shootTimer = 0.1; // 100ms flash duration
  if (hero && hero.userData) {
    const { leftFlash, rightFlash } = hero.userData;
    if (leftFlash && rightFlash) {
      leftFlash.material.opacity = 0.9;
      rightFlash.material.opacity = 0.9;
    }
  }
}

export function updatePlayer(hero, delta, isMoving = true) {
  if (!hero) return;

  runTime += delta * 15;

  // 1. Vertical Jump Physics
  if (isJumping) {
    velocityY -= GRAVITY * delta;
    hero.position.y += velocityY * delta;

    if (hero.position.y <= 0) {
      hero.position.y = 0;
      velocityY = 0;
      isJumping = false;
      hero.rotation.x = 0;
    } else {
      // 360 Jump Flip
      hero.rotation.x += 10 * delta;
    }
  }

  // 2. Horizontal Lane Transition & Bank Lean
  const targetX = LANE_POSITIONS[currentLane];
  const diffX = targetX - hero.position.x;
  hero.position.x += diffX * 14 * delta;

  // Bank/tilt into turns (subtle roll on Z axis)
  const targetRoll = -diffX * 0.12;
  hero.rotation.z += (targetRoll - hero.rotation.z) * 12 * delta;

  // 3. Running & Jetpack Limb Animations
  const { leftLeg, rightLeg, leftFlame, rightFlame, leftFlash, rightFlash, torso, leftArm, rightArm } = hero.userData || {};

  if (!isJumping && isMoving) {
    // Leg stride animation
    const stride = Math.sin(runTime) * 0.45;
    if (leftLeg) leftLeg.position.z = stride;
    if (rightLeg) rightLeg.position.z = -stride;

    // Torso running bounce
    if (torso) torso.position.y = 0.75 + Math.abs(Math.sin(runTime * 2)) * 0.08;

    // Blaster arms slight aim bounce
    if (leftArm) leftArm.rotation.x = Math.sin(runTime) * 0.1;
    if (rightArm) rightArm.rotation.x = -Math.sin(runTime) * 0.1;

    // Jetpack flame pulsation
    const flameScale = 0.8 + Math.random() * 0.4;
    if (leftFlame) leftFlame.scale.set(1, flameScale, 1);
    if (rightFlame) rightFlame.scale.set(1, flameScale, 1);
  } else if (isJumping) {
    // Tucked legs during jump
    if (leftLeg) leftLeg.position.z = 0.1;
    if (rightLeg) rightLeg.position.z = 0.1;
    // Supercharged jetpack during jump
    if (leftFlame) leftFlame.scale.set(1.4, 1.8, 1.4);
    if (rightFlame) rightFlame.scale.set(1.4, 1.8, 1.4);
  }

  // 4. Muzzle Flash Fade Out
  if (isShooting) {
    shootTimer -= delta;
    if (shootTimer <= 0) {
      isShooting = false;
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
  }
}
