import { Vector3 } from 'three';
import SceneParams from '../../params';

/*
    Adapted From: https://github.com/jcole/golf-shot-simulation
*/
export function calculateAcceleration(velocity, angVelocity) {
    // Gravity
    let gravity = new Vector3(0, -SceneParams.GRAVITY, 0);

    // Drag Force
    let dragCoeff = SceneParams.DRAG * Math.min(1.0, 14 / velocity.length());
    var drag = velocity
        .clone()
        .multiplyScalar(
            (-1 * dragCoeff * SceneParams.AIRDENSITY * SceneParams.AREA) /
                SceneParams.MASS
        );

    // Magnus Force
    var magnus = angVelocity
        .clone()
        .cross(velocity)
        .multiplyScalar(SceneParams.LIFT / SceneParams.MASS);

    // Final Acceleration
    var acceleration = new Vector3(0, 0, 0).add(gravity).add(drag).add(magnus);

    return acceleration;
}

/*
    Adapted From: https://github.com/jcole/golf-shot-simulation
*/
export function calculateAngularDecay(angVelocity) {
    var decay = angVelocity.clone();
    decay
        .normalize()
        .negate()
        .multiplyScalar(SceneParams.SPINDECAY * SceneParams.TIMESTEP);
    return decay;
}
