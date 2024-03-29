import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import { Ball, Terrain, Cloud, Bucket, Crate } from 'objects';
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
} from 'cannon';
import Arrow from '../objects/Arrow/Arrow';
import SceneParams from '../params';
import { Skyscraper } from '../objects/Skyscraper';
import { SkyscraperTree } from '../objects/SkyscraperTree';
import { Car } from '../objects/Car';
import { Truck } from '../objects/Truck';
import Lamp from '../objects/Lamp/Lamp';
import Wheelbarrow from '../objects/Wheelbarrow/Wheelbarrow';

class ThirdScene extends Scene {
    constructor(nextLevel, camera) {
        super();

        // Define constant values
        const TERRAINWIDTH = 300.0;
        const TERRAINHEIGHT = 100.0;

        // Initialize state and scene properties
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [], // Maintains all meshes to be updated

            // Direction/Power for golf ball
            spaceBarDown: false,
            power: 3,
            complete: false,
            offset: -1,
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
        this.add(lights);

        // Initialize different objects and place them accordingly in the scene
        this.setupTerrain(TERRAINWIDTH, TERRAINHEIGHT);
        this.setupClouds();
        this.setupBall();
        this.setupBucket();
        this.setupArrow();
        //this.setupCrates();
        this.setupSkyscraper();
        this.setupSkyscraperTree();
        this.setupCar();
        this.setupTruck();
        this.setupWheelbarrow();
        //this.setupLamps();

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

    setupWheelbarrow() {
        const obj = new Wheelbarrow(this);
        obj.position.set(90, 6, 20);
        this.add(obj);

        const shape = new Box(new Vec3(2, 5, 4));
        const body = new Body({ mass: 0, shape: shape });
        body.position.set(obj.position.x + 2, 2, obj.position.z + 2);
        var axis = new Vec3(0, 1, 0);
        var angle = Math.PI / 4;
        body.quaternion.setFromAxisAngle(axis, angle);
        this.world.addBody(body);
    }

    setupLamps() {
        const obj = new Lamp(this);
        obj.position.set(90, 1, 30);
        this.add(obj);
    }

    setupTruck() {
        const obj = new Truck(this);
        obj.position.set(70, 1, -15);
        this.add(obj);

        const shape = new Box(new Vec3(21, 5, 15));
        const body = new Body({ mass: 0, shape: shape });
        body.position.set(obj.position.x, 2, obj.position.z);
        var axis = new Vec3(0, 1, 0);
        var angle = Math.PI / 4;
        body.quaternion.setFromAxisAngle(axis, angle);
        this.world.addBody(body);
    }

    setupCar() {
        const obj = new Car(this);
        obj.position.set(-9, -26, -15);
        this.add(obj);
        this.car = obj;

        const shape = new Box(new Vec3(8, 5, 15));
        const body = new Body({ mass: 0, shape: shape });
        body.position.set(obj.position.x + 20, 2, obj.position.z + 23);
        this.world.addBody(body);
        this.car.body = body;
    }

    setupSkyscraper() {
        const obj = new Skyscraper(this);
        obj.position.set(-100, -1, -6);
        this.add(obj);

        const shape = new Box(new Vec3(12, 5, 14));
        const body = new Body({ mass: 0, shape: shape });
        body.position.set(obj.position.x + 8.5, 2, obj.position.z + 34);
        this.world.addBody(body);

        const shape1 = new Box(new Vec3(12, 5, 12));
        const body1 = new Body({ mass: 0, shape: shape1 });
        body1.position.set(obj.position.x + 8.5, 2, obj.position.z + 4);
        this.world.addBody(body1);

        const shape2 = new Box(new Vec3(12, 5, 12));
        const body2 = new Body({ mass: 0, shape: shape2 });
        body2.position.set(obj.position.x + 6.5, 2, obj.position.z - 23);
        this.world.addBody(body2);
    }

    setupSkyscraperTree() {
        const obj = new SkyscraperTree(this);
        obj.position.set(0, -78, -6);
        this.add(obj);

        const shape = new Box(new Vec3(12, 5, 11.5));
        const body = new Body({ mass: 0, shape: shape });
        body.position.set(obj.position.x + 8.5, 2, obj.position.z - 20);
        this.world.addBody(body);
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
        const edgeOffset = 10.0;
        const startingPositionX = -this.terrain.terrainWidth / 2.0 + edgeOffset;
        const startingPositionZ = 0;
        this.ball = new Ball(this, startingPositionX, startingPositionZ);
        this.add(this.ball);

        // Hacky way to push the ball up
        this.ball.position.set(0, this.ball.radius, 0);
    }

    // Add bucket/hole to the environment
    setupBucket() {
        const EPS = 1.0;
        const edgeOffset = 10.0;
        const bucket = new Bucket();
        bucket.position.set(
            this.terrain.terrainWidth / 2.0 - edgeOffset,
            this.terrain.terrainDepth + EPS,
            0
        );
        this.add(bucket);
        this.bucket = bucket;
    }

    // Add pseudo-randomized clouds to the environment
    setupClouds() {
        const cloudHeight = this.terrain.terrainDepth + 100.0;
        const initialXPos = -200;
        let zPos = 0.0;
        const zPosOffset = 100;

        const cloudOne = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudOne.position.set(initialXPos + 50, cloudHeight, zPos);
        this.add(cloudOne);

        const cloudTwo = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudTwo.position.set(initialXPos + 125, cloudHeight - 25.0, zPos);
        this.add(cloudTwo);

        const cloudThree = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudThree.position.set(initialXPos + 150, cloudHeight, zPos);
        this.add(cloudThree);

        const cloudFour = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudFour.position.set(initialXPos + 225, cloudHeight - 15.0, zPos);
        this.add(cloudFour);

        const cloudFive = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudFive.position.set(initialXPos + 265, cloudHeight, zPos);
        this.add(cloudFive);

        const cloudSix = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudSix.position.set(initialXPos + 300, cloudHeight - 20.0, zPos);
        this.add(cloudSix);

        const cloudSeven = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudSeven.position.set(initialXPos + 370, cloudHeight, zPos);
        this.add(cloudSeven);

        const cloudEight = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudEight.position.set(initialXPos + 420, cloudHeight - 10.0, zPos);
        this.add(cloudEight);

        const cloudNine = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudNine.position.set(initialXPos + 460, cloudHeight, zPos);
        this.add(cloudNine);

        const cloudTen = new Cloud(this);
        zPos = Math.random() * zPosOffset - zPosOffset / 2;
        cloudTen.position.set(initialXPos + 500, cloudHeight, zPos);
        this.add(cloudTen);
    }

    // Add projectile arrow graphic to the ball
    setupArrow() {
        const arrow = new Arrow(this, this.ball.mesh.position);
        this.add(arrow);
        this.arrow = arrow;
    }

    // Add randomized crates to the environment
    setupCrates() {
        const crateSize = 5.0;
        const EPS = 1.0;
        const crates = [];
        for (let i = 1; i < 5; i++) {
            const crate = new Crate(crateSize);
            const xPosition = -(this.terrain.terrainWidth / 2) + 50.0;
            const yPosition = crateSize / 2.0;
            const zPosition =
                this.terrain.terrainHeight / 2 + EPS - i * crateSize;

            crate.position.set(xPosition, yPosition, zPosition);
            this.add(crate);
            crates.push(crate);
        }

        for (let i = 1; i < 15; i++) {
            const crate = new Crate(crateSize);
            const xPosition = -(this.terrain.terrainWidth / 2) + 50.0;
            const yPosition = crateSize / 2.0;
            const zPosition =
                i * crateSize - this.terrain.terrainHeight / 2 - EPS;

            crate.position.set(xPosition, yPosition, zPosition);
            this.add(crate);
            crates.push(crate);
        }

        for (let i = 1; i < 16; i++) {
            const crate = new Crate(crateSize);
            const xPosition = -(this.terrain.terrainWidth / 2) + 100.0;
            const yPosition = crateSize / 2.0;
            const zPosition =
                this.terrain.terrainHeight / 2 + EPS - i * crateSize;

            crate.position.set(xPosition, yPosition, zPosition);
            this.add(crate);
            crates.push(crate);
        }

        for (let i = 1; i < 15; i++) {
            const crate = new Crate(crateSize);
            const xPosition = -(this.terrain.terrainWidth / 2) + 150.0;
            const yPosition = crateSize / 2.0;
            const zPosition =
                this.terrain.terrainHeight / 2 + EPS - i * crateSize;

            crate.position.set(xPosition, yPosition, zPosition);
            this.add(crate);
            crates.push(crate);
        }

        for (let i = 1; i < 5; i++) {
            const crate = new Crate(crateSize);
            const xPosition = -(this.terrain.terrainWidth / 2) + 150.0;
            const yPosition = crateSize / 2.0;
            const zPosition =
                i * crateSize - this.terrain.terrainHeight / 2 - EPS;

            crate.position.set(xPosition, yPosition, zPosition);
            this.add(crate);
            crates.push(crate);
        }

        for (let i = 1; i < 16; i++) {
            const crate = new Crate(crateSize);
            const xPosition = -(this.terrain.terrainWidth / 2) + 200.0;
            const yPosition = crateSize / 2.0;
            const zPosition =
                i * crateSize - this.terrain.terrainHeight / 2 + EPS;

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
        const offset = 0.1;
        const power = this.state.power;
        if (this.state.complete === true) {
            return;
        }

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
            this.arrow.mesh.visible = false;
            this.game.displayWinCondition();
        }

        // Check if ball still moving
        if (this.ball.state.moving) {
            this.arrow.hide();
        } else {
            this.arrow.updateShotDirectionPower(0, this.state.power);
        }

        if (this.car) {
            this.updateTractor();
        }

        this.world.step(SceneParams.TIMESTEP); // Update physics
        this.cannonDebugRenderer.update(); // Update the debug renderer
    }

    updateTractor() {
        if (this.car.position.z >= 13) {
            this.state.offset = -1;
        } else if (this.car.position.z <= -23) {
            this.state.offset = 1;
        }
        this.car.position.z += this.state.offset;
        this.car.body.position.z += this.state.offset;
    }
}

export default ThirdScene;
