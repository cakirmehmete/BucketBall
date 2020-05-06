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

        // var geometry = new BoxGeometry(2, 2, 20);
        // geometry.rotateZ(Math.degToRad(90));
        // var mesh = new Mesh(
        //     geometry,
        //     new MeshBasicMaterial({ color: 0x00ff00 })
        // );
        // mesh.position.set(0, 0, -10);
        // this.add(mesh);

        // let pivot = new Group();
        // this.pivot = pivot;
        // console.log(ballPos);
        // pivot.position.set(ballPos.x, ballPos.y, ballPos.z);
        // this.add(pivot);
        // pivot.add(mesh);

        // // Amount to increment arrow
        // this.inc = .1;

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

    // rotateYInc() {
    //     this.pivot.rotation.y += this.inc;
    // }

    // rotateYDec() {
    //     this.pivot.rotation.y -= this.inc;
    // }

    // rotateXInc() {
    //     this.pivot.rotation.x += this.inc;
    // }

    // rotateXDec() {
    //     this.pivot.rotation.x -= this.inc;
    // }
}

export default Arrow;
