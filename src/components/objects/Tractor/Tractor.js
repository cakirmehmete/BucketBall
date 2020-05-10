import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './tractor.glb';

class Tractor extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.children[0].castShadow = true;
            this.add(gltf.scene.children[0]);
        });
        this.scale.set(2, 2, 2);
        this.position.set(40, 0, 40);
        this.rotation.y = Math.PI;
    }
}

export default Tractor;
