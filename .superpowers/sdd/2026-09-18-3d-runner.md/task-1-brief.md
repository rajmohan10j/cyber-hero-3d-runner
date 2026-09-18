### Task 1: Project Setup & Basic Scene

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `vite.config.js`
- Create: `package.json`
- Create: `src/main.js`
- Create: `src/scene.js`

**Interfaces:**
- Produces: `initScene()` function that returns Three.js scene/camera/renderer

- [ ] **Step 1: Write package.json**
```json
{
  "name": "3d-runner",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "three": "^0.160.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Write vite.config.js**
```javascript
export default {
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
}
```

- [ ] **Step 3: Write index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Runner</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="canvas-container"></div>
  <div id="ui-layer">
    <div id="start-screen">
      <h1>3D Runner</h1>
      <p>Tap or Space to start</p>
    </div>
    <div id="hud" style="display: none;">
      <div id="score">Score: 0</div>
      <div id="high-score">Best: 0</div>
    </div>
    <div id="game-over" style="display: none;">
      <h2>Game Over</h2>
      <p>Final Score: <span id="final-score">0</span></p>
      <p>Best: <span id="best-score">0</span></p>
      <button id="restart-btn">Play Again</button>
    </div>
  </div>
  <script type="module" src="src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Write style.css**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

#canvas-container {
  width: 100vw;
  height: 100vh;
}

#ui-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

#start-screen, #game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 8px;
  pointer-events: auto;
  color: white;
}

#hud {
  position: absolute;
  top: 1rem;
  right: 1rem;
  text-align: right;
  color: white;
  font-weight: bold;
}

#score, #high-score {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

#high-score {
  font-size: 1rem;
  opacity: 0.8;
}

#game-over {
  display: none;
}

#restart-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#restart-btn:hover {
  background: #2980b9;
}
```

- [ ] **Step 5: Write src/scene.js**
```javascript
import * as THREE from 'three';

export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0, -5);

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  return { scene, camera, renderer };
}

export function createPlayer() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({ color: 0x3498db });
  const player = new THREE.Mesh(geometry, material);
  player.position.y = 0.5;
  return player;
}

export function createGround() {
  const geometry = new THREE.PlaneGeometry(20, 100);
  const material = new THREE.MeshLambertMaterial({ color: 0x95a5a6 });
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -20;
  return ground;
}
```

- [ ] **Step 6: Write src/main.js (minimal)**
```javascript
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
```

- [ ] **Step 7: Test the setup**
Run: `npm install && npm run dev`
Expected: Window opens with blue cube on gray floor, white background
