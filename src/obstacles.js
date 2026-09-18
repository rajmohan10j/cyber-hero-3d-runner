import * as THREE from 'three';

const LANE_POSITIONS = [-3, 0, 3];
const obstacles = [];

// Shared materials and geometries for optimal performance
const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0xe74c3c });

export function spawnObstacle(scene, spawnZ = -60) {
  if (!scene) return null;

  // Random lane
  const laneIndex = Math.floor(Math.random() * 3);
  const posX = LANE_POSITIONS[laneIndex];

  // Random obstacle type:
  // Type 0: low block (can jump over, height ~1.2)
  // Type 1: medium block (height ~2.0)
  // Type 2: tall pillar (height ~3.5)
  const heights = [1.2, 2.0, 3.2];
  const height = heights[Math.floor(Math.random() * heights.length)];
  const width = 1.4;
  const depth = 1.0;

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const obstacle = new THREE.Mesh(geometry, obstacleMaterial);

  obstacle.position.set(posX, height / 2, spawnZ);
  scene.add(obstacle);
  obstacles.push(obstacle);

  return obstacle;
}

export function updateObstacles(scene, speed, delta) {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.position.z += speed * delta;

    // When obstacle passes behind player and camera
    if (obs.position.z > 8) {
      if (scene) {
        scene.remove(obs);
      }
      obs.geometry.dispose();
      obstacles.splice(i, 1);
    }
  }
}

export function resetObstacles(scene) {
  for (const obs of obstacles) {
    if (scene) {
      scene.remove(obs);
    }
    obs.geometry.dispose();
  }
  obstacles.length = 0;
}

export function getObstacles() {
  return obstacles;
}
