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
        };
        this.mass = 10.0;
        this.previous = this.position;

        // Load object
        const loader = new GLTFLoader();
        this.name = 'ball';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.position.set(0, 1.5, 0);
        this.scale.set(1.5, 1.5, 1.5);
    }

    shootBall(position, power) {
        console.log(position, power);
        this.addForce(new Vector3(60000, 50000, 0));
    }

    update(timeStamp) {
        let deltaT = 18 / 1000;
        let x_t_dt = this.previous.clone();
        this.previous = this.position.clone();

        let x_t = this.position.clone();
        let alpha_t = this.state.netForce.clone().divideScalar(this.mass);
        let vert = x_t.clone().sub(x_t_dt).multiplyScalar(1);
        this.position.add(vert);
        this.position.add(alpha_t.multiplyScalar(deltaT * deltaT));

        this.state.netForce = new Vector3(0, 0, 0);
    }

    addForce(force) {
        this.state.netForce.add(force);
    }

    // Handle collisions with the floor of the terrain
    handleFloorCollisions(terrain) {
        const ballXCoord = this.position.x;
        const ballYCoord = this.position.y;
        const ballZCoord = this.position.z;
        const ballRadius = 1;

        const withinTerrainWidth =
            ballXCoord > -terrain.terrainWidth / 2 &&
            ballXCoord < terrain.terrainWidth / 2;
        const withinTerrainHeight =
            ballZCoord > -terrain.terrainHeight / 2 &&
            ballZCoord < terrain.terrainHeight / 2;
        if (
            withinTerrainWidth &&
            withinTerrainHeight &&
            ballYCoord < terrain.terrainDepth + ballRadius
        ) {
            this.position.set(ballXCoord, ballRadius, ballZCoord);
        }
    }
}

export default Ball;
