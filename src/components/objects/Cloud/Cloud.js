import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './cloud.obj';
import MAT from './cloud.mtl';

class Cloud extends Group {
    constructor(parent) {
        super();

        // Init state
        this.state = {};

        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.setResourcePath('src/components/objects/Cloud/');
        mtlLoader.load(MAT, (material) => {
            material.preload();
            loader.setMaterials(material).load(MODEL, (obj) => {
                obj.scale.set(5.0, 5.0, 5.0);
                this.add(obj);
            });
        });

        parent.addToUpdateList(this);
    }


    update(timeStamp) {
        this.position.x = this.position.x - 0.3;
        if (this.position.x <= -250.0) {
            this.position.x = 250.0;
        }

    }
}

export default Cloud;
