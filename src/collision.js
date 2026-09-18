import * as THREE from 'three';
import { removeCollectible, createExplosion } from './obstacles.js';

const heroBox = new THREE.Box3();
const itemBox = new THREE.Box3();

export function checkCollision(hero, obstacles) {
  if (!hero || !obstacles || obstacles.length === 0) return false;

  heroBox.setFromObject(hero);
  heroBox.expandByScalar(-0.1); // Forgiving hitbox for smooth fun gameplay

  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    if (Math.abs(obs.position.z - hero.position.z) > 3) continue;

    itemBox.setFromObject(obs);
    itemBox.expandByScalar(-0.1);

    if (heroBox.intersectsBox(itemBox)) {
      return true;
    }
  }

  return false;
}

export function checkCollectiblePickup(scene, hero, collectibles, onPickup) {
  if (!hero || !collectibles || collectibles.length === 0) return;

  heroBox.setFromObject(hero);
  heroBox.expandByScalar(0.2); // Generous pickup magnet radius

  for (let i = collectibles.length - 1; i >= 0; i--) {
    const col = collectibles[i];
    if (Math.abs(col.position.z - hero.position.z) > 3) continue;

    itemBox.setFromObject(col);

    if (heroBox.intersectsBox(itemBox)) {
      // Picked up!
      createExplosion(scene, col.position, 0xfbbf24);
      if (onPickup) onPickup(col);
      removeCollectible(scene, i);
    }
  }
}
