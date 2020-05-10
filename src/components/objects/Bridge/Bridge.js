import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './bridge.glb';

class Bridge extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        const scale = 1.0;
        this.scale.multiplyScalar(scale);
    }
}

export default Bridge;
