import * as THREE from 'three';

export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a); // Deep modern slate background
  scene.fog = new THREE.Fog(0x0f172a, 35, 75);

  const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3.8, 6.5);
  camera.lookAt(0, 1.2, -6);

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const container = document.getElementById('canvas-container');
  if (container) {
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
  }

  // Lighting
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);

  const ambientLight = new THREE.AmbientLight(0x94a3b8, 0.7);
  scene.add(ambientLight);

  // Responsive resize
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  return { scene, camera, renderer };
}

export function createPlayer() {
  const group = new THREE.Group();

  // Core cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({ 
    color: 0x38bdf8, // Vibrant electric cyan
    emissive: 0x0369a1,
    emissiveIntensity: 0.2
  });
  const body = new THREE.Mesh(geometry, material);
  group.add(body);

  // Visor / front indicator
  const visorGeo = new THREE.BoxGeometry(0.7, 0.25, 0.15);
  const visorMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 0.15, -0.45);
  group.add(visor);

  group.position.set(0, 0.5, 0);
  return group;
}

export function createGround() {
  const group = new THREE.Group();

  // Main track plane (covers 3 lanes: -4.5 to +4.5)
  const trackGeo = new THREE.PlaneGeometry(10, 200);
  const trackMat = new THREE.MeshLambertMaterial({ 
    color: 0x1e293b // Dark track surface
  });
  const track = new THREE.Mesh(trackGeo, trackMat);
  track.rotation.x = -Math.PI / 2;
  track.position.z = -50;
  group.add(track);

  // Side borders
  const borderGeo = new THREE.BoxGeometry(0.3, 0.4, 200);
  const borderMat = new THREE.MeshLambertMaterial({ color: 0x0284c7 });
  
  const leftBorder = new THREE.Mesh(borderGeo, borderMat);
  leftBorder.position.set(-5.15, 0.2, -50);
  group.add(leftBorder);

  const rightBorder = new THREE.Mesh(borderGeo, borderMat);
  rightBorder.position.set(5.15, 0.2, -50);
  group.add(rightBorder);

  // Lane dividers (between lanes at x = -1.5 and x = +1.5)
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
  for (let z = -140; z <= 20; z += 6) {
    const stripeGeo = new THREE.PlaneGeometry(0.15, 3);
    
    const leftStripe = new THREE.Mesh(stripeGeo, stripeMat);
    leftStripe.rotation.x = -Math.PI / 2;
    leftStripe.position.set(-1.5, 0.01, z);
    group.add(leftStripe);

    const rightStripe = new THREE.Mesh(stripeGeo, stripeMat);
    rightStripe.rotation.x = -Math.PI / 2;
    rightStripe.position.set(1.5, 0.01, z);
    group.add(rightStripe);
  }

  return group;
}
