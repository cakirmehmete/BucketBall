import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL1 from './helicopter.glb';
import MODEL2 from './helicopter2.glb';

class Helicopter extends Group {
    constructor(helitype) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        let MODEL = 0;
        if (helitype === 1) {
            MODEL = MODEL1;
        }
        else {
            MODEL = MODEL2;
        }

        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        let scale = 1.0;
        if (MODEL === MODEL2) {
            scale = 0.05;
        }
        this.scale.multiplyScalar(scale);

        if (MODEL === MODEL1) {
            this.rotateY(Math.random() * -Math.PI / 4);
        }
        else {
            this.rotateY(Math.random() * -Math.PI / 2);
        }
    }
}

export default Helicopter;
