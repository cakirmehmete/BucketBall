import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './SkyscraperTree.glb';

class SkyscraperTree extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.castShadow = true;
            gltf.scene.children[0].castShadow = true;
            this.add(gltf.scene.children[0]);
        });
        const scale = 100;
        this.scale.set(scale, scale, scale);
        this.rotation.y = -Math.PI;
    }
}

export default SkyscraperTree;
