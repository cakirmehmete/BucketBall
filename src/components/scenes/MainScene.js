import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import { Ball, Terrain, Cloud, Bucket, Crate } from 'objects';
import { BasicLights } from 'lights';
import {
    World,
    GSSolver,
    Box,
    Vec3,
    NaiveBroadphase,
    Body,
    SplitSolver,
    Material,
    ContactMaterial,
    Plane,
} from 'cannon';
import Arrow from '../objects/Arrow/Arrow';
import SceneParams from '../params';

class MainScene extends Scene {
    constructor() {
        super();

        // Define constant values
        const TERRAINSIZE = 250.0;

        // Initialize state and scene properties
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [], // Maintains all meshes to be updated

            // Direction/Power for golf ball
            spaceBarDown: false,
            power: 3,
        };
        this.terrain = null;
        this.ball = null;
        this.bucket = null;

        // Setup physical world using CannonJS
        this.setupCannon();

        // Set background to a light blue to represent sky
        this.background = new Color(0x87ceeb);

        const lights = new BasicLights();
        const axesHelper = new AxesHelper(100); // Uncomment to help debug positioning
        this.add(lights, axesHelper);

        // Initialize different objects and place them accordingly in the scene
        this.setupTerrain(TERRAINSIZE, TERRAINSIZE);
        this.setupClouds();
        this.setupBall();
        this.setupBucket();
        this.setupArrow();
        this.setupCrates();

        // Setup Event handler for Golf Ball
        window.addEventListener(
            'keydown',
            this.handleKeyDownEvents.bind(this),
            false
        );
        window.addEventListener(
            'keyup',
            this.handleKeyUpEvents.bind(this),
            false
        );

