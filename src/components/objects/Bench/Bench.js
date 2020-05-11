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
            gltf.scene.castShadow = true;
            this.add(gltf.scene);
        });
        const scale = 5.0;
        this.scale.multiplyScalar(scale);
        this.rotateY(Math.PI - 0.2);
        this.rotateZ(0);
        this.rotateX(0);
    }
}

export default Bench;
