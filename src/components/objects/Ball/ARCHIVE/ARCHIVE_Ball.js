import { Group, Vector3, TextureLoader } from './node_modules/three';
import { MeshStandardMaterial, Mesh } from './node_modules/three';
import { SphereGeometry } from './node_modules/three';
import golfBMTexture from '../../../resources/golfbumpmap.jpg';
import {
    projectShot,
    calculateInitialVelocity,
    calculateInitialSpin,
} from './ARCHIVE_BallPhysicsHelper';
import SceneParams from '../../../params';
import { Sphere, Vec3, Body } from 'cannon';

class Ball extends Group {
    constructor(parent) {
        super();

        // Initialize state and ball properties
        this.state = {
            previous: this.position,
            velocity: new Vector3(),
            angVelocity: new Vector3(),
            acceleration: new Vector3(),
            shot: false, // Was the golf ball shot?
            projPos: [],
            speedMPH: 30,
            verticalAngleDegrees: 135,
            horizontalAngleDegrees: 0,
        };
        this.name = 'ball';
        this.radius = 1.5;
        this.body = null;

        const segmentSize = 32;
        const ballGeometry = new SphereGeometry(
            this.radius,
            segmentSize,
            segmentSize
        );

        const loader = new TextureLoader();
        const golfBumpMap = loader.load(golfBMTexture);

        const ballMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            bumpMap: golfBumpMap,
        });
        const ballMesh = new Mesh(ballGeometry, ballMaterial);
        this.add(ballMesh);

        // For animating the golf ball projectile motion
        parent.addToUpdateList(this);
    }

    // Initializes the cannonjs body associated with the ball, and returns it
    initBallBody() {
        // Add cannon body to ball
        const mass = SceneParams.MASS;
        const ballShape = new Sphere(this.radius);
        const ballBody = new Body({
            mass: mass,
            shape: ballShape,
            position: new Vec3(
                this.position.x,
                this.position.y,
                this.position.z
            ),
        });
        this.body = ballBody;
        return ballBody;
    }

    update(timeStamp) {
        if (this.body) {
            // Use Euler integration to simulate projectile motion
            // projectShot(
            //     this.state.velocity,
            //     this.state.angVelocity,
            //     this.body.position,
            //     this.state.projPos
            // );
            // this.position.set(
            //     this.body.position.x,
            //     this.body.position.y,
            //     this.body.position.z
            // );
        }
    }

    updateShotDirectionPower(changeX, changeY, power) {
        this.state.projPos = [];
        this.state.verticalAngleDegrees += changeY;
        this.state.horizontalAngleDegrees += changeX;
        this.state.speedMPH = power * 10;
    }

    // Add a shooting force to the ball with the given power and direction
    /*
    Adapted From: https://github.com/jcole/golf-shot-simulation
    */
    shootBall() {
        // initial shot attributes
        const initBackspinRPM = 3000;
        const initSpinAngle = 0;
        // Initial velocity
        this.state.velocity = calculateInitialVelocity(
            this.state.speedMPH,
            SceneParams.SMASH,
            this.state.verticalAngleDegrees,
            this.state.horizontalAngleDegrees
        );

        // Initial spin
        this.state.angVelocity = calculateInitialSpin(
            initBackspinRPM,
            initSpinAngle
        );

        this.state.shot = true;
    }

    calculateTrajectory() {
        this.shootBall();
        for (let i = 0; i < 100; i++) {
            // projectShot(
            //     this.state.velocity,
            //     this.state.angVelocity,
            //     this.position,
            //     this.state.projPos
            // );
        }
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
            this.state.velocity.y = 0;
            this.state.acceleration.y = 0;
            this.position.set(ballXCoord, ballRadius, ballZCoord);
        }
    }
}

export default Ball;
