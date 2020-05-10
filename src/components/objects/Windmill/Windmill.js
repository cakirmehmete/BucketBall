import { Group, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box, Vec3, Body } from 'cannon';
import MODEL from './windmill.glb';

class Windmill extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            this.mixer = mixer;
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
            this.add(gltf.scene);
        });
        this.scale.set(20, 20, 20);
        this.position.set(10, 0, 100);
        this.rotation.y = Math.PI;

        // var geometry = new BoxGeometry(0.1, 0.1, 0.1);
        // var material = new MeshBasicMaterial({ color: 0x00ff00 });
        // var cube = new Mesh(geometry, material);
        // cube.position.set(-0.5, 1.83, 0.7);
        // this.add(cube);

        // var tipGeo = new BoxGeometry(0.5, 1.2, 0.1);
        // var tip1 = new Mesh(tipGeo, material);
        // tip1.position.set(-0.6, 0.2, 0.7);
        // this.add(tip1);

        // const mass = 0;
        // const shape = new Box(new Vec3(5, 12, 1));
        // const body = new Body({ mass: mass, shape: shape });
        // body.position.set(
        //     this.position.x - 6,
        //     this.position.y + 15,
        //     this.position.z - 15
        // );
        // parent.world.addBody(body);

        // let pivot = new Group();
        // this.pivot = pivot;
        // pivot.position.set(-0.5, 1.83, 0.7);
        // this.add(pivot);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    spin() {}

    update(timeStamp) {
        if (this.mixer) {
            this.mixer.update(1 / 30);
        }
    }
}

export default Windmill;
