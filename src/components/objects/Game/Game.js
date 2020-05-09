class Game {
    constructor() {
        this.state = {
            attempts: 0,
        };
        document.getElementById("counterDisplay").innerHTML= "Attempts: " + this.state.attempts;
    }

    updateAttempt() {
        this.state.attempts += 1;
        document.getElementById("counterDisplay").innerHTML= "Attempts: " + this.state.attempts;
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
            document.getElementById("counterDisplay").innerHTML= "Win!";
            return true;
        }
        return false;
    }
}

export default Game;
