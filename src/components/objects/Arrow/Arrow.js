import { Group, Box3, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

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
        this.pivot.remove(this.cube);
        this.pivot.position.set(
            this.ballPos.x,
            this.ballPos.y + 1.5,
            this.ballPos.z
        );
        this.show();

        this.cube.scale.set(1, 1, power / 10 + 0.5);
        const newZ = new Box3().setFromObject(this.cube).getSize().z;
        this.cube.position.set(0, 0, -newZ / 2 - 2);
        this.pivot.add(this.cube);

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