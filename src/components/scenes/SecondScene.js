import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, CameraHelper } from 'three';
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
import Windmill from '../objects/Windmill/Windmill';
import { Tractor } from '../objects';
import { Hen } from '../objects/Hen';
import { Scarecrow } from '../objects/Scarecrow';

class SecondScene extends Scene {
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
            offset: 1,
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
        this.setupTerrain(102, 240);
        this.setupClouds();
        this.setupBall();
        this.setupBucket();
        this.setupArrow();
        this.setupWindmill();
        this.setupTractor();
        this.setupHen();
        this.setupScarecrow();
        this.setupCrates();

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

    setupScarecrow() {
        const scareCrow = new Scarecrow(this);
        scareCrow.position.set(0, 0, -80);
        this.add(scareCrow);

        const mass = 0;
        const shape = new Box(new Vec3(2, 5, 2));
        const body = new Body({ mass: mass, shape: shape });
        body.position.set(scareCrow.position.x, 2, scareCrow.position.z);
        this.world.addBody(body);
    }

    setupHen() {
        const hen = new Hen(this);
        hen.position.set(0, 27, -20);
        this.add(hen);

        const mass = 0;
        const shape = new Box(new Vec3(2, 5, 2));
        const body = new Body({ mass: mass, shape: shape });
        body.position.set(hen.position.x - 7, 2, hen.position.z);
        this.world.addBody(body);

        const body1 = new Body({ mass: mass, shape: shape });
        body1.position.set(hen.position.x + 7, 2, hen.position.z);
        this.world.addBody(body1);
    }

    setupTractor() {
        const tractor = new Tractor(this);
        tractor.position.set(-20, 0, 20);
        tractor.rotation.y = Math.PI / 2;
        this.add(tractor);
        this.tractor = tractor;

        const mass = 0;
        const shape = new Box(new Vec3(15, 10, 10));
        const body = new Body({ mass: mass, shape: shape });
        body.position.set(
            tractor.position.x,
            tractor.position.y + 10,
            tractor.position.z
        );
        this.tractor.body = body;
        this.world.addBody(body);
    }

    setupWindmill() {
        const windmill = new Windmill(this);
        windmill.position.set(-10, 0, 100);
        this.add(windmill);

        const mass = 0;
        const shape = new Box(new Vec3(10, 10, 10));
        const body = new Body({ mass: mass, shape: shape });
        body.position.set(0, 10, 75);
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
        const startingPositionX =
            this.terrain.terrainWidth / 2.0 - edgeOffset - 40;
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

    // Add pseudo-randomized clouds to the environment
    setupClouds() {
        const cloudHeight = this.terrain.terrainDepth + 100.0;
        const initialXPos = -250.0;
        const zPos = -200.0;

        const cloudOne = new Cloud(this);
        cloudOne.position.set(initialXPos + 50, cloudHeight, zPos);
        this.add(cloudOne);

        const cloudTwo = new Cloud(this);
        cloudTwo.position.set(initialXPos + 125, cloudHeight - 25.0, zPos);
        this.add(cloudTwo);

        const cloudThree = new Cloud(this);
        cloudThree.position.set(initialXPos + 150, cloudHeight, zPos);
        this.add(cloudThree);

        const cloudFour = new Cloud(this);
        cloudFour.position.set(initialXPos + 225, cloudHeight - 15.0, zPos);
        this.add(cloudFour);

        const cloudFive = new Cloud(this);
        cloudFive.position.set(initialXPos + 265, cloudHeight, zPos);
        this.add(cloudFive);

        const cloudSix = new Cloud(this);
        cloudSix.position.set(initialXPos + 300, cloudHeight - 20.0, zPos);
        this.add(cloudSix);

        const cloudSeven = new Cloud(this);
        cloudSeven.position.set(initialXPos + 370, cloudHeight, zPos);
        this.add(cloudSeven);

        const cloudEight = new Cloud(this);
        cloudEight.position.set(initialXPos + 420, cloudHeight - 10.0, zPos);
        this.add(cloudEight);

        const cloudNine = new Cloud(this);
        cloudNine.position.set(initialXPos + 460, cloudHeight, zPos);
        this.add(cloudNine);

        const cloudTen = new Cloud(this);
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
        const crateSize = 10.0;
        const EPS = 4.0;
        const crates = [];

        for (let i = 1; i < 11; i++) {
            if (i === 5 || i === 6) {
                continue;
            }
            const crate = new Crate(crateSize);
            const xPosition =
                i * crateSize - (this.terrain.terrainWidth / 2 + EPS);
            const yPosition = crateSize / 2.0;
            const zPosition = -20;

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

        // Update tractor
        this.updateTractor();

        this.world.step(SceneParams.TIMESTEP); // Update physics
        this.cannonDebugRenderer.update(); // Update the debug renderer
    }

    updateTractor() {
        if (this.tractor.position.x >= 35) {
            this.state.offset = -1;
        } else if (this.tractor.position.x <= -35) {
            this.state.offset = 1;
        }
        this.tractor.position.x += this.state.offset;
        this.tractor.body.position.x += this.state.offset;
    }
}

export default SecondScene;
