import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './tree.glb';

class Tree extends Group {
    constructor() {
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

        const scale = 3.0;
        this.scale.multiplyScalar(scale);
    }
}

export default Tree;
