import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        // const dir = new SpotLight(0xffffff, 1.6, 250, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.0);

        // dir.position.set(200, 200, 200);
        // dir.target.position.set(0, 0, 0);

        this.add(ambi, hemi);
    }
}

export default BasicLights;
