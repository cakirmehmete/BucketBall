/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MainScene, SecondScene, ThirdScene } from 'scenes';
import Menu from './Menu/Menu.js';
import css from './index.css';

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
let level = 1;
const updateLevel = () => {
    level++;
    if (level === 2) {
        // Dispose of scene
        scene.dispose();
        scene = new SecondScene(updateLevel, camera);
    } else if (level === 3) {
        // Dispose of scene
        scene.dispose();
        scene = new ThirdScene(updateLevel, camera);
    }
};
let scene = new MainScene(updateLevel, camera);
const renderer = new WebGLRenderer({ antialias: true });

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
controls.minDistance = 10;
controls.maxDistance = 1000;
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

/*
Credits: StackOverFlow gaitat, https://stackoverflow.com/a/33199591 
*/
function disposeNode(node) {
    if (node instanceof THREE.Mesh) {
        if (node.geometry) {
            node.geometry.dispose();
        }

        if (node.material) {
            if (node.material instanceof THREE.MeshFaceMaterial) {
                $.each(node.material.materials, function (idx, mtrl) {
                    if (mtrl.map) mtrl.map.dispose();
                    if (mtrl.lightMap) mtrl.lightMap.dispose();
                    if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                    if (mtrl.normalMap) mtrl.normalMap.dispose();
                    if (mtrl.specularMap) mtrl.specularMap.dispose();
                    if (mtrl.envMap) mtrl.envMap.dispose();
                    if (mtrl.alphaMap) mtrl.alphaMap.dispose();
                    if (mtrl.aoMap) mtrl.aoMap.dispose();
                    if (mtrl.displacementMap) mtrl.displacementMap.dispose();
                    if (mtrl.emissiveMap) mtrl.emissiveMap.dispose();
                    if (mtrl.gradientMap) mtrl.gradientMap.dispose();
                    if (mtrl.metalnessMap) mtrl.metalnessMap.dispose();
                    if (mtrl.roughnessMap) mtrl.roughnessMap.dispose();

                    mtrl.dispose(); // disposes any programs associated with the material
                });
            } else {
                if (node.material.map) node.material.map.dispose();
                if (node.material.lightMap) node.material.lightMap.dispose();
                if (node.material.bumpMap) node.material.bumpMap.dispose();
                if (node.material.normalMap) node.material.normalMap.dispose();
                if (node.material.specularMap)
                    node.material.specularMap.dispose();
                if (node.material.envMap) node.material.envMap.dispose();
                if (node.material.alphaMap) node.material.alphaMap.dispose();
                if (node.material.aoMap) node.material.aoMap.dispose();
                if (node.material.displacementMap)
                    node.material.displacementMap.dispose();
                if (node.material.emissiveMap)
                    node.material.emissiveMap.dispose();
                if (node.material.gradientMap)
                    node.material.gradientMap.dispose();
                if (node.material.metalnessMap)
                    node.material.metalnessMap.dispose();
                if (node.material.roughnessMap)
                    node.material.roughnessMap.dispose();

                node.material.dispose(); // disposes any programs associated with the material
            }
        }
    }
}
function disposeHierarchy(node, callback) {
    for (var i = node.children.length - 1; i >= 0; i--) {
        var child = node.children[i];
        disposeHierarchy(child, callback);
        callback(child);
    }
}
