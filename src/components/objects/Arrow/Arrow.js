import {
    Group,
    SphereGeometry,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    Math,
} from 'three';

class Arrow extends Group {
    constructor(parent, ballPos) {
        super();

        // Initialize state
        this.state = {};
    }
}

export default Arrow;
