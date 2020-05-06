import { Group, TextureLoader } from 'three';
import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

class Crate extends Group {
    constructor(size) {
        super();

        // Init state
        this.state = {};
        this.width = size;
        this.height = size;
        this.depth = size;
        this.name = 'crate';

        const crateGeometry = new BoxGeometry(
            this.width,
            this.height,
            this.depth
        );

        const loader = new TextureLoader();
        const crateMaterial = new MeshStandardMaterial({
            roughness: 0.8,
            metalness: 0.0,
            map: loader.load('src/resources/crate0_diffuse.png'),
            normalMap: loader.load('src/resources/crate0_normal.png'),
        });
        const crateMesh = new Mesh(crateGeometry, crateMaterial);
        this.add(crateMesh);
    }
}

export default Crate;
