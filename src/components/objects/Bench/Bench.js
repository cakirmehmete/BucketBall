import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './bench.glb';

class Bench extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();
        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        const scale = 1000.0;
        this.scale.multiplyScalar(scale);
    }
}

export default Bench;
