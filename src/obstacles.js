import * as THREE from 'three';

const LANE_POSITIONS = [-3, 0, 3];
const obstacles = [];
const particles = [];
const collectibles = [];

// Shared Materials
const villainArmorMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 }); // Crimson Red
const villainDarkMat = new THREE.MeshLambertMaterial({ color: 0x450a0a }); // Dark Crimson
const villainEyeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // Glowing Yellow Eyes
const villainPurpleMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 }); // Evil Purple Glow
const goldMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 }); // Golden Collectibles

// -------------------------------------------------------------
// Villain Monster Creators
// -------------------------------------------------------------

// 1. Mecha-Goblin Stomper (Angry horned red mech)
function createMechaGoblin() {
  const group = new THREE.Group();
  group.userData.type = 'GOBLIN';

  // Body
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.3, 0.9);
  const body = new THREE.Mesh(bodyGeo, villainArmorMat);
  body.position.y = 1.0;
  group.add(body);

  // Evil Horns
  const hornGeo = new THREE.ConeGeometry(0.18, 0.5, 4);
  const leftHorn = new THREE.Mesh(hornGeo, villainDarkMat);
  leftHorn.position.set(-0.45, 1.8, 0);
  leftHorn.rotation.z = 0.3;
  group.add(leftHorn);

  const rightHorn = new THREE.Mesh(hornGeo, villainDarkMat);
  rightHorn.position.set(0.45, 1.8, 0);
  rightHorn.rotation.z = -0.3;
  group.add(rightHorn);

  // Glowing Villain Eyes (Slanted angry eyes)
  const eyeGeo = new THREE.BoxGeometry(0.3, 0.12, 0.1);
  const leftEye = new THREE.Mesh(eyeGeo, villainEyeMat);
  leftEye.position.set(-0.28, 1.2, 0.46);
  leftEye.rotation.z = -0.2;
  group.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, villainEyeMat);
  rightEye.position.set(0.28, 1.2, 0.46);
  rightEye.rotation.z = 0.2;
  group.add(rightEye);

  // Spiked Shoulder Pads
  const spikeGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
  spikeGeo.rotateX(Math.PI / 2);
  const leftSpike = new THREE.Mesh(spikeGeo, villainDarkMat);
  leftSpike.position.set(-0.7, 1.3, 0.1);
  group.add(leftSpike);

  const rightSpike = new THREE.Mesh(spikeGeo, villainDarkMat);
  rightSpike.position.set(0.7, 1.3, 0.1);
  group.add(rightSpike);

  // Claw Arms
  const armGeo = new THREE.BoxGeometry(0.25, 0.8, 0.3);
  const leftArm = new THREE.Mesh(armGeo, villainDarkMat);
  leftArm.position.set(-0.75, 0.8, 0.1);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, villainDarkMat);
  rightArm.position.set(0.75, 0.8, 0.1);
  group.add(rightArm);

  group.userData.leftArm = leftArm;
  group.userData.rightArm = rightArm;
  group.userData.body = body;

  return group;
}

// 2. Cyber-Drone Fiend (Floating menacing drone)
function createCyberDrone() {
  const group = new THREE.Group();
  group.userData.type = 'DRONE';

  // Floating Core Sphere
  const coreGeo = new THREE.DodecahedronGeometry(0.65, 0);
  const core = new THREE.Mesh(coreGeo, villainDarkMat);
  core.position.y = 1.6;
  group.add(core);

  // Visor Eye Band
  const eyeBandGeo = new THREE.BoxGeometry(1.0, 0.2, 0.5);
  const eyeBand = new THREE.Mesh(eyeBandGeo, villainPurpleMat);
  eyeBand.position.set(0, 1.6, 0.2);
  group.add(eyeBand);

  // Hover Wings
  const wingGeo = new THREE.BoxGeometry(1.6, 0.12, 0.6);
  const wings = new THREE.Mesh(wingGeo, villainArmorMat);
  wings.position.set(0, 1.75, 0);
  group.add(wings);

  // Plasma Thruster
  const thrusterGeo = new THREE.ConeGeometry(0.2, 0.5, 6);
  thrusterGeo.rotateX(Math.PI);
  const thruster = new THREE.Mesh(thrusterGeo, villainEyeMat);
  thruster.position.set(0, 0.9, 0);
  group.add(thruster);

  group.userData.core = core;
  group.userData.wings = wings;
  group.userData.thruster = thruster;

  return group;
}

// 3. Spiked Armored Barrier (Low jumpable hazard)
function createSpikeBarrier() {
  const group = new THREE.Group();
  group.userData.type = 'SPIKE_BARRIER';

  // Base Bar
  const baseGeo = new THREE.BoxGeometry(1.8, 0.7, 0.8);
  const base = new THREE.Mesh(baseGeo, villainDarkMat);
  base.position.y = 0.35;
  group.add(base);

  // Spikes Row
  const spikeGeo = new THREE.ConeGeometry(0.18, 0.6, 4);
  for (let i = -0.6; i <= 0.6; i += 0.4) {
    const spike = new THREE.Mesh(spikeGeo, villainArmorMat);
    spike.position.set(i, 0.9, 0);
    group.add(spike);
  }

  // Glowing Warning Strip
  const stripGeo = new THREE.BoxGeometry(1.6, 0.1, 0.1);
  const strip = new THREE.Mesh(stripGeo, villainEyeMat);
  strip.position.set(0, 0.35, 0.41);
  group.add(strip);

  return group;
}

