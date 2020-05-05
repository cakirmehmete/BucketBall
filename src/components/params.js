/*
Adapted from Assignment 5
*/
class Params {
    constructor() {
        // ====================================================================
        //                     Physical Constants
        // ====================================================================
        // Golf ball properties
        this.MASS = 0.1;
        this.AREA = Math.PI;
        this.SMASH = 1.49;

        // Nature
        this.GRAVITY = 9.8;
        this.AIRDENSITY = 1.204;

        // Golf ball aerodynamics
        this.DRAG = 0.4;
        this.LIFT = 0.00002;
        this.SPINDECAY = 21;

        // The timestep
        this.TIMESTEP = 0.001;

        // ====================================================================
        //            Properties of forces and interactions
        // ====================================================================
        this.wind = false; // Should the wind force be enabled?
        this.windStrength = 30; // scalar multiplier for wind force magnitude

        this.rain = false; // Should the rain impulse be enabled?
        this.rainStrength = 6; // scalar multiplier for rain impulse magnitude
        this.rainRate = 5; // Number of droplets per fixed area per time step.

        // Similar to coefficient of friction
        // 0 = frictionless, 1 = cloth sticks in place
        this.friction = 0.9;

        // ====================================================================
        //             Physical properties of scene objects
        // ====================================================================
        // Properties of sphere and ground
        this.groundY = -249;
        this.sphereRadius = 125;
    }
}

var SceneParams = new Params();
export default SceneParams;