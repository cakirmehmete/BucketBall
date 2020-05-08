import {
    Group,
    SphereGeometry,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    Math,
} from 'three';
import { Ball } from 'objects';

class Arrow extends Group {
    constructor(parent, ballPos) {
        super();

        // Initialize state
        this.state = {};

        let ball = new Ball(parent);
        this.ball = ball;

        this.allPoints = [];
    }

    cleanUp() {
        for (var i = 0; i < this.allPoints.length; i++) {
            this.remove(this.allPoints[i]);
        }
        this.allPoints = [];
    }

    updateShotDirectionPower(ballPos, changeX, changeY, power) {
        this.ball.position.set(ballPos.x, ballPos.y, ballPos.z);
        this.ball.updateShotDirectionPower(changeX, changeY, power);
        this.ball.calculateTrajectory();

        for (var i = 0; i < this.allPoints.length; i++) {
            this.remove(this.allPoints[i]);
        }
        this.allPoints = [];

        let points = this.ball.state.projPos;
        for (var i = 0; i < points.length; i++) {
            let pointGeo = new SphereGeometry(0.5);
            var point = new Mesh(pointGeo);
            if (points[i].y <= 1.5) {
                break;
            }
            point.position.set(points[i].x, points[i].y, points[i].z);
            this.allPoints.push(point);
            this.add(point);
        }
    }
}

export default Arrow;
