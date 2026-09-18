import { initScene, createPlayer, createGround } from './scene.js';

const { scene, camera, renderer } = initScene();

const player = createPlayer();
scene.add(player);

const ground = createGround();
scene.add(ground);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
