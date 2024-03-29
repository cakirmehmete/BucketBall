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
import { Sphere, Body } from 'cannon';

class Ball extends Group {
    constructor(parent, xPos, zPos) {
        super();
        this.parent = parent;

        // Initialize state and ball properties
        this.state = {
            projPos: [],
            power: 3,
            shootDirection: new Vector3(0, 0, -1),
            moving: false,
            previous: new Vector3(),
        };
        this.name = 'ball';
        this.radius = SceneParams.RADIUS;

        // Handles Collisions
        this.initBody(xPos, zPos);

        // Creates the golf ball with bump mapping
        this.initMesh();

        // For animating the golf ball projectile motion
        parent.addToUpdateList(this);
    }

    initBody(xPos, zPos) {
        let mass = SceneParams.MASS,
            radius = SceneParams.RADIUS;
        let sphereShape = new Sphere(radius);
        let sphereBody = new Body({ mass: mass });
        sphereBody.addShape(sphereShape);
        sphereBody.position.set(xPos, 5, zPos);
        sphereBody.linearDamping = 0.1;
        this.parent.world.add(sphereBody);
        this.body = sphereBody;
    }

    initMesh() {
        const segmentSize = 32;
        const ballGeometry = new SphereGeometry(
            SceneParams.RADIUS,
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

    update() {
        // Update ball mesh
        this.mesh.position.copy(this.body.position);
        this.mesh.position.y -= SceneParams.RADIUS;
        this.mesh.quaternion.copy(this.body.quaternion);

        // Check if ball is still moving
        const dist = this.state.previous.distanceTo(this.body.position);
        if (dist < 0.01) {
            this.state.moving = false;
        } else {
            // this.state.moving = true; UNCOMMENT FOR PROD!!
        }
        this.state.previous = this.body.position.clone();
    }

    // Add a shooting force to the ball with the given power and direction
    /*
    Adapted From: 
    */
    shootBall() {
        const shootDirection = this.state.shootDirection;
        const power = this.state.power * 3;
        if (!this.state.moving) {
            this.body.velocity.set(
                shootDirection.x * power,
                shootDirection.y * power,
                shootDirection.z * power
            );
        }
    }

    updateShotDirectionPower(angle, power) {
        this.state.projPos = [];
        var direction = this.state.shootDirection.clone();

        var axis = new Vector3(0, 1, 0);

        direction.applyAxisAngle(axis, angle);
        this.state.shootDirection = direction;
        this.state.power = power;
    }

    calculateTrajectory() {}
}

export default Ball;
