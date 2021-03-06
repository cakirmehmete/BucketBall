import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Truck.glb';

class Truck extends Group {
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
        const scale = 5;
        this.scale.set(scale, scale, scale);
        this.rotation.y = 40;
    }
}

export default Truck;
