import { Group } from 'three';
import { MeshStandardMaterial, Mesh, TextureLoader } from 'three';
import { BoxBufferGeometry, PlaneBufferGeometry } from 'three';
import grassTexture from '../../../resources/grass.png';
import { Box, Vec3, Body } from 'cannon';

class Terrain extends Group {
    constructor(width, height, parent) {
        super();
        this.name = 'terrain';
        this.parent = parent;
        // Set the height and width of the game terrain
        this.terrainWidth = width; // width associated with x-axis
        this.terrainHeight = height; // height associated with z-axis
        this.terrainDepth = 0; // depth associated with y-axis

        // Create flat mesh that represents the lawn grass
        const terrainGeometry = new PlaneBufferGeometry(
            this.terrainWidth,
            this.terrainHeight
        );

        const loader = new TextureLoader();
        const terrainMaterial = new MeshStandardMaterial({
            color: 0x315e00,
            metalness: 0.3,
            map: loader.load(grassTexture)
        });
        const terrainMesh = new Mesh(terrainGeometry, terrainMaterial);
        this.add(terrainMesh);

        // Rotate to align with X-Z axis
        terrainMesh.rotateX(-(Math.PI / 2.0));

        this.setupTerrainBorders();
    }

    // Creates wall/border around the terrain
    setupTerrainBorders() {
        const boxWidth = 5;
        const boxDepth = 5;
        const borderSideGeometry = new BoxBufferGeometry(
            boxWidth,
            boxDepth,
            this.terrainHeight + boxWidth * 2.0
        ); // Left and Right Walls
        const borderFBGeometry = new BoxBufferGeometry(
            this.terrainWidth + boxWidth * 2.0,
            boxDepth,
            boxWidth
        ); // Front and Back Walls
        const borderMaterial = new MeshStandardMaterial({
            color: 0x9b7653,
            metalness: 0.3,
        });

        // Create bordering walls and add them to the edges of the terrain
        const EPS = 1.0;
        const borderRightMesh = new Mesh(borderSideGeometry, borderMaterial);
        const borderLeftMesh = new Mesh(borderSideGeometry, borderMaterial);
        const borderTopMesh = new Mesh(borderFBGeometry, borderMaterial);
        const borderBottomMesh = new Mesh(borderFBGeometry, borderMaterial);
        const sidePosition = this.terrainWidth / 2 + boxWidth / 2;
        const fbPosition = this.terrainHeight / 2 + boxWidth / 2;
        borderRightMesh.position.set(sidePosition - EPS, boxDepth / 2, 0);
        borderLeftMesh.position.set(-sidePosition + EPS, boxDepth / 2, 0);
        borderTopMesh.position.set(0, boxDepth / 2, -fbPosition + EPS);
        borderBottomMesh.position.set(0, boxDepth / 2, fbPosition - EPS);

        this.add(borderLeftMesh);
        this.add(borderRightMesh);
        this.add(borderTopMesh);
        this.add(borderBottomMesh);

        // Add corresponding cannon bodies to each border
        const sideBorderShape = new Box(
            new Vec3(
                boxWidth / 2.0,
                boxDepth / 2.0,
                (this.terrainHeight + boxWidth * 2.0) / 2.0
            )
        );
        const fbBorderShape = new Box(
            new Vec3(
                (this.terrainWidth + boxWidth * 2.0) / 2.0,
                boxDepth / 2.0,
                boxWidth / 2.0
            )
        );
        const borderLeftBody = new Body({
            mass: 0,
            shape: sideBorderShape,
            position: new Vec3(
                borderLeftMesh.position.x,
                borderLeftMesh.position.y,
                borderLeftMesh.position.z
            ),
        });
        const borderRightBody = new Body({
            mass: 0,
            shape: sideBorderShape,
            position: new Vec3(
                borderRightMesh.position.x,
                borderRightMesh.position.y,
                borderRightMesh.position.z
            ),
        });
        const borderTopBody = new Body({
            mass: 0,
            shape: fbBorderShape,
            position: new Vec3(
                borderTopMesh.position.x,
                borderTopMesh.position.y,
                borderTopMesh.position.z
            ),
        });
        const borderBottomBody = new Body({
            mass: 0,
            shape: fbBorderShape,
            position: new Vec3(
                borderBottomMesh.position.x,
                borderBottomMesh.position.y,
                borderBottomMesh.position.z
            ),
        });

        this.parent.world.add(borderLeftBody);
        this.parent.world.add(borderRightBody);
        this.parent.world.add(borderTopBody);
        this.parent.world.add(borderBottomBody);
    }
}

export default Terrain;
