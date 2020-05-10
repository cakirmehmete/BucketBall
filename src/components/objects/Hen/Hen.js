import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './hen.glb';

class Hen extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.children[0].castShadow = true;
            gltf.scene.castShadow = true;
            console.log(gltf);
            this.add(gltf.scene.children[0]);
        });
        const scale = 0.7;
        this.scale.set(scale, scale, scale);
        this.position.set(80, 30, 40);
    }
}

export default Hen;
