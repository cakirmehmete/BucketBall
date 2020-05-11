import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './campfire.glb';

class Campfire extends Group {
    constructor() {
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

        const scale = 1.5;
        this.scale.multiplyScalar(scale);
    }
}

export default Campfire;
