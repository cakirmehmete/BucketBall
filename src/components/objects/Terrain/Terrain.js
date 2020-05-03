import { Group } from 'three';
import { MeshStandardMaterial, Mesh } from 'three';
import { PlaneBufferGeometry, BoxBufferGeometry } from 'three';

class Terrain extends Group {
    constructor(width, height) {
        // Call parent Group() constructor
        super();
        this.name = 'terrain';

        // Set the height and width of the game terrain
        this.terrainWidth = width; // width associated with x-axis
        this.terrainHeight = height; // height associated with y-axis
        this.terrainDepth = 0; // depth associated with z-axis

        // Create flat mesh that represents the lawn grass
        const terrainGeometry = new PlaneBufferGeometry(
            this.terrainWidth,
            this.terrainHeight
        );
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
        const boxWidth = 0.25;
        const boxDepth = 0.5;
        const borderSideGeometry = new BoxBufferGeometry(boxWidth, this.terrainHeight, boxDepth); // Left and Right Walls
        const borderFBGeometry = new BoxBufferGeometry(this.terrainWidth, boxWidth, boxDepth); // Front and Back Walls
        const borderMaterial = new MeshStandardMaterial({
            color: 0x9b7653,
            metalness: 0.3,
        });

        // Create bordering walls and add them to the edges of the terrain
        const borderRightMesh = new Mesh(borderSideGeometry, borderMaterial);
        const borderLeftMesh = new Mesh(borderSideGeometry, borderMaterial);
        const borderTopMesh = new Mesh(borderFBGeometry, borderMaterial);
        const borderBottomMesh = new Mesh(borderFBGeometry, borderMaterial);
        const sidePosition = this.terrainWidth / 2 - boxWidth / 2;
        const fbPosition = this.terrainHeight / 2 - boxWidth / 2;
        borderRightMesh.position.set(sidePosition, 0, boxDepth / 2);
        borderLeftMesh.position.set(-sidePosition, 0, boxDepth / 2);
        borderTopMesh.position.set(0, fbPosition, boxDepth / 2);
        borderBottomMesh.position.set(0, -fbPosition, boxDepth / 2);

        this.add(borderLeftMesh);
        this.add(borderRightMesh);
        this.add(borderTopMesh);
        this.add(borderBottomMesh);
    }
}

export default Terrain;
