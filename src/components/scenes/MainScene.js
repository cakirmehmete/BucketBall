import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, Vector3 } from 'three';
import { Ball, Terrain, Cloud, Bucket } from 'objects';
import { BasicLights } from 'lights';

class MainScene extends Scene {
    constructor() {
        super();

        // Init state
        // Right now, the GUI is unpopulated
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [], // Maintains all meshes to be updated
            ball: null, // Reference to golf ball for event handlers

            // Direction/Power for golf ball
            spaceBarDown: false,
            power: 1,
            direction: new Vector3(1,1,1),
        };

        // Set background to a light blue to represent sky
        this.background = new Color(0x87ceeb);

        // Initialize base terrain and set base parameters that will
        // be used to determine relative mesh positions
        const TERRAINSIZE = 50.0;
        const terrain = new Terrain(TERRAINSIZE, TERRAINSIZE);
        this.terrain = terrain;
        const rootPosition = terrain.position;
        const rootWidth = terrain.terrainWidth;
        const rootHeight = terrain.terrainHeight;
        const rootDepth = terrain.terrainDepth;

        const ball = new Ball(this);
        this.state.ball = ball;
        const lights = new BasicLights();
        const axesHelper = new AxesHelper(10); // Uncomment to help debug positioning

        this.add(ball, terrain, lights, axesHelper);

        this.setupClouds(terrain.terrainDepth);
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

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    // Add randomized clouds to the environment
    setupClouds(baseDepth) {
        const clouds = [];
        const cloudHeight = baseDepth + 20;
        for (let i = 0; i < 5; i++) {
            const cloud = new Cloud();
            clouds.push(cloud);
        }

        clouds.forEach((cloud, index) => {
            if (index < clouds.length / 2) {
                cloud.position.set(-index * 5, cloudHeight, Math.random() * 25);
            } else {
                cloud.position.set(
                    (index - clouds.length / 2) * 5,
                    cloudHeight,
                    Math.random() * 25
                );
            }
        });

        clouds.forEach((cloud) => {
            this.add(cloud);
        });
    }

    // Add bucket/hole to the environment
    setupBucket() {
        const bucket = new Bucket();
        bucket.position.set(this.terrain.terrainWidth  / 2 - 10, this.terrain.terrainDepth + 1, -this.terrain.terrainHeight / 2 + 10);
        this.add(bucket);
    }

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

    handleKeyUpEvents(event) {
        if (event.key === ' ') {
            // Power
            if (this.state.spaceBarDown) {
                this.state.ball.shootBall(
                    this.state.direction,
                    this.state.power
                );
                this.state.spaceBarDown = false;
            }
        }
    }
}

export default MainScene;
