import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import { Ball, Terrain, Cloud } from 'objects';
import { BasicLights } from 'lights';

class MainScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        // Right now, the GUI is unpopulated
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            spaceBarDown: false, // Power for golf ball
        };

        // Set background to a light blue to represent sky
        this.background = new Color(0x87ceeb);

        // Add meshes to scene
        const terrain = new Terrain();
        const ball = new Ball();
        const lights = new BasicLights();
        const axesHelper = new AxesHelper(5); // Uncomment to help debug positioning

        this.add(ball, terrain, lights, axesHelper);

        this.setupClouds();

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
    }

    setupClouds() {
        const clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloud = new Cloud();
            clouds.push(cloud);
        }

        clouds.forEach((cloud, index) => {
            if (index < clouds.length / 2) {
                cloud.position.set(-index * 5, Math.random() * 3, 5);
            } else {
                cloud.position.set(
                    (index - clouds.length / 2) * 5,
                    Math.random() * -3,
                    5
                );
            }
        });

        clouds.forEach((cloud) => {
            this.add(cloud);
        });
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
                console.log('Pressed space bar');
            }
        }
    }

    handleKeyUpEvents(event) {
        if (event.key === ' ') {
            // Power
            if (this.state.spaceBarDown) {
                this.state.spaceBarDown = false;
                console.log("Let go of space bar");
            }
        }
    }
}

export default MainScene;
