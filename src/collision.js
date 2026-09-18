import * as THREE from 'three';

const playerBox = new THREE.Box3();
const obstacleBox = new THREE.Box3();

export function checkCollision(player, obstacles) {
  if (!player || !obstacles || obstacles.length === 0) return false;

  // Compute player bounding box with small inset for forgiving hitbox
  playerBox.setFromObject(player);
  playerBox.expandByScalar(-0.08);

  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    // Quick Z-distance check to skip distant obstacles
    if (Math.abs(obs.position.z - player.position.z) > 3) continue;

    obstacleBox.setFromObject(obs);
    obstacleBox.expandByScalar(-0.05);

    if (playerBox.intersectsBox(obstacleBox)) {
      return true;
    }
  }

  return false;
}
