import * as THREE from 'three';

const LANE_POSITIONS = [-3, 0, 3];
const obstacles = [];
const particles = [];
const collectibles = [];

// Texture Loader for High-Res Villain Artwork
const textureLoader = new THREE.TextureLoader();
const villainTexture = typeof document !== 'undefined' ? textureLoader.load('/assets/villain.jpg') : new THREE.Texture();

// Shared Materials
const villainMat = new THREE.MeshBasicMaterial({ 
  map: villainTexture,
  side: THREE.DoubleSide
});

const villainFrameMat = new THREE.MeshLambertMaterial({ 
  color: 0x991b1b,
  emissive: 0xef4444,
  emissiveIntensity: 0.5
});

const redRingMat = new THREE.MeshBasicMaterial({ 
  color: 0xef4444,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.6
});

const barrierMat = new THREE.MeshLambertMaterial({ color: 0x7f1d1d });
const spikeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
const goldMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

// -------------------------------------------------------------
// 1. High-Res Mecha Villain Monster Cutout
// -------------------------------------------------------------
function createMechaVillain() {
  const group = new THREE.Group();
  group.userData.type = 'VILLAIN';

  // Character Artwork Cutout Plane
  const charGeo = new THREE.PlaneGeometry(2.0, 2.3);
  const charMesh = new THREE.Mesh(charGeo, villainMat);
  charMesh.position.y = 1.15;
  group.add(charMesh);

  // Fiery Red Border Frame
  const frameGeo = new THREE.BoxGeometry(2.08, 2.38, 0.08);
  const frame = new THREE.Mesh(frameGeo, villainFrameMat);
  frame.position.set(0, 1.15, -0.05);
  group.add(frame);

  // Evil Ground Shadow Aura Ring
  const ringGeo = new THREE.RingGeometry(0.4, 0.9, 24);
  const shadowRing = new THREE.Mesh(ringGeo, redRingMat);
  shadowRing.rotation.x = -Math.PI / 2;
  shadowRing.position.y = 0.02;
  group.add(shadowRing);

  // Evil Spikes on Top Corners
  const spikeGeo = new THREE.ConeGeometry(0.18, 0.5, 4);
  const leftSpike = new THREE.Mesh(spikeGeo, spikeMat);
  leftSpike.position.set(-0.95, 2.45, 0);
  leftSpike.rotation.z = 0.3;
  group.add(leftSpike);

  const rightSpike = new THREE.Mesh(spikeGeo, spikeMat);
  rightSpike.position.set(0.95, 2.45, 0);
  rightSpike.rotation.z = -0.3;
  group.add(rightSpike);

  group.userData.charMesh = charMesh;
  group.userData.frame = frame;
  group.userData.shadowRing = shadowRing;

  return group;
}

// -------------------------------------------------------------
// 2. Spiked Low Barrier (Jumpable Hazard)
// -------------------------------------------------------------
function createSpikeBarrier() {
  const group = new THREE.Group();
  group.userData.type = 'SPIKE_BARRIER';

  // Base Bar
  const baseGeo = new THREE.BoxGeometry(1.8, 0.7, 0.8);
  const base = new THREE.Mesh(baseGeo, barrierMat);
  base.position.y = 0.35;
  group.add(base);

  // Spikes Row
  const spikeGeo = new THREE.ConeGeometry(0.18, 0.6, 4);
  for (let i = -0.6; i <= 0.6; i += 0.4) {
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.set(i, 0.9, 0);
    group.add(spike);
  }

  return group;
}

// -------------------------------------------------------------
// 3. Collectible Gold Energy Crystals
// -------------------------------------------------------------
export function spawnCollectible(scene, spawnZ = -60) {
  if (!scene) return null;

  const group = new THREE.Group();
  const laneIndex = Math.floor(Math.random() * 3);
  const posX = LANE_POSITIONS[laneIndex];

  const geo = new THREE.OctahedronGeometry(0.38, 0);
  const crystal = new THREE.Mesh(geo, goldMat);
  group.add(crystal);

  const ringGeo = new THREE.TorusGeometry(0.5, 0.04, 6, 16);
  const ring = new THREE.Mesh(ringGeo, goldMat);
  group.add(ring);

  group.position.set(posX, 1.1, spawnZ);
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

  // 75% Full Villain Monster, 25% Spiked Barrier
  const rand = Math.random();
  let obstacle;
  if (rand < 0.75) {
    obstacle = createMechaVillain();
  } else {
    obstacle = createSpikeBarrier();
  }

  obstacle.position.set(posX, 0, spawnZ);
  scene.add(obstacle);
  obstacles.push(obstacle);

  if (Math.random() < 0.45) {
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
  // 1. Update Villains
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.position.z += speed * delta;

    // Villain stomping / hover animation
    if (obs.userData.type === 'VILLAIN') {
      const stomp = Math.sin(time * 10 + obs.position.z) * 0.1;
      const { charMesh, frame, shadowRing } = obs.userData;
      if (charMesh) charMesh.position.y = 1.15 + stomp;
      if (frame) frame.position.y = 1.15 + stomp;
      if (shadowRing) {
        const ringScale = 1.0 + Math.sin(time * 10 + obs.position.z) * 0.2;
        shadowRing.scale.set(ringScale, ringScale, 1);
      }
    }

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