        // Populate GUI
        const slider = this.state.gui.add(this.state, 'power', 1, 10).listen();
        slider.onChange(
            function () {
                this.updateBallHelper(0, 0, this.state.power);
            }.bind(this)
        );
    }

    /*
    Adapted From: https://schteppe.github.io/cannon.js/examples/threejs_fps.html
    */
    setupCannon() {
        // Setup our world
        let world = new World();
        this.world = world;
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;

        let solver = new GSSolver();

        world.defaultContactMaterial.contactEquationStiffness = 1e9;
        world.defaultContactMaterial.contactEquationRelaxation = 4;

        solver.iterations = 7;
        solver.tolerance = 0.1;
        let split = true;
        if (split) world.solver = new SplitSolver(solver);
        else world.solver = solver;

        world.gravity.set(0, -9.82, 0);
        world.broadphase = new NaiveBroadphase();

        // Debugging
        this.cannonDebugRenderer = new THREE.CannonDebugRenderer(
            this,
            this.world
        );

        // Create a slippery material (friction coefficient = 0.0)
        let physicsMaterial = new Material('slipperyMaterial');
        let physicsContactMaterial = new ContactMaterial(
            physicsMaterial,
            physicsMaterial,
            0.0, // friction coefficient
            0.3 // restitution
        );
        // We must add the contact materials to the world
        world.addContactMaterial(physicsContactMaterial);
    }

    // Add X-Z aligned terrain to the environment
    setupTerrain(terrainWidth, terrainHeight) {
        const terrain = new Terrain(terrainWidth, terrainHeight, this);
        this.add(terrain);
        this.terrain = terrain;

        var groundShape = new Plane();
        var groundBody = new Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
        this.world.add(groundBody);
    }

    // Add ball to the environment
    setupBall() {
        // Add ball mesh to scene
        this.ball = new Ball(this);
        this.add(this.ball);
        const rootPosition = this.terrain.position;
        this.ball.position.set(
            rootPosition.x,
            this.ball.radius,
            rootPosition.z
        );
    }

    // Add bucket/hole to the environment
    setupBucket() {
        const EPS = 0.05;
        const edgeOffset = 10.0;
        const bucket = new Bucket();
        bucket.position.set(
            this.terrain.terrainWidth / 2.0 - edgeOffset,
            this.terrain.terrainDepth + EPS,
            -this.terrain.terrainHeight / 2.0 + edgeOffset
        );
        this.add(bucket);
        this.bucket = bucket;
    }

    // Add randomized clouds to the environment
    setupClouds() {
        const clouds = [];
        const cloudHeight = this.terrain.terrainDepth + 100.0;
        for (let i = 0; i < 8; i++) {
            const cloud = new Cloud();
            clouds.push(cloud);
        }

        clouds.forEach((cloud, index) => {
            const cloudDepth = Math.floor(
                Math.random() * (125.0 - 10.0) + 10.0
            );
            const cloudWidth = Math.floor(Math.random() * 150.0);
            if (index < clouds.length / 2) {
                cloud.position.set(-cloudWidth, cloudHeight, -cloudDepth);
            } else {
                cloud.position.set(cloudWidth, cloudHeight, -cloudDepth);
            }
            this.add(cloud);
        });
    }

    // Add projectile arrow graphic to the ball
    setupArrow() {
        const arrow = new Arrow(this, this.ball.position);
        this.add(arrow);
        this.arrow = arrow;
    }

    // Add randomized crates to the environment
    setupCrates() {
        const crateSize = 10.0;
        const crates = [];
        for (let i = 0; i < 5; i++) {
            const crate = new Crate(crateSize);
            crates.push(crate);
        }

        crates.forEach((crate) => {
            const maxXPosition = this.terrain.terrainWidth / 2 - crateSize;
            const minXPosition = -this.terrain.terrainWidth / 2 + crateSize;
            const maxZPosition = this.terrain.terrainHeight / 2 - crateSize;
            const minZPosition = -this.terrain.terrainHeight / 2 + crateSize;
            const xPos =
                Math.random() * (maxXPosition - minXPosition) + minXPosition;
            const yPos = crateSize / 2;
            const zPos =
                Math.random() * (maxZPosition - minZPosition) + minZPosition;
            crate.position.set(xPos, yPos, zPos);

            // Add a cannon body to each crate
            const mass = 0;
            const crateShape = new Box(
                new Vec3(crateSize / 2, crateSize / 2, crateSize / 2)
            );
            const crateBody = new Body({ mass: mass, shape: crateShape });
            crateBody.position.set(xPos, yPos, zPos);
            this.world.addBody(crateBody);
        });

        crates.forEach((crate) => {
            this.add(crate);
        });
    }

    // Callback function for keydown events
    handleKeyDownEvents(event) {
        const offset = 2;
        const power = this.state.power;
        if (event.key === 'w') {
            // Up
            this.updateBallHelper(0, -offset, power);
        } else if (event.key === 's') {
            // Down
            this.updateBallHelper(0, offset, power);
        } else if (event.key === 'a') {
            // Left
            this.updateBallHelper(offset, 0, power);
        } else if (event.key === 'd') {
            // Right
            this.updateBallHelper(-offset, 0, power);
        } else if (event.key === ' ') {
            // Power
            if (!this.state.spaceBarDown) {
                this.state.spaceBarDown = true;
            }
        }
    }

    updateBallHelper(offset, power) {
        this.arrow.updateShotDirectionPower(offset, power);
        this.ball.updateShotDirectionPower(offset, power);
    }

    // Callback function for keyup events
    handleKeyUpEvents(event) {
        if (event.key === ' ') {
            // Power
            if (this.state.spaceBarDown) {
                this.arrow.hide();
                this.ball.shootBall();
                this.state.spaceBarDown = false;
            }
        }
    }

    // Handle animations
    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    animatePowerSlider(timeStamp) {
        this.state.power = 3;
        this.state.power = Math.ceil(5 * Math.sin(timeStamp / 400) + 5);
        this.updateBallHelper(0, this.state.power);
    }

    // Handle animations
    update(timeStamp) {
        const { updateList } = this.state;

        // Animate power slider when spacebar held down
        if (this.state.spaceBarDown) {
            this.animatePowerSlider(timeStamp);
        }

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        this.world.step(SceneParams.TIMESTEP); // Update physics
        this.cannonDebugRenderer.update(); // Update the debug renderer
    }
}

export default MainScene;
