import { Group } from 'three';
import { MeshStandardMaterial, Mesh } from 'three';
import { PlaneBufferGeometry, BoxBufferGeometry } from 'three';

class Terrain extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        this.name = 'terrain';

        // Set the height and width of the game terrain
        const terrainSize = 10.0;

        // Create flat mesh that represents the lawn grass
        const terrainGeometry = new PlaneBufferGeometry(terrainSize, terrainSize);
        const terrainMaterial = new MeshStandardMaterial({
            color: 0x315e00,
            metalness: 0.3,
        });
        const terrainMesh = new Mesh(terrainGeometry, terrainMaterial);
        this.add(terrainMesh);

        this.setupTerrainBorders();

    }

    // Creates wall/border around the terrain
    setupTerrainBorders() {
        const width = 0.25;
        const height = 10.0;
        const depth = 0.5;
        const borderSideGeometry = new BoxBufferGeometry(width, height, depth); // Left and Right
        const borderFBGeometry = new BoxBufferGeometry(height, width, depth); // Front and Back
        const borderMaterial = new MeshStandardMaterial({
            color: 0x9b7653,
            metalness: 0.3,
        });
        const borderRightMesh = new Mesh(borderSideGeometry, borderMaterial);
        const borderLeftMesh = new Mesh(borderSideGeometry, borderMaterial);
        const borderTopMesh = new Mesh(borderFBGeometry, borderMaterial);
        const borderBottomMesh = new Mesh(borderFBGeometry, borderMaterial);
        borderRightMesh.position.set(4.875, 0, .25);
        borderLeftMesh.position.set(-4.875, 0, 0.25);
        borderTopMesh.position.set(0, 4.875, 0.25);
        borderBottomMesh.position.set(0, -4.875, 0.25);
        this.add(borderLeftMesh);
        this.add(borderRightMesh);
        this.add(borderTopMesh);
        this.add(borderBottomMesh);
    }
}

export default Terrain;
