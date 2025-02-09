import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/addons/objects/Sky.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const sky = new Sky();
scene.add(sky);
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);
sky.scale.set(100, 100, 100);

scene.fog = new THREE.FogExp2("#02343f", 0.1);

const textureLoader = new THREE.TextureLoader();

const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg");
const floorColorTexture = textureLoader.load(
  "./floor/coast/coast_sand_rocks_02_diff_1k.jpg",
);
const floorArmTexture = textureLoader.load(
  "./floor/coast/coast_sand_rocks_02_arm_1k.jpg",
);
const floorNormalTexture = textureLoader.load(
  "./floor/coast/coast_sand_rocks_02_nor_gl_1k.jpg",
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/coast/coast_sand_rocks_02_disp_1k.jpg",
);

const wallColorTexture = textureLoader.load(
  "./wallTexture/castle_brick_broken_06_diff_1k.jpg",
);

const wallArmTexture = textureLoader.load(
  "./wallTexture/castle_brick_broken_06_arm_1k.jpg",
);
const wallNormalTexture = textureLoader.load(
  "./wallTexture/castle_brick_broken_06_nor_gl_1k.jpg",
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

const roofColorTexture = textureLoader.load(
  "./roof/roof_slates_02_diff_1k.jpg",
);

const roofArmTexture = textureLoader.load("./roof/roof_slates_02_arm_1k.jpg");
const roofNormalTexture = textureLoader.load(
  "./roof/roof_slates_02_nor_gl_1k.jpg",
);

const leavesArmTexture = textureLoader.load(
  "./leaves/leaves_forest_ground_arm_1k.jpg",
);
const leavesColorTexture = textureLoader.load(
  "./leaves/leaves_forest_ground_diff_1k.jpg",
);
const leavesNormalTexture = textureLoader.load(
  "./leaves/leaves_forest_ground_nor_gl_1k.jpg",
);

const graveColorTexture = textureLoader.load(
  "./grave/plastered_stone_wall_diff_1k.jpg",
);

const graveNormalTexture = textureLoader.load(
  "./grave/plastered_stone_wall_nor_gl_1k.jpg",
);
const graveArmTexture = textureLoader.load(
  "./grave/plastered_stone_wall_arm_1k.jpg",
);

const doorColorTexture = textureLoader.load("./door/color.jpg");
const doorAlphaTexture = textureLoader.load("./door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.jpg",
);
const doorHeightTexture = textureLoader.load("./door/height.jpg");
const doorNormalTexture = textureLoader.load("./door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("./door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("./door/roughness.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveArmTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
leavesColorTexture.colorSpace = THREE.SRGBColorSpace;
roofColorTexture.repeat.set(3, 1);
roofArmTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);
roofArmTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
/**
 * House
 */
floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorArmTexture,
    roughnessMap: floorArmTexture,
    metalnessMap: floorArmTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  }),
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallArmTexture,
    roughnessMap: wallArmTexture,
    metalnessMap: wallArmTexture,
    normalMap: wallNormalTexture,
  }),
);
house.add(walls);
walls.position.y += 1.25;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofArmTexture,
    roughnessMap: roofArmTexture,
    metalnessMap: roofArmTexture,
    normalMap: roofNormalTexture,
  }),
);
house.add(roof);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  }),
);
house.add(door);
door.position.y = 1;
door.position.z = 2.001;

const bushGeo = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  map: leavesColorTexture,
  aoMap: leavesArmTexture,
  roughnessMap: leavesArmTexture,
  metalnessMap: leavesArmTexture,
  normalMap: leavesNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeo, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeo, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeo, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeo, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

const graveGeo = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveArmTexture,
  roughnessMap: graveArmTexture,
  metalnessMap: graveArmTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeo, graveMaterial);
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  grave.position.x = x;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
//
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost2.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 3.45);
  const ghost2Angle = -elapsedTime * 0.34;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 3.45);
  const ghost3Angle = -elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 3.45);
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
