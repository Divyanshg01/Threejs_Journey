import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import gsap from "gsap";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Materials
    particles?.material.uniforms.uResolution.value.set(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio,
    );

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100,
);
camera.position.set(0, 0, 8 * 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

debugObject.clearColor = "#160920";
gui.addColor(debugObject, "clearColor").onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
});
renderer.setClearColor(debugObject.clearColor);

/**
 * Particles
 */

let particles = null;
gltfLoader.load("./models.glb", (gltf) => {
    particles = {};

    const positions = gltf.scene.children.map((item) => {
        // console.log(item);
        return item.geometry.attributes.position;
    });
    console.log(positions);
    particles.maxCount = 0;
    for (const pos of positions) {
        if (pos.count > particles.maxCount) {
            particles.maxCount = pos.count;
        }
    }
    // count means no. of vertices
    console.log(particles.maxCount);

    particles.positions = [];
    for (const pos of positions) {
        // console.log(pos);
        const orignalArray = pos.array;
        const newArray = new Float32Array(particles.maxCount * 3);

        for (let i = 0; i < particles.maxCount; i++) {
            const i3 = i * 3;
            if (i3 < orignalArray.length) {
                newArray[i3 + 0] = orignalArray[i3 + 0];
                newArray[i3 + 1] = orignalArray[i3 + 1];
                newArray[i3 + 2] = orignalArray[i3 + 2];
            } else {
                const randomIndex = Math.floor(pos.count * Math.random()) * 3;
                newArray[i3 + 0] = orignalArray[randomIndex + 0];
                newArray[i3 + 1] = orignalArray[randomIndex + 1];
                newArray[i3 + 2] = orignalArray[randomIndex + 2];
                // newArray[i3 + 0] = 0;
                // newArray[i3 + 1] = 0;
                // newArray[i3 + 2] = 0;
            }
        }

        particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3));
    }
    console.log(particles.positions);
    // Geometry
    // particles.geometry = new THREE.SphereGeometry(3);

    const sizesArray = new Float32Array(particles.maxCount);

    for (let i = 0; i < particles.maxCount; i++) {
        sizesArray[i] = Math.random();
    }

    particles.geometry = new THREE.BufferGeometry();

    particles.geometry.setAttribute("position", particles.positions[0]);
    particles.geometry.setAttribute("aPositionTarget", particles.positions[2]);
    particles.geometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(sizesArray, 1),
    );

    particles.colorA = "#ff7300";
    particles.colorB = "#0091ff";

    // particles.geometry.setIndex(null);
    // Material
    particles.material = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
            uSize: new THREE.Uniform(0.2),
            uResolution: new THREE.Uniform(
                new THREE.Vector2(
                    sizes.width * sizes.pixelRatio,
                    sizes.height * sizes.pixelRatio,
                ),
            ),
            uProgress: {
                value: 0,
            },
            uColorA: {
                value: new THREE.Color(particles.colorA),
            },
            uColorB: {
                value: new THREE.Color(particles.colorB),
            },
        },
    });

    // Points
    particles.points = new THREE.Points(particles.geometry, particles.material);
    particles.points.frustumCulled = false;
    scene.add(particles.points);

    gui
        .add(particles.material.uniforms.uProgress, "value")
        .min(0)
        .max(1)
        .step(0.001)
        .name("Progress")
        .listen();
});

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    // Render normal scene
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();