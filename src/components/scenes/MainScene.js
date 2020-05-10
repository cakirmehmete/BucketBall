import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, CameraHelper } from 'three';
import { Ball, Terrain, Cloud, Bucket, Crate, Helicopter } from 'objects';
import { Game } from 'objects';
import { BasicLights } from 'lights';
import {
    World,
    GSSolver,
    Box,
    Vec3,
    NaiveBroadphase,
    Body,
    SplitSolver,
    Material,
    ContactMaterial,
    Plane,
    Sphere,
} from 'cannon';
import Arrow from '../objects/Arrow/Arrow';
import Bench from '../objects/Bench/Bench';
import Tree from '../objects/Tree/Tree';
import Campfire from '../objects/Campfire/Campfire';
import Bridge from '../objects/Bridge/Bridge';
import SceneParams from '../params';

class MainScene extends Scene {
    constructor(nextLevel, camera) {
        super();

        // Define constant values
        const TERRAINSIZE = 250.0;

        // Initialize state and scene properties
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [], // Maintains all meshes to be updated

            // Direction/Power for golf ball
            spaceBarDown: false,
            power: 3,
            complete: false,
        };
        this.terrain = null;
        this.ball = null;
        this.bucket = null;
        this.game = null;
        this.camera = camera;
        this.nextLevel = nextLevel;

        // Setup physical world using CannonJS
        this.setupCannon();

        // Setup game object to keep track of score and win conditions
        this.setupGame();

        // Set background to a light blue to represent sky
        this.background = new Color(0x87ceeb);

        const lights = new BasicLights();
        const helper = new CameraHelper(lights.dir.shadow.camera);
        this.add(helper);
        this.add(lights);

        // Initialize different objects and place them accordingly in the scene
        this.setupTerrain(TERRAINSIZE, TERRAINSIZE);
        this.setupClouds();
        this.setupBall();
        this.setupBucket();
        this.setupArrow();
        this.setupCrates();
        this.setupHelicopter();
        this.setupBenches();
        this.setupTrees();
        this.setupCampfires();

        // Setup Event handler for Golf Ball
        window.addEventListener(
            'keydown',
            this.handleKeyDownEvents.bind(this),
            false
        );
        window.addEventListener(
            'keyup',
            this.handleKeyUpEvents.bind(this),
            false
        );

