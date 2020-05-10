import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Scarecrow.glb';

class Scarecrow extends Group {
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
        const scale = 10;
        this.scale.set(scale, scale, scale);
        this.position.set(-80, 0, 40);
    }
}

export default Scarecrow;