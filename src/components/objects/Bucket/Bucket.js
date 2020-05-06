import { Group } from 'three';
import { MeshStandardMaterial, Mesh } from 'three';
import { CircleBufferGeometry } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './flag.obj';
import MAT from './flag.mtl';

class Bucket extends Group {
    constructor() {
        super();

        // Initialize state and bucket properties
        this.state = {};
        this.name = 'bucket';
        this.radius = 3.0;
        this.flag = null;

        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.setResourcePath('src/components/objects/Bucket/');
        mtlLoader.load(MAT, (material) => {
            material.preload();
            loader.setMaterials(material).load(MODEL, (obj) => {
                obj.scale.set(25, 30, 25);
                obj.position.set(1.0, 15.0, 1.0);
                obj.rotateY(-Math.PI/4);
                this.add(obj);
            });
        });

        // Create a bucket using an open-ended cylinder
        const segmentSize = 32;
        const bucketGeometry = new CircleBufferGeometry(
            this.radius,
            segmentSize
        );
        const bucketMaterial = new MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.3,
        });
        const bucketMesh = new Mesh(bucketGeometry, bucketMaterial);
        this.add(bucketMesh);

        bucketMesh.rotateX(-(Math.PI / 2));
    }
}

export default Bucket;
