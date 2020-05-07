import { Group, Vector3, Face3 } from 'three';
import { MeshStandardMaterial, Mesh, TextureLoader } from 'three';
import { BoxBufferGeometry, Geometry } from 'three';
import grassTexture from '../../../resources/grass.png';
import { Noise } from 'noisejs';

class Terrain extends Group {
    constructor(width, height) {
        super();
        this.name = 'terrain';

        // Set the height and width of the game terrain
        this.terrainWidth = width; // width associated with x-axis
        this.terrainHeight = height; // height associated with z-axis
        this.terrainDepth = 0; // depth associated with y-axis

        // Parameters associated with building hills on the terrain
        this.xSpacing = 1.0;
        this.zSpacing = 1.0;
        this.maxHeight = 2.0;

        // Use Perlin Noise to randomly generate a hill-like terrain on given
        // parts of the field. Adapted from http://www.dominictran.com/pdf/ThreeJS.Essentials.PACKT.pdf

        // Seed the noise so that the hills are randomized at a given time
        const date = new Date();
        const noise = new Noise(date.getMilliseconds());

        // Generate a hill-like terrain using a custom geometry
        const terrainGeometry = new Geometry();
        for (let z = 0; z < this.terrainHeight; z++) {
            for (let x = 0; x < this.terrainWidth; x++) {
                let heightVal = 0;
                if (z > this.terrainHeight / 2) {
                    heightVal = Math.abs(
                        noise.perlin2(x / 10, z / 10) * this.maxHeight * 2.5
                    );
                }
                const vertex = new Vector3(
                    x * this.xSpacing,
                    heightVal,
                    z * this.zSpacing
                );
                terrainGeometry.vertices.push(vertex);
            }
        }
        // Construct faces out of the vertices from geometry
        for (let z = 0; z < this.terrainHeight - 1; z++) {
            for (let x = 0; x < this.terrainWidth - 1; x++) {
                const a = x + z * this.terrainWidth;
                const b = x + 1 + z * this.terrainWidth;
                const c = x + (z + 1) * this.terrainWidth;
                const d = x + 1 + (z + 1) * this.terrainWidth;
                const face1 = new Face3(b, a, c);
                const face2 = new Face3(c, d, b);
                terrainGeometry.faces.push(face1);
                terrainGeometry.faces.push(face2);
            }
        }
        terrainGeometry.computeFaceNormals();

        // Create material and mesh
        const loader = new TextureLoader();
        const terrainMaterial = new MeshStandardMaterial({
            color: 0x315e00,
            map: loader.load(grassTexture),
        });
        const terrainMesh = new Mesh(terrainGeometry, terrainMaterial);
        terrainMesh.translateX(-this.terrainWidth / 2);
        terrainMesh.translateZ(-this.terrainHeight / 2);
        this.add(terrainMesh);

        // // Create flat mesh that represents the lawn grass
        // const terrainGeometry = new PlaneBufferGeometry(
        //     this.terrainWidth,
        //     this.terrainHeight
        // );

        // // const loader = new TextureLoader();
        // const terrainMaterial = new MeshStandardMaterial({
        //     color: 0x315e00,
        //     metalness: 0.3,
        //     // map: loader.load('src/resources/grass.jpeg')
        // });
        // const terrainMesh = new Mesh(terrainGeometry, terrainMaterial);
        // this.add(terrainMesh);

        // // Rotate to align with X-Z axis
        // terrainMesh.rotateX(-(Math.PI / 2.0));

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
    }
}

export default Terrain;
