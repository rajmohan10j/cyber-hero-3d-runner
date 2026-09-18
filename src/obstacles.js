import * as THREE from 'three';

const LANE_POSITIONS = [-3, 0, 3];
const obstacles = [];
const particles = [];
const collectibles = [];

// Shared 3D Materials
const villainCrimson = new THREE.MeshLambertMaterial({ 
  color: 0xdc2626, // Crimson Armor
  emissive: 0x991b1b,
  emissiveIntensity: 0.15
});
const villainDarkSteel = new THREE.MeshLambertMaterial({ 
  color: 0x450a0a // Dark Armored Steel
});
const villainEyes = new THREE.MeshBasicMaterial({ 
  color: 0xfacc15 // Evil Glowing Yellow Eyes
});
const villainCore = new THREE.MeshBasicMaterial({ 
  color: 0xef4444 // Glowing Demon Core
});
const dronePurple = new THREE.MeshBasicMaterial({ 
  color: 0xa855f7 // Neon Purple Glow
});
const spikeMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xfacc15 
});
const goldMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xfbbf24 
});

// -------------------------------------------------------------
// 1. True 3D Volumetric Mecha-Goblin Villain
// -------------------------------------------------------------
function createMechaGoblin() {
  const group = new THREE.Group();
  group.userData.type = 'GOBLIN';

  // 1. Torso & Demon Armor
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.3, 0.85);
  const body = new THREE.Mesh(bodyGeo, villainCrimson);
  body.position.y = 1.2;
  group.add(body);

  // Chest Demon Plate
  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.2), villainDarkSteel);
  chestPlate.position.set(0, 1.3, 0.4);
  group.add(chestPlate);

  // Glowing Demonic Core
  const coreMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2, 0), villainCore);
  coreMesh.position.set(0, 1.3, 0.52);
  group.add(coreMesh);

  // 2. Head & Horns
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.05, 0);

  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.75), villainCrimson);
  headGroup.add(headMesh);

  // Evil Horns
  const hornGeo = new THREE.ConeGeometry(0.18, 0.6, 4);
  const leftHorn = new THREE.Mesh(hornGeo, villainDarkSteel);
  leftHorn.position.set(-0.45, 0.55, 0);
  leftHorn.rotation.z = 0.35;
  headGroup.add(leftHorn);

  const rightHorn = new THREE.Mesh(hornGeo, villainDarkSteel);
  rightHorn.position.set(0.45, 0.55, 0);
  rightHorn.rotation.z = -0.35;
  headGroup.add(rightHorn);

  // Glowing Eyes
  const eyeGeo = new THREE.BoxGeometry(0.26, 0.12, 0.1);
  const leftEye = new THREE.Mesh(eyeGeo, villainEyes);
  leftEye.position.set(-0.25, 0.08, 0.38);
  leftEye.rotation.z = -0.25;
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, villainEyes);
  rightEye.position.set(0.25, 0.08, 0.38);
  rightEye.rotation.z = 0.25;
  headGroup.add(rightEye);

  group.add(headGroup);

  // 3. Spiked Shoulders & Articulated Claw Arms
  const shoulderGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const spikeGeo = new THREE.ConeGeometry(0.16, 0.45, 4);
  spikeGeo.rotateX(Math.PI / 2);

  // Left Arm Group
  const armGroupL = new THREE.Group();
  armGroupL.position.set(-0.85, 1.6, 0);

  const shoulderL = new THREE.Mesh(shoulderGeo, villainDarkSteel);
  armGroupL.add(shoulderL);

  const spikeL = new THREE.Mesh(spikeGeo, villainCrimson);
  spikeL.position.set(-0.2, 0.1, 0.2);
  armGroupL.add(spikeL);

  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.85, 0.35), villainCrimson);
  armL.position.y = -0.45;
  armGroupL.add(armL);

  const clawL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.4), villainDarkSteel);
  clawL.position.set(0, -0.9, 0.1);
  armGroupL.add(clawL);

  group.add(armGroupL);

  // Right Arm Group
  const armGroupR = new THREE.Group();
  armGroupR.position.set(0.85, 1.6, 0);

  const shoulderR = new THREE.Mesh(shoulderGeo, villainDarkSteel);
  armGroupR.add(shoulderR);

  const spikeR = new THREE.Mesh(spikeGeo, villainCrimson);
  spikeR.position.set(0.2, 0.1, 0.2);
  armGroupR.add(spikeR);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.85, 0.35), villainCrimson);
  armR.position.y = -0.45;
  armGroupR.add(armR);

  const clawR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.4), villainDarkSteel);
  clawR.position.set(0, -0.9, 0.1);
  armGroupR.add(clawR);

  group.add(armGroupR);

  // 4. Stomping 3D Legs
  const legGroupL = new THREE.Group();
  legGroupL.position.set(-0.35, 0.55, 0);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.6, 0.35), villainDarkSteel);
  legL.position.y = -0.25;
  legGroupL.add(legL);
  group.add(legGroupL);

  const legGroupR = new THREE.Group();
  legGroupR.position.set(0.35, 0.55, 0);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.6, 0.35), villainDarkSteel);
  legR.position.y = -0.25;
  legGroupR.add(legR);
  group.add(legGroupR);

  group.userData = {
    type: 'GOBLIN',
    armGroupL,
    armGroupR,
    legGroupL,
    legGroupR,
    body,
    headGroup
  };

  return group;
}

