import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, Vector3 } from 'three';
import { Ball, Terrain, Cloud, Bucket, Crate } from 'objects';
import { BasicLights } from 'lights';
import { World, Sphere, Box, Vec3, NaiveBroadphase, Body } from 'cannon';
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
        this.world = new World();
        this.world.broadphase = new NaiveBroadphase();
        this.world.gravity.set(0, 0, 0);
        // this.world.solver.iterations = 10;
        this.cannonDebugRenderer = new THREE.CannonDebugRenderer(
            this,
            this.world
        );

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

    // Add X-Z aligned terrain to the environment
    setupTerrain(terrainWidth, terrainHeight) {
        const terrain = new Terrain(terrainWidth, terrainHeight, this);
        this.add(terrain);
        this.terrain = terrain;

        const groundShape = new Box(
            new Vec3(terrainWidth / 2, 100, terrainHeight / 2)
        );
        const groundBody = new Body({
            mass: 0,
            shape: groundShape,
            position: new Vec3(0, -100, 0), // hacky way to make sure ball doesnt fall through
        });
        this.world.addBody(groundBody);
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
        arrow.updateShotDirectionPower(
            this.ball.position,
            0,
            0,
            this.state.power
        );
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

    updateBallHelper(x, y, power) {
        this.arrow.updateShotDirectionPower(this.ball.position, x, y, power);
        this.ball.updateShotDirectionPower(x, y, power);
    }

    // Callback function for keyup events
    handleKeyUpEvents(event) {
        if (event.key === ' ') {
            // Power
            if (this.state.spaceBarDown) {
                this.arrow.cleanUp();
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
        this.updateBallHelper(0, 0, this.state.power);
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
