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
            }
            else {
                cloud.position.set((index - clouds.length/2) * 5, Math.random() * -3, 5);
            }
        });

        clouds.forEach((cloud) => {
            this.add(cloud);
        });
    }
}

export default MainScene;