        // Populate GUI
        const slider = this.state.gui.add(this.state, 'power', 1, 10).listen();
        slider.onChange(
            function () {
                this.updateBallHelper(0, 0, this.state.power);
            }.bind(this)
        );
    }

    setupGame() {
        this.game = new Game();
    }

    /*
    Adapted From: https://schteppe.github.io/cannon.js/examples/threejs_fps.html
    */
    setupCannon() {
        // Setup our world
        let world = new World();
        this.world = world;
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;

        let solver = new GSSolver();

        world.defaultContactMaterial.contactEquationStiffness = 1e9;
        world.defaultContactMaterial.contactEquationRelaxation = 4;

        solver.iterations = 7;
        solver.tolerance = 0.1;
        let split = true;
        if (split) world.solver = new SplitSolver(solver);
        else world.solver = solver;

        world.gravity.set(0, -9.82, 0);
        world.broadphase = new NaiveBroadphase();

        // Debugging
        this.cannonDebugRenderer = new THREE.CannonDebugRenderer(
            this,
            this.world
        );

        // Create a slippery material (friction coefficient = 0.0)
        let physicsMaterial = new Material('slipperyMaterial');
        let physicsContactMaterial = new ContactMaterial(
            physicsMaterial,
            physicsMaterial,
            0.0, // friction coefficient
            0.3 // restitution
        );
        // We must add the contact materials to the world
        world.addContactMaterial(physicsContactMaterial);
    }

    // Add X-Z aligned terrain to the environment
    setupTerrain(terrainWidth, terrainHeight) {
        const terrain = new Terrain(terrainWidth, terrainHeight, this);
        this.add(terrain);
        this.terrain = terrain;

        var groundShape = new Plane();
        var groundBody = new Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
        this.world.add(groundBody);
    }

    // Add ball to the environment
    setupBall() {
        // Add ball mesh to scene
        const edgeOffset = 30.0;
        const startingPositionX = this.terrain.terrainWidth / 2.0 - edgeOffset;
        const startingPositionZ = this.terrain.terrainHeight / 2.0 - edgeOffset;
        this.ball = new Ball(this, startingPositionX, startingPositionZ);
        this.add(this.ball);

        // Hacky way to push the ball up
        this.ball.position.set(0, this.ball.radius, 0);
    }

    // Add bucket/hole to the environment
    setupBucket() {
        const EPS = 0.05;
        const edgeOffset = 10.0;
        const bucket = new Bucket();
        bucket.position.set(
            this.terrain.terrainWidth / 2.0 - edgeOffset,
            this.terrain.terrainDepth + EPS,
            -this.terrain.terrainHeight / 2.0 + edgeOffset
        );
        this.add(bucket);
        this.bucket = bucket;
    }

    // Add helicopters to the environment
    setupHelicopter() {
        const helicopterOne = new Helicopter(1);
        const helicopterTwo = new Helicopter(2);
        const max = 0;
        const min = Math.ceil(this.terrain.terrainHeight / 2 + 10.0);
        const xPos = Math.floor(Math.random() * 150.0);
        const yPos = this.terrain.terrainDepth + 80.0;
        const zPos = Math.floor(Math.random() * (max - min)) + min;

        helicopterOne.position.set(xPos, yPos, -zPos);
        helicopterTwo.position.set(-xPos + 20.0, yPos, -zPos);
        this.add(helicopterOne, helicopterTwo);
    }

    // Add randomized clouds to the environment
    setupClouds() {
        const clouds = [];
        const cloudHeight = this.terrain.terrainDepth + 100.0;
        for (let i = 0; i < 8; i++) {
            const cloud = new Cloud();
            clouds.push(cloud);
        }

        clouds.forEach((cloud, index) => {
            const cloudDepth = Math.floor(
                Math.random() * (125.0 - 10.0) + 10.0
            );
            const cloudWidth = Math.floor(Math.random() * 150.0);
            if (index < clouds.length / 2) {
                cloud.position.set(-cloudWidth, cloudHeight, -cloudDepth);
            } else {
                cloud.position.set(cloudWidth, cloudHeight, -cloudDepth);
            }
            this.add(cloud);
        });
    }

    // Add projectile arrow graphic to the ball
    setupArrow() {
        const arrow = new Arrow(this, this.ball.mesh.position);
        this.add(arrow);
        this.arrow = arrow;
    }

    // Add benches to the environment
    setupBenches() {
        const benches = [];
        const benchOne = new Bench();
        benchOne.position.set(-20.0, 5.0, this.terrain.terrainHeight / 2 - 55.0);
        this.add(benchOne);
        benches.push(benchOne);

        const benchTwo = new Bench();
        benchTwo.position.set(20, 5.0, 0);
        this.add(benchTwo);
        benches.push(benchTwo);

        const benchThree = new Bench();
        benchThree.position.set(-20, 5.0, -(this.terrain.terrainHeight / 2) + 55.0);
        this.add(benchThree);
        benches.push(benchThree);

        // Add cannon bodies to each bench
        const mass = 0;
        benches.forEach((bench) => {
            const shape = new Box(new Vec3(1.75, 2, 5));

            const body = new Body({ mass: mass, shape: shape });
            body.position.set(bench.position.x + 8.5, 2, bench.position.z);
            this.world.addBody(body);

            const body1 = new Body({ mass: mass, shape: shape });
            body1.position.set(bench.position.x - 9, 2, bench.position.z);
            this.world.addBody(body1);
        });
    }

    setupCampfires() {
        const campfires = [];
        const campfireOne = new Campfire();
        campfireOne.position.set(-37.0, 0, this.terrain.terrainHeight / 2 - 55.0);
        this.add(campfireOne);
        campfires.push(campfireOne);

        const campfireTwo = new Campfire();
        campfireTwo.position.set(37.0, 0, 0);
        this.add(campfireTwo);
        campfires.push(campfireTwo);

        const campfireThree = new Campfire();
        campfireThree.position.set(-37.0, 0, -(this.terrain.terrainHeight / 2) + 55.0);
        this.add(campfireThree);
        campfires.push(campfireThree);

        const mass = 0;
        campfires.forEach((campfire) => {
            const shape = new Sphere(4.0);

            const body = new Body({ mass: mass, shape: shape });
            body.position.set(campfire.position.x, 0, campfire.position.z);
            this.world.addBody(body);
        });
    }

    // Add stones to environment
    setupTrees() {
        const trees = [];
        const treeOne = new Tree();
        treeOne.position.set(-100.0, 0, this.terrain.terrainHeight / 2 - 55.0);
        this.add(treeOne);
        trees.push(treeOne);

        const treeTwo = new Tree();
        treeTwo.position.set(100.0, 0, 0);
        this.add(treeTwo);
        trees.push(treeTwo);

        const treeThree = new Tree();
        treeThree.position.set(-100.0, 0, -(this.terrain.terrainHeight / 2) + 55.0);
        this.add(treeThree);
        trees.push(treeThree);

        const mass = 0;
        trees.forEach((tree) => {
            const shape = new Box(new Vec3(1, 4, 1));

            const body = new Body({ mass: mass, shape: shape });
            body.position.set(tree.position.x, 0, tree.position.z);
            this.world.addBody(body);
        });
    }

    // Add randomized crates to the environment
    setupCrates() {
        const crateSize = 10.0;
        const EPS = 4.0;
        const crates = [];
        for (let i = 1; i < 14; i++) {
            const crate = new Crate(crateSize);
            const xPosition =
                this.terrain.terrainWidth / 2 + EPS - i * crateSize;
            const yPosition = crateSize / 2.0;
            const zPosition = this.terrain.terrainHeight / 2 - 55.0;

            crate.position.set(xPosition, yPosition, zPosition);
            this.add(crate);
            crates.push(crate);
        }

        for (let i = 1; i < 14; i++) {
            const crate = new Crate(crateSize);
            const xPosition =
                i * crateSize - (this.terrain.terrainWidth / 2 + EPS);
            const yPosition = crateSize / 2.0;
            const zPosition = 0;

            crate.position.set(xPosition, yPosition, zPosition);
            this.add(crate);
            crates.push(crate);
        }

        for (let i = 1; i < 14; i++) {
            const crate = new Crate(crateSize);
            const xPosition =
                this.terrain.terrainWidth / 2 + EPS - i * crateSize;
            const yPosition = crateSize / 2.0;
            const zPosition = -(this.terrain.terrainHeight / 2) + 55.0;

            crate.position.set(xPosition, yPosition, zPosition);
            this.add(crate);
            crates.push(crate);
        }

        // Add a cannon body to each crate
        crates.forEach((crate) => {
            const mass = 0;
            const crateShape = new Box(
                new Vec3(crateSize / 2, crateSize / 2, crateSize / 2)
            );
            const crateBody = new Body({ mass: mass, shape: crateShape });
            crateBody.position.set(
                crate.position.x,
                crate.position.y,
                crate.position.z
            );
            this.world.addBody(crateBody);
        });
    }

    // Callback function for keydown events
    handleKeyDownEvents(event) {
        if (this.state.complete === true) {
            return;
        }

        const offset = 0.1;
        const power = this.state.power;

        if (this.game.state.won) {
            if (event.keyCode === 13) {
                this.state.complete = true;
                this.state.gui.destroy();
                this.game.resetGameText();
                this.nextLevel();
            }
        } else {
            if (event.key === 'a') {
                // Left
                this.updateBallHelper(offset, power);
            } else if (event.key === 'd') {
                // Right
                this.updateBallHelper(-offset, power);
            } else if (event.key === ' ') {
                // Power
                if (!this.state.spaceBarDown) {
                    this.state.spaceBarDown = true;
                }
            }
        }
    }

    updateBallHelper(offset, power) {
        if (!this.ball.state.moving) {
            this.arrow.updateShotDirectionPower(offset, power);
            this.ball.updateShotDirectionPower(offset, power);
        }
    }

    // Callback function for keyup events
    handleKeyUpEvents(event) {
        if (this.state.complete === true) {
            return;
        }

        if (event.key === ' ') {
            // Power
            if (this.state.spaceBarDown && !this.ball.state.moving) {
                this.arrow.hide();
                this.ball.shootBall();
                this.game.updateAttempt();
                this.state.spaceBarDown = false;
            }
        }
    }

    // Handle animations
    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    animatePowerSlider(timeStamp) {
        this.state.power = 3;
        this.state.power = Math.ceil(5 * Math.sin(timeStamp / 400) + 5);
        this.updateBallHelper(0, this.state.power);
    }

    // Handle animations
    update(timeStamp) {
        if (this.state.complete === true) {
            return;
        }

        const { updateList } = this.state;

        // Animate power slider when spacebar held down
        if (this.state.spaceBarDown) {
            this.animatePowerSlider(timeStamp);
        }

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        if (this.game.checkWinCondition(this.ball, this.bucket)) {
            this.ball.mesh.visible = false;
            this.game.displayWinCondition();
        }

        // Check if ball still moving
        if (this.ball.state.moving) {
            this.arrow.hide();
        } else {
            this.arrow.updateShotDirectionPower(0, this.state.power);
        }

        this.world.step(SceneParams.TIMESTEP); // Update physics
        this.cannonDebugRenderer.update(); // Update the debug renderer
    }
}

export default MainScene;
