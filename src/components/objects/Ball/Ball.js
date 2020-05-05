import { Group, Vector3, TextureLoader } from 'three';
import { MeshStandardMaterial, Mesh } from 'three';
import { SphereGeometry } from 'three';
import {
    projectShot,
    calculateInitialVelocity,
    calculateInitialSpin,
} from './BallPhysicsHelper';
import SceneParams from '../../params';

class Ball extends Group {
    constructor() {
        super();

        // Initialize state and ball properties
        this.state = {
            previous: this.position,
            velocity: new Vector3(),
            angVelocity: new Vector3(),
            acceleration: new Vector3(),
        };
        this.name = 'ball';
        this.radius = 1.5;

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
    /*
    Adapted From: https://github.com/jcole/golf-shot-simulation
    */
    shootBall(position, power) {
        // initial shot attributes
        let initSpeedMPH = 50;
        let initVerticalAngleDegrees = 22;
        let initHorizontalAngleDegrees = 9;
        let initBackspinRPM = 3000;
        let initSpinAngle = 45;
        // Initial velocity
        this.state.velocity = calculateInitialVelocity(
            initSpeedMPH,
            SceneParams.SMASH,
            initVerticalAngleDegrees,
            initHorizontalAngleDegrees
        );

        // Initial spin
        this.state.angVelocity = calculateInitialSpin(
            initBackspinRPM,
            initSpinAngle
        );

        // Use Euler integration to simulate projectile motion
        projectShot(
            this.state.velocity,
            this.state.angVelocity,
            this.position,
            this.radius
        );
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
