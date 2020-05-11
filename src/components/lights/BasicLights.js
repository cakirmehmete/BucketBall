import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 250, 0.8, 1, 1);
        dir.castShadow = true;
        //Set up shadow properties for the light
        dir.shadow.mapSize.width = 512; // default
        dir.shadow.mapSize.height = 512; // default
        dir.shadow.camera.near = 0.5; // default
        dir.shadow.camera.far = 500; // default
        this.dir = dir;

        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.0);

        dir.position.set(125, 125, -200);
        dir.target.position.set(10, 0, 0);

        this.add(dir, ambi, hemi);
    }
}

export default BasicLights;
