import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './windmill.glb';

class Windmill extends Group {
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
        this.scale.set(20, 20, 20);
        this.position.set(10, 0, 100);
        this.rotation.y = Math.PI;
        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    spin() {}

    update(timeStamp) {
        if (this.mixer) {
            this.mixer.update(1/30);
        }
    }
}

export default Windmill;
