import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './GoldenGateBridge.gltf';

class GoldenGateBridge extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();

        this.name = 'GoldenGateBridge';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        this.scale.set(10, 10, 10);
        this.position.set(10, 10, -10);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    spin() {}

    update(timeStamp) {}
}

export default GoldenGateBridge;
