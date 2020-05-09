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
        this.parent = parent;

        // Initialize state and ball properties
        this.state = {
            projPos: [],
            speedMPH: 30,
            verticalAngleDegrees: 135,
            horizontalAngleDegrees: 0,
        };
        this.name = 'ball';
        this.radius = 1.5;

        // Handles Collisions
        this.initBody();

        // Creates the golf ball with bump maping
        this.initMesh();

        // For animating the golf ball projectile motion
        parent.addToUpdateList(this);
    }

    initBody() {
        let mass = SceneParams.MASS,
            radius = SceneParams.RADIUS;
        let sphereShape = new Sphere(radius);
        let sphereBody = new Body({ mass: mass });
        sphereBody.addShape(sphereShape);
        sphereBody.position.set(0, 5, 0);
        sphereBody.linearDamping = 0.1;
        this.parent.world.add(sphereBody);
        this.body = sphereBody;
    }

    initMesh() {
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
        this.mesh = ballMesh;
    }

    update(timeStamp) {
        // Update ball mesh
        this.mesh.position.copy(this.body.position);
        this.mesh.position.y -= SceneParams.RADIUS;
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    // Add a shooting force to the ball with the given power and direction
    /*
    Adapted From: 
    */
    shootBall() {
        const x = this.body.position.x;
        const y = this.body.position.y;
        const z = this.body.position.z;

        //const shootDirection = getShootDir();

        this.body.velocity.set(10, 0, -10);

        this.body.position.set(x, y, z);
        this.mesh.position.set(x, y, z);
    }

    updateShotDirectionPower(change, power) {
        this.state.projPos = [];
        this.state.horizontalAngleDegrees += change;
        this.state.speedMPH = power * 10;
    }

    calculateTrajectory() {}
}

export default Ball;