// -------------------------------------------------------------
// Collectible Gold Energy Crystals
// -------------------------------------------------------------
export function spawnCollectible(scene, spawnZ = -60) {
  if (!scene) return null;

  const group = new THREE.Group();
  const laneIndex = Math.floor(Math.random() * 3);
  const posX = LANE_POSITIONS[laneIndex];

  // Octahedron Diamond Crystal
  const geo = new THREE.OctahedronGeometry(0.35, 0);
  const crystal = new THREE.Mesh(geo, goldMat);
  group.add(crystal);

  // Outer Ring
  const ringGeo = new THREE.TorusGeometry(0.48, 0.04, 6, 16);
  const ring = new THREE.Mesh(ringGeo, goldMat);
  group.add(ring);

  group.position.set(posX, 1.1, spawnZ);
  scene.add(group);
  collectibles.push(group);

  return group;
}

// -------------------------------------------------------------
// Spawning & Management
// -------------------------------------------------------------
export function spawnObstacle(scene, spawnZ = -60) {
  if (!scene) return null;

  const laneIndex = Math.floor(Math.random() * 3);
  const posX = LANE_POSITIONS[laneIndex];

  // Randomize Villain Type
  const rand = Math.random();
  let villain;
  if (rand < 0.45) {
    villain = createMechaGoblin();
  } else if (rand < 0.75) {
    villain = createCyberDrone();
  } else {
    villain = createSpikeBarrier();
  }

  villain.position.set(posX, 0, spawnZ);
  scene.add(villain);
  obstacles.push(villain);

  // Chance to spawn a collectible in a different lane
  if (Math.random() < 0.5) {
    spawnCollectible(scene, spawnZ - 10);
  }

  return villain;
}

// -------------------------------------------------------------
// Particle Explosion System
// -------------------------------------------------------------
export function createExplosion(scene, position, color = 0xff3b30) {
  if (!scene) return;

  const particleCount = 18;
  const pGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
  const pMat = new THREE.MeshBasicMaterial({ color: color });

  for (let i = 0; i < particleCount; i++) {
    const p = new THREE.Mesh(pGeo, pMat);
    p.position.copy(position);

    // Random explosive velocity vectors
    p.userData = {
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * 8 + 3,
      vz: (Math.random() - 0.5) * 12,
      life: 0.6 + Math.random() * 0.4
    };

    scene.add(p);
    particles.push(p);
  }
}

// -------------------------------------------------------------
// Update Loop
// -------------------------------------------------------------
export function updateObstacles(scene, speed, delta, time = 0) {
  // 1. Update Villains
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.position.z += speed * delta;

    // Villain Animations
    if (obs.userData.type === 'GOBLIN') {
      const stomp = Math.sin(time * 12 + obs.position.z) * 0.3;
      if (obs.userData.leftArm) obs.userData.leftArm.rotation.x = stomp;
      if (obs.userData.rightArm) obs.userData.rightArm.rotation.x = -stomp;
      if (obs.userData.body) obs.userData.body.position.y = 1.0 + Math.abs(Math.sin(time * 10)) * 0.1;
    } else if (obs.userData.type === 'DRONE') {
      obs.position.y = Math.sin(time * 5 + obs.position.z) * 0.25;
      if (obs.userData.wings) obs.userData.wings.rotation.y += 8 * delta;
    }

    // Clean up when behind camera
    if (obs.position.z > 8) {
      if (scene) scene.remove(obs);
      obstacles.splice(i, 1);
    }
  }

  // 2. Update Collectibles
  for (let i = collectibles.length - 1; i >= 0; i--) {
    const col = collectibles[i];
    col.position.z += speed * delta;
    col.rotation.y += 4 * delta;
    col.rotation.x += 2 * delta;

    if (col.position.z > 8) {
      if (scene) scene.remove(col);
      collectibles.splice(i, 1);
    }
  }

  // 3. Update Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.userData.life -= delta;

    if (p.userData.life <= 0) {
      if (scene) scene.remove(p);
      particles.splice(i, 1);
    } else {
      p.userData.vy -= 22 * delta; // Gravity
      p.position.x += p.userData.vx * delta;
      p.position.y += p.userData.vy * delta;
      p.position.z += p.userData.vz * delta;
      p.scale.multiplyScalar(0.94);
    }
  }
}

export function removeObstacle(scene, index) {
  if (index >= 0 && index < obstacles.length) {
    const obs = obstacles[index];
    if (scene) scene.remove(obs);
    obstacles.splice(index, 1);
  }
}

export function removeCollectible(scene, index) {
  if (index >= 0 && index < collectibles.length) {
    const col = collectibles[index];
    if (scene) scene.remove(col);
    collectibles.splice(index, 1);
  }
}

export function resetObstacles(scene) {
  for (const obs of obstacles) {
    if (scene) scene.remove(obs);
  }
  obstacles.length = 0;

  for (const col of collectibles) {
    if (scene) scene.remove(col);
  }
  collectibles.length = 0;

  for (const p of particles) {
    if (scene) scene.remove(p);
  }
  particles.length = 0;
}

export function getObstacles() {
  return obstacles;
}

export function getCollectibles() {
  return collectibles;
}
