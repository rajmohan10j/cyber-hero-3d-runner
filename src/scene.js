import * as THREE from 'three';

export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f1d); // Deep space anime midnight
  scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

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

  // Adjust camera framing based on aspect ratio (crucial for mobile portrait)
  const adjustCamera = () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;

    if (aspect < 1) {
      // Mobile portrait mode: wider FOV and elevated position so all 3 lanes are 100% visible
      camera.fov = Math.min(82, 58 / aspect * 0.74);
      camera.position.set(0, 5.2, 8.5);
      camera.lookAt(0, 1.0, -8);
    } else {
      // Desktop / landscape mode
      camera.fov = 58;
      camera.position.set(0, 3.8, 6.8);
      camera.lookAt(0, 1.2, -8);
    }
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  adjustCamera();
  window.addEventListener('resize', adjustCamera);

  // Cinematic Lighting
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(8, 20, 12);
  scene.add(dirLight);

  const heroFillLight = new THREE.PointLight(0x38bdf8, 1.2, 15);
  heroFillLight.position.set(0, 3, 2);
  scene.add(heroFillLight);

  const ambientLight = new THREE.AmbientLight(0x64748b, 0.75);
  scene.add(ambientLight);

  return { scene, camera, renderer };
}

export function createGround() {
  const group = new THREE.Group();

  // Cyber Highway Track (Lane width = 3, Total track width = 11)
  const trackGeo = new THREE.PlaneGeometry(11, 240);
  const trackMat = new THREE.MeshLambertMaterial({ 
    color: 0x111827
  });
  const track = new THREE.Mesh(trackGeo, trackMat);
  track.rotation.x = -Math.PI / 2;
  track.position.z = -60;
  group.add(track);

  // Glowing Neon Cyber Rails on borders
  const railGeo = new THREE.BoxGeometry(0.35, 0.5, 240);
  const leftRailMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const leftRail = new THREE.Mesh(railGeo, leftRailMat);
  leftRail.position.set(-5.6, 0.25, -60);
  group.add(leftRail);

  const rightRailMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
  const rightRail = new THREE.Mesh(railGeo, rightRailMat);
  rightRail.position.set(5.6, 0.25, -60);
  group.add(rightRail);

  // Lane Dividers (Dashed glowing stripes at x = -1.5 and x = +1.5)
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
  for (let z = -180; z <= 30; z += 6) {
    const stripeGeo = new THREE.PlaneGeometry(0.18, 3.2);
    
    const leftStripe = new THREE.Mesh(stripeGeo, stripeMat);
    leftStripe.rotation.x = -Math.PI / 2;
    leftStripe.position.set(-1.5, 0.015, z);
    group.add(leftStripe);

    const rightStripe = new THREE.Mesh(stripeGeo, stripeMat);
    rightStripe.rotation.x = -Math.PI / 2;
    rightStripe.position.set(1.5, 0.015, z);
    group.add(rightStripe);
  }

  return group;
}
