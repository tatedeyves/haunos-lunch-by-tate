
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { RoundedBoxGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/geometries/RoundedBoxGeometry.js';

const canvas = document.querySelector('#lunch-canvas');
const loading = document.querySelector('#loading');
const hint = document.querySelector('#tap-hint');
const message = document.querySelector('#message');
const replay = document.querySelector('#replay');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#fff8f1');

const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(4.2, 3.7, 6.2);
camera.lookAt(0, 0.85, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'default'
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight('#fff8ee', '#c5a397', 2.1));

const sunlight = new THREE.DirectionalLight('#fff4dc', 3.2);
sunlight.position.set(3, 7, 5);
scene.add(sunlight);

const fillLight = new THREE.DirectionalLight('#f5c6cf', 1.1);
fillLight.position.set(-4, 3, -3);
scene.add(fillLight);

const materials = {
  cream: new THREE.MeshStandardMaterial({
    color: '#fff0d9', roughness: 0.34
  }),
  pink: new THREE.MeshStandardMaterial({
    color: '#e8b7ae', roughness: 0.38
  }),
  darkPink: new THREE.MeshStandardMaterial({
    color: '#c98f88', roughness: 0.4
  }),
  white: new THREE.MeshStandardMaterial({
    color: '#fffaf0', roughness: 0.65
  }),
  rice: new THREE.MeshStandardMaterial({
    color: '#fffaf1', roughness: 0.9
  }),
  green: new THREE.MeshStandardMaterial({
    color: '#52865a', roughness: 0.8
  }),
  broccoli: new THREE.MeshStandardMaterial({
    color: '#6d9c59', roughness: 0.85
  }),
  orange: new THREE.MeshStandardMaterial({
    color: '#f3a65e', roughness: 0.6
  }),
  sausage: new THREE.MeshStandardMaterial({
    color: '#c86d64', roughness: 0.45
  }),
  yolk: new THREE.MeshStandardMaterial({
    color: '#ffc957', roughness: 0.45
  }),
  nori: new THREE.MeshStandardMaterial({
    color: '#354d3d', roughness: 0.95
  })
};

function roundedBox(parent, size, position, material, radius = 0.12) {
  const geometry = new RoundedBoxGeometry(
    size[0], size[1], size[2], 4, radius
  );

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function sphere(parent, position, scale, material, segments = 24) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, segments, 16),
    material
  );

  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

// Soft background and ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({
    color: '#fff8f1',
    roughness: 1
  })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.04;
scene.add(ground);

// The lunch box
const lunch = new THREE.Group();
scene.add(lunch);

// Main container
roundedBox(lunch, [2.8, 0.72, 2.05], [0, 0.43, 0], materials.pink, 0.18);

// Cream-colored inner rim
roundedBox(lunch, [2.72, 0.12, 1.97], [0, 0.81, 0], materials.cream, 0.12);

// Inner bottom
roundedBox(lunch, [2.52, 0.07, 1.76], [0, 0.84, 0], materials.white, 0.08);

// A subtle front clasp
roundedBox(lunch, [0.42, 0.2, 0.12], [0, 0.78, 1.04], materials.darkPink, 0.055);

// Food: smiling rice ball
const riceBall = new THREE.Group();
riceBall.position.set(-0.62, 0.91, -0.2);
lunch.add(riceBall);

sphere(riceBall, [0, 0.17, 0], [0.49, 0.32, 0.46], materials.rice, 32);

// Nori strip
roundedBox(
  riceBall, [0.52, 0.12, 0.06],
  [0, 0.09, 0.405], materials.nori, 0.035
);

// Cute face on the rice ball, facing the front
const faceMaterial = new THREE.MeshStandardMaterial({
  color: '#49362f',
  roughness: 0.85
});

sphere(riceBall, [-0.13, 0.12, 0.45], [0.035, 0.045, 0.018], faceMaterial);
sphere(riceBall, [0.13, 0.12, 0.45], [0.035, 0.045, 0.018], faceMaterial);

// Tiny smile
const smile = new THREE.Mesh(
  new THREE.TorusGeometry(0.07, 0.012, 8, 20, Math.PI),
  faceMaterial
);
smile.position.set(0, 0.075, 0.458);
smile.rotation.z = Math.PI;
riceBall.add(smile);

// Fried egg
sphere(
  lunch, [0.35, 0.96, -0.36],
  [0.48, 0.11, 0.39], materials.white, 32
);
sphere(
  lunch, [0.32, 1.075, -0.34],
  [0.2, 0.09, 0.19], materials.yolk, 28
);

