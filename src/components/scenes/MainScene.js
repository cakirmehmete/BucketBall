import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, Vector3 } from 'three';
import { Ball, Terrain, Cloud, Bucket } from 'objects';
import { BasicLights } from 'lights';

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
            power: 1,
            direction: new Vector3(1, 1, 1),
        };
        this.terrain = null;
        this.ball = null;
        this.bucket = null;

        // Set background to a light blue to represent sky
        this.background = new Color(0x87ceeb);

        const lights = new BasicLights();
        const axesHelper = new AxesHelper(100); // Uncomment to help debug positioning

        this.add(lights, axesHelper);

        this.setupTerrain(TERRAINSIZE, TERRAINSIZE);
        this.setupClouds(this.terrain.terrainDepth);
        this.setupBall();
        this.setupBucket();

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
        this.state.gui.add(this.state, 'power', 1, 10);
    }

    // Add X-Z aligned terrain to the environment
    setupTerrain(terrainWidth, terrainHeight) {
        const terrain = new Terrain(terrainWidth, terrainHeight);
        this.add(terrain);
        this.terrain = terrain;
    }

    // Add ball to the environment
    setupBall() {
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
        const baseDepth = this.terrain.terrainDepth;
        const clouds = [];
        const cloudHeight = baseDepth + 100.0;
        for (let i = 0; i < 5; i++) {
            const cloud = new Cloud();
            clouds.push(cloud);
        }

        clouds.forEach((cloud, index) => {
            if (index < clouds.length / 2) {
                cloud.position.set(
                    -index * 125.0,
                    cloudHeight,
                    Math.random() * 50.0
                );
            } else {
                cloud.position.set(
                    (index - clouds.length / 2) * 125.0,
                    cloudHeight,
                    Math.random() * -50.0
                );
            }
        });

        clouds.forEach((cloud) => {
            this.add(cloud);
        });
    }

    // Account for collisions between ball and given obstacles, environment, and terrain
    handleCollisions() {
        this.ball.handleFloorCollisions(this.terrain);
    }

    // Callback function for keydown events
    handleKeyDownEvents(event) {
        if (event.key === 'w') {
            // Up
            console.log('Up');
        } else if (event.key === 's') {
            // Down
            console.log('Down');
        } else if (event.key === 'a') {
            // Left
            console.log('Left');
        } else if (event.key === 'd') {
            // Right
            console.log('Right');
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
                this.ball.shootBall(this.state.direction, this.state.power);
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
    }
}

export default MainScene;
