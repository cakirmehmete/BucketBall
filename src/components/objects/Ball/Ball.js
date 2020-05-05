import { Group, Vector3, TextureLoader } from 'three';
import { MeshStandardMaterial, Mesh } from 'three';
import { SphereGeometry } from 'three';

class Ball extends Group {
    constructor() {
        super();

        // Initialize state and ball properties
        this.state = {
            
        };
        this.name = 'ball';
        this.mass = 10.0;
        this.radius = 1.5;
        this.previous = this.position;

        const segmentSize = 32;
        const ballGeometry = new SphereGeometry(
            this.radius,
            segmentSize,
            segmentSize
        );

        const loader = new TextureLoader();
        const golfBumpMap = loader.load('src/resources/golfbumpmap.jpg');
        // const golfNormalMap = loader.load('src/resources/golfnormalmap.jpg');
        const ballMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            bumpMap: golfBumpMap,
        });
        const ballMesh = new Mesh(ballGeometry, ballMaterial);
        this.add(ballMesh);
    }

    // Add a shooting force to the ball with the given power and direction
    shootBall(position, power) {
        // Use Euler integration to simulate projectile motion

    }

    // Use verlet integration to animate ball trajectory
    update(timeStamp) {
        // const deltaT = 18 / 1000;
        // const x_t_dt = this.previous.clone();
        // this.previous = this.position.clone();

        // const x_t = this.position.clone();
        // const alpha_t = this.state.netForce.clone().divideScalar(this.mass);
        // const vert = x_t.clone().sub(x_t_dt).multiplyScalar(1);
        // this.position.add(vert);
        // this.position.add(alpha_t.multiplyScalar(deltaT * deltaT));

        // this.state.netForce = new Vector3(0, 0, 0);
    }

    // Handle collisions with the floor of the terrain
    handleFloorCollisions(terrain) {
        const ballXCoord = this.position.x;
        const ballYCoord = this.position.y;
        const ballZCoord = this.position.z;
        const ballRadius = this.radius;

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
