import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import { Ball, Terrain, Cloud, Bucket, Crate } from 'objects';
import { BasicLights } from 'lights';
import { World, Sphere, Box, Vec3, NaiveBroadphase, Body, Plane } from 'cannon';
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

        this.world = new World();
        this.world.broadphase = new NaiveBroadphase();
        this.terrain = null;
        this.ball = null;
        this.bucket = null;

        // Setup Collisions
        this.world = new World();
        this.world.broadphase = new NaiveBroadphase();
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
        this.setupClouds(this.terrain.terrainDepth);
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
                this.arrow.updateShotDirectionPower(
                    this.ball.position,
                    0,
                    0,
                    this.state.power
                );
                this.ball.updateShotDirectionPower(0, 0, this.state.power);
            }.bind(this)
        );
    }

    // Add X-Z aligned terrain to the environment
    setupTerrain(terrainWidth, terrainHeight) {
        const terrain = new Terrain(terrainWidth, terrainHeight);
        this.add(terrain);
        this.terrain = terrain;

        var groundShape = new Plane();
        var groundBody = new Body({ mass: 0, shape: groundShape });
        this.world.add(groundBody);
    }

    // Add ball to the environment
    setupBall() {
        this.ball = new Ball(this);
        this.add(this.ball);
        const ballMesh = this.ball.children[0];
        const mass = 0.1;
        const sphereShape = new Sphere(ballMesh.radius); // Step 1
        const sphereBody = new Body({mass: mass, shape: sphereShape}); // Step 2
        this.sphereBody = sphereBody;
        const rootPosition = this.terrain.position;
        this.ball.position.set(
            rootPosition.x,
            this.ball.radius,
            rootPosition.z
        );

        sphereBody.position.set(this.ball.position.clone());
        this.world.add(sphereBody); // Step 3
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
            // crate.rotateY(Math.random() * Math.PI);
        });

        crates.forEach((crate) => {
            const crateMesh = this.ball.children[0];
            const mass = 1.0;
            const boxShape = new Box(new Vec3(10.0, 10.0, 10.0)); // Step 1
            const boxBody = new Body({mass: mass, shape: boxShape}); // Step 2
            this.add(crate);
            boxBody.position.set(crateMesh.position.clone());
            this.world.addBody(boxBody);
        });
    }

    // Account for collisions between ball and given obstacles, environment, and terrain
    handleCollisions() {
        this.ball.handleFloorCollisions(this.terrain);
    }

    // Callback function for keydown events
    handleKeyDownEvents(event) {
        const offset = 2;
        const power = this.state.power;
        if (event.key === 'w') {
            // Up
            this.arrow.updateShotDirectionPower(
                this.ball.position,
                0,
                -offset,
                power
            );
            this.ball.updateShotDirectionPower(0, -offset, power);
        } else if (event.key === 's') {
            // Down
            this.arrow.updateShotDirectionPower(
                this.ball.position,
                0,
                offset,
                power
            );
            this.ball.updateShotDirectionPower(0, offset, power);
        } else if (event.key === 'a') {
            // Left
            this.arrow.updateShotDirectionPower(
                this.ball.position,
                offset,
                0,
                power
            );
            this.ball.updateShotDirectionPower(offset, 0, power);
        } else if (event.key === 'd') {
            // Right
            this.arrow.updateShotDirectionPower(
                this.ball.position,
                -offset,
                0,
                power
            );
            this.ball.updateShotDirectionPower(-offset, 0, power);
        } else if (event.key === ' ') {
            // Power
            if (!this.state.spaceBarDown) {
                this.state.spaceBarDown = true;
            }
        }
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

    // Handle animations
    update(timeStamp) {
        const { updateList } = this.state;
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
        this.sphereBody.position.set(this.ball.position.clone());
        this.world.step(timeStamp);
        this.handleCollisions();

        this.world.step(SceneParams.TIMESTEP); // Update physics
        this.cannonDebugRenderer.update(); // Update the debug renderer
    }
}

export default MainScene;
