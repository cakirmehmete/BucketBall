/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    PCFSoftShadowMap,
    AudioListener,
    Audio,
    AudioLoader
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MainScene, SecondScene, ThirdScene } from 'scenes';
import Menu from './Menu/Menu.js';
import css from './index.css';
import bgm from './resources/bgm.mp3';

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
let level = 1;
const updateLevel = () => {
    level++;
    if (level === 2) {
        // Dispose of scene
        scene.dispose();
        scene = new MainScene(updateLevel, camera);
    } else if (level === 3) {
        // Dispose of scene
        scene.dispose();
        scene = new ThirdScene(updateLevel, camera);
    }
};
let scene = new SecondScene(updateLevel, camera);
const renderer = new WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

// Set up camera
camera.position.set(0, 125, 250);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 100;
controls.maxDistance = 350;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

document.getElementById('play').addEventListener('click', function() {
  const context = new AudioContext();
    // Set background music
    const listener = new AudioListener();
    camera.add(listener);

    // create a global audio source
    const sound = new Audio(listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load(bgm, function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.1);
        sound.play();
    });
    context.resume();
});
