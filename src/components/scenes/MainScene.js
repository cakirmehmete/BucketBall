import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import { Terrain } from 'objects';
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
        const lights = new BasicLights();
        const axesHelper = new AxesHelper(5); // Uncomment to help debug positioning
        this.add(terrain, lights, axesHelper);

    }
}

export default MainScene;
