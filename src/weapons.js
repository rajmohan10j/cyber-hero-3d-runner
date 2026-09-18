import * as THREE from 'three';
import { createExplosion, removeObstacle } from './obstacles.js';

const lasers = [];
const laserMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
const laserGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 6);
laserGeo.rotateX(Math.PI / 2);

const laserBox = new THREE.Box3();
const obsBox = new THREE.Box3();

export function fireLaser(scene, hero) {
  if (!scene || !hero) return;

  const posX = hero.position.x;
  const posY = hero.position.y + 0.7;
  const posZ = hero.position.z - 0.6;

  // Dual Blaster Bolts
  const offsets = [-0.55, 0.55];
  for (const off of offsets) {
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(posX + off, posY, posZ);
    laser.userData = { speed: 85 }; // High velocity plasma shot
    scene.add(laser);
    lasers.push(laser);
  }
}

export function updateLasers(scene, delta, obstacles, onHit) {
  for (let i = lasers.length - 1; i >= 0; i--) {
    const laser = lasers[i];
    laser.position.z -= laser.userData.speed * delta;

    let hit = false;
    laserBox.setFromObject(laser);

    // Collision check against villains
    for (let j = obstacles.length - 1; j >= 0; j--) {
      const obs = obstacles[j];
      obsBox.setFromObject(obs);

      if (laserBox.intersectsBox(obsBox)) {
        // Impact!
        createExplosion(scene, obs.position, 0xff0055);
        if (onHit) onHit(obs, obs.position);

        // Remove obstacle and laser
        removeObstacle(scene, j);
        if (scene) scene.remove(laser);
        lasers.splice(i, 1);
        hit = true;
        break;
      }
    }

    // Despawn laser if out of range
    if (!hit && laser.position.z < -80) {
      if (scene) scene.remove(laser);
      lasers.splice(i, 1);
    }
  }
}

export function resetLasers(scene) {
  for (const laser of lasers) {
    if (scene) scene.remove(laser);
  }
  lasers.length = 0;
}
