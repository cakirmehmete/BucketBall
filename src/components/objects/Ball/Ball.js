import {
    Group,
    Vector3,
    TextureLoader,
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
} from 'three';
import golfBMTexture from '../../../resources/golfbumpmap.jpg';
import SceneParams from '../../params';
import { Sphere, Vec3, Body } from 'cannon';

class Ball extends Group {
    constructor(parent) {
        super();

        // Initialize state and ball properties
        this.state = {
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
    Adapted From: 
    */
    shootBall() {
        this.state.shot = true;
    }

    calculateTrajectory() {

    }
}

export default Ball;
