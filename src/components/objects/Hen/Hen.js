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
        this.name = 'GoldenGateBridge';
        loader.load(MODEL, (gltf) => {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            this.mixer = mixer;
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
            this.add(gltf.scene);
        });
        const scale = 0.7;
        this.scale.set(scale, scale, scale);
        this.position.set(80, 30, 40);
        this.rotation.y = Math.PI;
    }
}

export default Hen;