// Broccoli florets
[
  [0.9, 1.02, 0.38, 0.19],
  [1.02, 1.04, 0.18, 0.17],
  [0.78, 1.05, 0.15, 0.17],
  [0.88, 1.13, 0.27, 0.15]
].forEach(([x, y, z, r]) => {
  sphere(lunch, [x, y, z], [r, r, r], materials.broccoli, 16);
});

// Carrot bites
sphere(lunch, [-0.05, 0.98, 0.55], [0.14, 0.09, 0.13], materials.orange);
sphere(lunch, [0.2, 0.98, 0.58], [0.13, 0.09, 0.12], materials.orange);

// Mini sausages
function sausage(x, z, angle) {
  const item = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.105, 0.32, 4, 12),
    materials.sausage
  );

  item.position.set(x, 1.02, z);
  item.rotation.z = Math.PI / 2;
  item.rotation.y = angle;
  item.scale.set(1, 0.9, 1);
  item.castShadow = true;
  lunch.add(item);
}

sausage(-0.85, 0.63, 0.15);
sausage(-0.43, 0.65, -0.2);

// Little pink heart decorations on the container
function makeHeartTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;

  const ctx = c.getContext('2d');
  ctx.fillStyle = '#d89591';
  ctx.font = 'bold 100px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('♥', 64, 67);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const heartMaterial = new THREE.MeshBasicMaterial({
  map: makeHeartTexture(),
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});

function addHeart(x, y, z, size) {
  const heart = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    heartMaterial
  );

  heart.position.set(x, y, z);
  lunch.add(heart);
}

addHeart(-0.92, 0.42, 1.033, 0.18);
addHeart(0.91, 0.42, 1.033, 0.14);

// Lid hinge group: the lid pivots from the back
const lidPivot = new THREE.Group();
lidPivot.position.set(0, 0.89, -0.91);
lunch.add(lidPivot);

roundedBox(
  lidPivot, [2.82, 0.2, 1.98],
  [0, 0, 0.91], materials.cream, 0.16
);

// Pink decorative border on top
roundedBox(
  lidPivot, [2.67, 0.045, 1.83],
  [0, 0.119, 0.91], materials.pink, 0.12
);

// Label texture
function makeLabelTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 300;

  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#76564b';
  ctx.font = '500 62px Georgia, serif';
  ctx.fillText("Hauno's lunch", 512, 112);

  ctx.fillStyle = '#a77b70';
  ctx.font = 'italic 46px Georgia, serif';
  ctx.fillText('by Tate ♡', 512, 198);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(
    renderer.capabilities.getMaxAnisotropy(), 4
  );
  return texture;
}

const label = new THREE.Mesh(
  new THREE.PlaneGeometry(1.95, 0.57),
  new THREE.MeshBasicMaterial({
    map: makeLabelTexture(),
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  })
);

label.rotation.x = -Math.PI / 2;
label.position.set(0, 0.145, 0.91);
lidPivot.add(label);

// Small decorative hearts on the lid
const lidHeartMaterial = new THREE.MeshStandardMaterial({
  color: '#d58f8c',
  roughness: 0.55
});

sphere(lidPivot, [-0.98, 0.15, 0.42], [0.07, 0.025, 0.07], lidHeartMaterial);
sphere(lidPivot, [0.98, 0.15, 1.4], [0.07, 0.025, 0.07], lidHeartMaterial);

// Animation state
let isOpen = false;
let lidAngle = 0;
let targetAngle = 0;
let pointerStart = null;

function toggleLunch() {
  isOpen = !isOpen;
  targetAngle = isOpen ? -1.85 : 0;

  hint.style.opacity = isOpen ? '0' : '1';
  replay.hidden = !isOpen;

  message.textContent = isOpen
    ? 'Surprise! I made this just for you ♡'
    : 'A little box full of love, made just for you.';
}

canvas.addEventListener('pointerdown', (event) => {
  pointerStart = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener('pointerup', (event) => {
  if (!pointerStart) return;

  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  pointerStart = null;

  // Ignore a drag gesture; a tap opens or closes the lunch box.
  if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
    toggleLunch();
  }
});

replay.addEventListener('click', () => {
  if (isOpen) toggleLunch();
});

// Responsive rendering
function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (!width || !height) return;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.position.z = width < 430 ? 6.8 : 6.2;
  camera.position.x = width < 430 ? 3.8 : 4.2;
  camera.updateProjectionMatrix();
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas);
resize();

loading.style.display = 'none';

// Render loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  // Gentle floating and swaying
  lunch.position.y = Math.sin(time * 1.5) * 0.055;
  lunch.rotation.y = Math.sin(time * 0.65) * 0.055;

  // Smooth lid opening
  lidAngle += (targetAngle - lidAngle) * 0.09;
  lidPivot.rotation.x = lidAngle;

  renderer.render(scene, camera);
}

animate();
