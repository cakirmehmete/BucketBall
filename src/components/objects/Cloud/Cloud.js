import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './cloud.gltf';

class Cloud extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();

        this.name = 'cloud';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // this.position.set(0, 0, 5);
        this.scale.set(0.4, 0.4, 0.4);
        this.rotateX(Math.PI / 2);
    }
}

export default Cloud;
