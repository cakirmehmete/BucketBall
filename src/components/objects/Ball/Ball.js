import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './ball.gltf';

class Ball extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            netForce: new Vector3(),
            mass: 10,
        };
        this.previous = this.position;

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
        console.log(position, power);
        // Calculate final
    }

    update(timeStamp) {
        let deltaT = 18 / 1000;
        let x_t_dt = this.previous.clone();
        this.previous = this.position.clone();

        let x_t = this.position.clone();
        let alpha_t = this.state.netForce.clone().divideScalar(this.state.mass);
        let vert = x_t
            .clone()
            .sub(x_t_dt)
            .multiplyScalar(1 - 0.03);
        this.position.add(vert);
        this.position.add(alpha_t.multiplyScalar(deltaT * deltaT));

        this.state.netForce = new Vector3(0, 0, 0);
    }

    addForce(force) {
        this.state.netForce.add(force);
    }
}

export default Ball;
