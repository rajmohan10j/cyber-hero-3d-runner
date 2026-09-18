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

  // Premium 3D Shaders & Materials
  const armorPrimary = new THREE.MeshLambertMaterial({ 
    color: 0x0284c7, // Deep Cyber Blue
    emissive: 0x0369a1,
    emissiveIntensity: 0.15
  });
  const armorCyan = new THREE.MeshLambertMaterial({ 
    color: 0x38bdf8, // Electric Cyan Highlights
    emissive: 0x0284c7,
    emissiveIntensity: 0.1
  });
  const darkMetal = new THREE.MeshLambertMaterial({ 
    color: 0x1e293b // Dark Titanium
  });
  const glowingVisor = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff // Neon Cyan Visor Eye
  });
  const goldenCore = new THREE.MeshBasicMaterial({ 
    color: 0xfacc15 // Golden Chest Reactor Core
  });
  const jetpackMetal = new THREE.MeshLambertMaterial({ 
    color: 0x334155 
  });
  const plasmaFlame = new THREE.MeshBasicMaterial({ 
    color: 0xf97316 // Fiery Orange Jet Exhaust
  });
  const blasterCoil = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff // Glowing Blaster Energy Coils
  });
  const muzzleFlashMat = new THREE.MeshBasicMaterial({ 
    color: 0x38bdf8,
    transparent: true,
    opacity: 0
  });

  // 1. Torso & Armor (3D Volumetric)
  const torsoGeo = new THREE.BoxGeometry(0.85, 0.9, 0.65);
  const torso = new THREE.Mesh(torsoGeo, armorPrimary);
  torso.position.y = 0.85;
  heroGroup.add(torso);

  // Chest Armor Plate
  const chestPlateGeo = new THREE.BoxGeometry(0.72, 0.55, 0.15);
  const chestPlate = new THREE.Mesh(chestPlateGeo, armorCyan);
  chestPlate.position.set(0, 0.9, -0.32);
  heroGroup.add(chestPlate);

  // Glowing Arc Reactor Core
  const coreGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 16);
  coreGeo.rotateX(Math.PI / 2);
  const core = new THREE.Mesh(coreGeo, goldenCore);
  core.position.set(0, 0.9, -0.38);
  heroGroup.add(core);

  // Belt / Waist
  const waistGeo = new THREE.BoxGeometry(0.78, 0.18, 0.58);
  const waist = new THREE.Mesh(waistGeo, darkMetal);
  waist.position.set(0, 0.45, 0);
  heroGroup.add(waist);

  // 2. Head & Helmet (3D Volumetric)
  const headGeo = new THREE.BoxGeometry(0.58, 0.52, 0.55);
  const head = new THREE.Mesh(headGeo, armorPrimary);
  head.position.set(0, 1.45, 0);
  heroGroup.add(head);

  // Glowing Anime Visor (Eyes)
  const visorGeo = new THREE.BoxGeometry(0.48, 0.18, 0.12);
  const visor = new THREE.Mesh(visorGeo, glowingVisor);
  visor.position.set(0, 1.45, -0.26);
  heroGroup.add(visor);

  // Helmet Top Fin
  const finGeo = new THREE.BoxGeometry(0.08, 0.22, 0.45);
  const fin = new THREE.Mesh(finGeo, armorCyan);
  fin.position.set(0, 1.76, -0.05);
  heroGroup.add(fin);

  // 3. Jetpack Thrusters (Back)
  const jetpackBaseGeo = new THREE.BoxGeometry(0.65, 0.6, 0.25);
  const jetpackBase = new THREE.Mesh(jetpackBaseGeo, jetpackMetal);
  jetpackBase.position.set(0, 0.9, 0.38);
  heroGroup.add(jetpackBase);

  // Dual Exhaust Cylinders
  const thrusterCylinderGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.4, 12);
  
  const leftCyl = new THREE.Mesh(thrusterCylinderGeo, darkMetal);
  leftCyl.position.set(-0.2, 0.75, 0.46);
  heroGroup.add(leftCyl);

  const rightCyl = new THREE.Mesh(thrusterCylinderGeo, darkMetal);
  rightCyl.position.set(0.2, 0.75, 0.46);
  heroGroup.add(rightCyl);

  // Jetpack Plasma Exhaust Flames
  const flameGeo = new THREE.ConeGeometry(0.11, 0.45, 8);
  flameGeo.rotateX(Math.PI);

  const leftFlame = new THREE.Mesh(flameGeo, plasmaFlame);
  leftFlame.position.set(-0.2, 0.42, 0.46);
  heroGroup.add(leftFlame);

  const rightFlame = new THREE.Mesh(flameGeo, plasmaFlame);
  rightFlame.position.set(0.2, 0.42, 0.46);
  heroGroup.add(rightFlame);

  // 4. Arms & Dual Mounted Plasma Blasters (Left & Right)
  const shoulderGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
  const armGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
  const cannonGeo = new THREE.BoxGeometry(0.24, 0.24, 0.75);
  const coilGeo = new THREE.BoxGeometry(0.26, 0.12, 0.35);

  // Left Arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.55, 0.95, 0);

  const leftShoulder = new THREE.Mesh(shoulderGeo, armorCyan);
  leftArmGroup.add(leftShoulder);

  const leftArm = new THREE.Mesh(armGeo, darkMetal);
  leftArm.position.y = -0.25;
  leftArmGroup.add(leftArm);

  const leftCannon = new THREE.Mesh(cannonGeo, darkMetal);
  leftCannon.position.set(0, -0.2, -0.3);
  leftArmGroup.add(leftCannon);

  const leftCoil = new THREE.Mesh(coilGeo, blasterCoil);
  leftCoil.position.set(0, -0.2, -0.28);
  leftArmGroup.add(leftCoil);

  heroGroup.add(leftArmGroup);

  // Right Arm
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.55, 0.95, 0);

  const rightShoulder = new THREE.Mesh(shoulderGeo, armorCyan);
  rightArmGroup.add(rightShoulder);

  const rightArm = new THREE.Mesh(armGeo, darkMetal);
  rightArm.position.y = -0.25;
  rightArmGroup.add(rightArm);

  const rightCannon = new THREE.Mesh(cannonGeo, darkMetal);
  rightCannon.position.set(0, -0.2, -0.3);
  rightArmGroup.add(rightCannon);

  const rightCoil = new THREE.Mesh(coilGeo, blasterCoil);
  rightCoil.position.set(0, -0.2, -0.28);
  rightArmGroup.add(rightCoil);

  heroGroup.add(rightArmGroup);

  // Muzzle Flashes
  const flashGeo = new THREE.ConeGeometry(0.18, 0.45, 6);
  flashGeo.rotateX(-Math.PI / 2);

  const leftFlash = new THREE.Mesh(flashGeo, muzzleFlashMat);
  leftFlash.position.set(-0.55, 0.75, -0.9);
  heroGroup.add(leftFlash);

  const rightFlash = new THREE.Mesh(flashGeo, muzzleFlashMat);
  rightFlash.position.set(0.55, 0.75, -0.9);
  heroGroup.add(rightFlash);

  // 5. Articulated Running Legs (Thighs + Shins + Boots)
  const legGroupL = new THREE.Group();
  legGroupL.position.set(-0.25, 0.4, 0);

  const thighL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 0.24), armorPrimary);
  thighL.position.y = -0.18;
  legGroupL.add(thighL);

  const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.38), darkMetal);
  bootL.position.set(0, -0.35, -0.06);
  legGroupL.add(bootL);

  heroGroup.add(legGroupL);

  const legGroupR = new THREE.Group();
  legGroupR.position.set(0.25, 0.4, 0);

  const thighR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 0.24), armorPrimary);
  thighR.position.y = -0.18;
  legGroupR.add(thighR);

  const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.38), darkMetal);
  bootR.position.set(0, -0.35, -0.06);
  legGroupR.add(bootR);

  heroGroup.add(legGroupR);

  // Store references for animations
  heroGroup.userData = {
    torso,
    head,
    leftArmGroup,
    rightArmGroup,
    legGroupL,
    legGroupR,
    leftFlame,
    rightFlame,
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

  runTime += delta * 15;

  // 1. Vertical Jump Physics & 3D Flip
  if (isJumping) {
    velocityY -= GRAVITY * delta;
    hero.position.y += velocityY * delta;

    if (hero.position.y <= 0) {
      hero.position.y = 0;
      velocityY = 0;
      isJumping = false;
      hero.rotation.x = 0;
    } else {
      // 3D Acrobatic Jump Roll
      hero.rotation.x += 9.5 * delta;
    }
  }

  // 2. Horizontal Lane Transition & 3D Dynamic Bank Tilt
  const targetX = LANE_POSITIONS[currentLane];
  const diffX = targetX - hero.position.x;
  hero.position.x += diffX * 14 * delta;

  // Bank roll into turns
  const targetRoll = -diffX * 0.12;
  hero.rotation.z += (targetRoll - hero.rotation.z) * 12 * delta;

  // 3. True 3D Stride & Limb Animations
  const { torso, leftArmGroup, rightArmGroup, legGroupL, legGroupR, leftFlame, rightFlame, leftFlash, rightFlash } = hero.userData || {};

  if (!isJumping && isMoving) {
    const stride = Math.sin(runTime) * 0.55;

    // Running legs swing
    if (legGroupL) legGroupL.rotation.x = stride;
    if (legGroupR) legGroupR.rotation.x = -stride;

    // Arm blasters counter-swing
    if (leftArmGroup) leftArmGroup.rotation.x = -stride * 0.45;
    if (rightArmGroup) rightArmGroup.rotation.x = stride * 0.45;

    // Torso running bounce
    if (torso) torso.position.y = 0.85 + Math.abs(Math.sin(runTime * 2)) * 0.08;

    // Jetpack exhaust flame pulsation
    const flameScale = 0.8 + Math.random() * 0.4;
    if (leftFlame) leftFlame.scale.set(1, flameScale, 1);
    if (rightFlame) rightFlame.scale.set(1, flameScale, 1);
  } else if (isJumping) {
    // Tucked jump legs
    if (legGroupL) legGroupL.rotation.x = 0.6;
    if (legGroupR) legGroupR.rotation.x = 0.6;
    // Overcharged jetpack during jump
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
