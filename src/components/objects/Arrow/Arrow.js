import { Group, BoxGeometry, MeshBasicMaterial, Mesh, Math } from 'three';

class Arrow extends Group {
    constructor(parent, ballPos) {
        super();
        this.parent = parent;
        this.ballPos = ballPos;

        // Initialize state
        this.state = {};

        // Create the mesh for the arrow
        this.setupArrowMesh();
    }

    setupArrowMesh() {
        // Create a box and then a pyramid
        var geometry = new THREE.BoxGeometry(1, 1, 10);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(this.ballPos.x, this.ballPos.y, this.ballPos.z - 7);
        this.add(cube);
    }

    updateShotDirectionPower(offset, power) {
        // Change the arrow
    }

    show() {
        // Show the arrow
    }

    hide() {
        // Hide the arrow
    }
}

export default Arrow;
