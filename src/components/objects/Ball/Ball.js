import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './ball.gltf';

class Ball extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();

        this.name = 'ball';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.position.set(0, 0.445, 0);
        this.scale.set(0.5, 0.5, 0.5);
    }

    shootBall(position, power) {
        console.log(position, power)
        // Calculate final 
    }

    update(timeStamp) {
        this.position.addScalar(.001);
    }
}

export default Ball;
