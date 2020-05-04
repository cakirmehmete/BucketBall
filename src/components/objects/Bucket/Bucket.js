import { Group } from 'three';
import { MeshStandardMaterial, Mesh } from 'three';
import { CylinderBufferGeometry } from 'three';

class Bucket extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Create a bucket using an open-ended cylinder
        const radTop = 2;
        const radBottom = 1;
        const height = 2;
        const bucketGeometry = new CylinderBufferGeometry(radTop, radBottom, height);
        const bucketMaterial = new MeshStandardMaterial({
            color: 0x404040,
            metalness: 0.3,
        });
        const bucketMesh = new Mesh(bucketGeometry, bucketMaterial);
        this.add(bucketMesh);
    }
}

export default Bucket;
