import { Group, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

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
        var geometry = new BoxGeometry(1, 1, 10);
        var material = new MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new Mesh(geometry, material);
        cube.position.set(this.ballPos.x, this.ballPos.y, this.ballPos.z - 7);
        this.cube = cube;
        this.add(cube);

        let pivot = new Group();
        this.pivot = pivot;
        pivot.position.set(
            this.ballPos.x,
            this.ballPos.y + 1.5,
            this.ballPos.z
        );
        this.add(pivot);
        pivot.add(cube);
    }

    updateShotDirectionPower(offset, power) {
        // Change the arrow
        this.pivot.position.set(
            this.ballPos.x,
            this.ballPos.y + 1.5,
            this.ballPos.z
        );
        this.show();
        this.pivot.rotation.y += offset;
    }

    show() {
        // Show the arrow
        this.visible = true;
    }

    hide() {
        // Hide the arrow
        this.visible = false;
    }
}

export default Arrow;
