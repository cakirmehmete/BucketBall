import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './Helicopter.obj';
import MAT from './Helicopter.mtl';

class Helicopter extends Group {
    constructor() {
        super();

        // Init state
        this.state = {};

        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.setResourcePath('src/components/objects/Helicopter/');
        mtlLoader.load(MAT, (material) => {
            material.preload();
            loader.setMaterials(material).load(MODEL, (obj) => {
                obj.scale.multiplyScalar(0.5);
                this.add(obj);
            });
        });
    }
}

export default Helicopter;