// -------------------------------------------------------------
// 2. True 3D Cyber-Drone Fiend (Floating Villain Drone)
// -------------------------------------------------------------
function createCyberDrone() {
  const group = new THREE.Group();
  group.userData.type = 'DRONE';

  // 3D Core Sphere
  const coreMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 0), villainDarkSteel);
  coreMesh.position.y = 1.6;
  group.add(coreMesh);

  // Visor Eye Band
  const eyeBand = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 0.5), dronePurple);
  eyeBand.position.set(0, 1.6, 0.22);
  group.add(eyeBand);

  // Hover Wings
  const wings = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.65), villainCrimson);
  wings.position.set(0, 1.75, 0);
  group.add(wings);

  // Plasma Thruster
  const thrusterGeo = new THREE.ConeGeometry(0.22, 0.55, 6);
  thrusterGeo.rotateX(Math.PI);
  const thruster = new THREE.Mesh(thrusterGeo, villainEyes);
  thruster.position.set(0, 0.9, 0);
  group.add(thruster);

  group.userData = {
    type: 'DRONE',
    coreMesh,
    wings,
    thruster
  };

  return group;
}

// -------------------------------------------------------------
// 3. Spiked Armored Barrier (Hazard block)
// -------------------------------------------------------------
function createSpikeBarrier() {
  const group = new THREE.Group();
  group.userData.type = 'SPIKE_BARRIER';

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 0.85), villainDarkSteel);
  base.position.y = 0.35;
  group.add(base);

  const spikeGeo = new THREE.ConeGeometry(0.18, 0.65, 4);
  for (let i = -0.65; i <= 0.65; i += 0.43) {
    const spike = new THREE.Mesh(spikeGeo, villainCrimson);
    spike.position.set(i, 0.95, 0);
    group.add(spike);
  }

  const strip = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.1), villainEyes);
  strip.position.set(0, 0.35, 0.43);
  group.add(strip);

  return group;
}

// -------------------------------------------------------------
// 4. Collectible Gold Energy Crystals
// -------------------------------------------------------------
export function spawnCollectible(scene, spawnZ = -60) {
  if (!scene) return null;

  const group = new THREE.Group();
  const laneIndex = Math.floor(Math.random() * 3);
  const posX = LANE_POSITIONS[laneIndex];

  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), goldMaterial);
  group.add(crystal);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 6, 16), goldMaterial);
  group.add(ring);

  group.position.set(posX, 1.2, spawnZ);
  scene.add(group);
  collectibles.push(group);

  return group;
}

// -------------------------------------------------------------
// Spawning
// -------------------------------------------------------------
export function spawnObstacle(scene, spawnZ = -60) {
  if (!scene) return null;

  const laneIndex = Math.floor(Math.random() * 3);
  const posX = LANE_POSITIONS[laneIndex];

  const rand = Math.random();
  let obstacle;
  if (rand < 0.45) {
    obstacle = createMechaGoblin();
  } else if (rand < 0.75) {
    obstacle = createCyberDrone();
  } else {
    obstacle = createSpikeBarrier();
  }

  obstacle.position.set(posX, 0, spawnZ);
  scene.add(obstacle);
  obstacles.push(obstacle);

  if (Math.random() < 0.5) {
    spawnCollectible(scene, spawnZ - 10);
  }

  return obstacle;
}

// -------------------------------------------------------------
// Particle Explosion System
// -------------------------------------------------------------
export function createExplosion(scene, position, color = 0xef4444) {
  if (!scene) return;

  const particleCount = 20;
  const pGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const pMat = new THREE.MeshBasicMaterial({ color: color });

  for (let i = 0; i < particleCount; i++) {
    const p = new THREE.Mesh(pGeo, pMat);
    p.position.copy(position);

    p.userData = {
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * 9 + 3,
      vz: (Math.random() - 0.5) * 14,
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
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.position.z += speed * delta;

    // 3D Stomping / Marching Animations
    if (obs.userData.type === 'GOBLIN') {
      const stomp = Math.sin(time * 12 + obs.position.z) * 0.45;
      const { armGroupL, armGroupR, legGroupL, legGroupR, body } = obs.userData;

      if (armGroupL) armGroupL.rotation.x = stomp;
      if (armGroupR) armGroupR.rotation.x = -stomp;
      if (legGroupL) legGroupL.rotation.x = -stomp * 0.7;
      if (legGroupR) legGroupR.rotation.x = stomp * 0.7;
      if (body) body.position.y = 1.2 + Math.abs(Math.sin(time * 12)) * 0.1;

    } else if (obs.userData.type === 'DRONE') {
      obs.position.y = Math.sin(time * 5 + obs.position.z) * 0.3;
      if (obs.userData.wings) obs.userData.wings.rotation.y += 7 * delta;
    }

    if (obs.position.z > 8) {
      if (scene) scene.remove(obs);
      obstacles.splice(i, 1);
    }
  }

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

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.userData.life -= delta;

    if (p.userData.life <= 0) {
      if (scene) scene.remove(p);
      particles.splice(i, 1);
    } else {
      p.userData.vy -= 24 * delta;
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
