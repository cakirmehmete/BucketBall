import { Vector3 } from 'three';
import { Vec3 } from 'cannon';
import SceneParams from '../../params';

/*
    Adapted From: https://github.com/jcole/golf-shot-simulation
*/
export function calculateInitialSpin(rpm, angle) {
    const spin = new Vector3(0, 0, 0);
    spin.x = -1;
    spin.y = Math.sin((angle * Math.PI) / 180);
    spin.normalize().multiplyScalar((rpm * 2 * Math.PI) / 60);
    return spin;
}

/*
    Adapted From: https://github.com/jcole/golf-shot-simulation
*/
export function calculateInitialVelocity(
    speed,
    smashFactor,
    verticalDeg,
    horizontalDeg
) {
    const velocity = new Vector3(0, 0, 0);
    velocity.x = Math.sin((-1 * horizontalDeg * Math.PI) / 180);
    velocity.y = Math.sin((verticalDeg * Math.PI) / 180);
    velocity.z = Math.cos((verticalDeg * Math.PI) / 180);

    const ballSpeed = speed * smashFactor * 0.44704;

    return velocity.normalize().multiplyScalar(ballSpeed);
}

/*
    Adapted From: https://github.com/jcole/golf-shot-simulation
*/
function calculateAcceleration(velocity, angVelocity) {
    // Gravity
    let gravity = new Vector3(0, -SceneParams.GRAVITY, 0);

    // Drag Force
    let dragCoeff = SceneParams.DRAG * Math.min(1.0, 14 / velocity.length());
    const drag = velocity
        .clone()
        .multiplyScalar(
            (-1 * dragCoeff * SceneParams.AIRDENSITY * SceneParams.AREA) /
                SceneParams.MASS
        );

    // Magnus Force
    const magnus = angVelocity
        .clone()
        .cross(velocity)
        .multiplyScalar(SceneParams.LIFT / SceneParams.MASS);

    // Final Acceleration
    const acceleration = new Vector3(0, 0, 0)
        .add(gravity)
        .add(drag)
        .add(magnus);

    return acceleration;
}

/*
    Adapted From: https://github.com/jcole/golf-shot-simulation
*/
function calculateAngularDecay(angVelocity) {
    const decay = angVelocity.clone();
    decay
        .normalize()
        .negate()
        .multiplyScalar(SceneParams.SPINDECAY * SceneParams.TIMESTEP);
    return decay;
}

/*
    Adapted From: https://github.com/jcole/golf-shot-simulation
*/
export function projectShot(velocity, angVelocity, position, projPos) {
    // Use Euler integration to simulate projectile motion
    // Acceleration
    const acceleration = calculateAcceleration(velocity, angVelocity);

    // Velocity
    velocity.add(acceleration.clone().multiplyScalar(SceneParams.TIMESTEP));
    let pos = velocity.clone().multiplyScalar(SceneParams.TIMESTEP);
    position.set(pos.x, pos.y, pos.z);
    //position.add(velocity.clone().multiplyScalar(SceneParams.TIMESTEP));
    projPos.push(position.clone());

    // Spin
    const decay = calculateAngularDecay(angVelocity);
    angVelocity.add(decay);
}
