class Game {
    constructor() {
        this.state = {
            attempts: 0,
        };
    }

    updateAttempt() {
        this.state.attempts += 1;
    }

    // Determine win condition by checking ball's distance from bucket
    checkWinCondition(ball, bucket) {
        const ballPosition = ball.mesh.position;
        const bucketPosition = bucket.position;
        const bucketRadius = bucket.radius;
        const ballPositionX = ballPosition.x;
        const ballPositionZ = ballPosition.z;
        const bucketPositionX = bucketPosition.x;
        const bucketPositionZ = bucketPosition.z;

        const xDiff = bucketPositionX - ballPositionX;
        const zDiff = bucketPositionZ - ballPositionZ;
        const distance = Math.sqrt(xDiff * xDiff + zDiff * zDiff);

        if (distance < bucketRadius) {
            return true;
        }
        return false;
    }
}

export default Game;
