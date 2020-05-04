import { Group } from 'three';
import { MeshStandardMaterial, Mesh } from 'three';
import { CircleBufferGeometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './flag.gltf';

class Bucket extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();

        this.name = 'bucket';
        loader.load(MODEL, (gltf) => {
            const flagMesh = gltf.scene;
            flagMesh.scale.set(2, 2, 2);
            this.add(flagMesh);
        });

        // Create a bucket using an open-ended cylinder
        const radius = 3.0;
        const segments = 50;
        const bucketGeometry = new CircleBufferGeometry(radius, segments);
        const bucketMaterial = new MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.3,
        });
        const bucketMesh = new Mesh(bucketGeometry, bucketMaterial);
        this.add(bucketMesh);

        bucketMesh.rotateX(-(Math.PI / 2));
        // this.rotateX(-(Math.PI / 2));
    }
}

export default Bucket;
