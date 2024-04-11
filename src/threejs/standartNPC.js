import { Vector3 } from "three";

export class StandartNPC {
  constructor({ pos = { x: 10, y: 20, z: 10 }, sketch }) {
    this.zoneRadius = 7;
    this.innitPos = pos;
    this.speed = 5;
    this.moveState = "stand";

    this.interactionRadius = 7;

    this.mode = "freeRoam";

    this.moveCooldown = 1500;
    this.moveCooldownDelta = 300;
    this.initObject(sketch, pos);
    this.updateCooldowns();
  }

  updateCooldowns() {
    this.lastMoveTime = this.currentTime();
    this.curMoveCooldown =
      Math.random() > 0.5
        ? this.moveCooldown + Math.random() * this.moveCooldownDelta
        : this.moveCooldown - Math.random() * this.moveCooldownDelta;
  }

  initObject(sketch, pos) {
    this.object = sketch.physics.add.box(
      {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        name: "NPC",
        width: 3,
        depth: 3,
        height: 3,
        mass: 1,
      },
      { phong: { color: 0x00ff00 } }
    );
    this.object.body.setAngularFactor(0, 0, 0);
  }

  update() {
    this.object.body.setAngularVelocityY(0);
    if (this.mode == "freeRoam") {
      if (this.moveState == "stand") {
        if (this.currentTime() - this.lastMoveTime > this.curMoveCooldown) {
          this.moveState = "move";
          this.destPoint = this.generateRandPoint();
          console.log(this.destPoint);
          this.moveVec = this.calcVecToPoint(this.destPoint);
        }
      } else if (this.moveState == "move") {
        this.object.body.setVelocityX(this.moveVec.x);
        this.object.body.setVelocityZ(this.moveVec.z);
        let moveX = this.destPoint.x - this.object.position.x;
        let moveZ = this.destPoint.z - this.object.position.z;
        this.rotate(this.moveVec);
        //   console.log(moveX, "-", moveZ);
        if (Math.abs(moveX) + Math.abs(moveZ) <= 3) {
          this.moveState = "stand";
          this.updateCooldowns();
        }
      }
    }
  }

  checkInteraction(playerPos = new Vector3()) {
    if (playerPos.distanceTo(this.object.position) <= this.interactionRadius) {
      this.mode = "prepToInteract";
      this.object.body.setVelocityX(0);
      this.object.body.setVelocityZ(0);
      this.rotate(playerPos.clone().sub(this.object.position));
    } else {
      if (this.mode != "freeRoam") {
        this.moveState = "stand";
      }
      this.mode = "freeRoam";
    }
  }

  rotate(moveVec = new Vector3()) {
    let origAng = (this.object.world.theta * 180) / Math.PI;

    let targAng = Math.atan(moveVec.x / moveVec.z);
    if (moveVec.z < 0) {
      targAng += Math.PI;
    }

    let rotSpeed =
      this.calcShortestRot(origAng, (targAng * 180) / Math.PI) / 10;

    this.object.body.setAngularVelocityY(rotSpeed);
  }

  generateRandPoint() {
    let x = Math.random() * this.zoneRadius;
    let z = Math.random() * Math.sqrt(this.zoneRadius ** 2 - x ** 2);

    x = Math.random() > 0.5 ? -x : x;
    z = Math.random() > 0.5 ? -z : z;
    return new Vector3(
      this.innitPos.x + x,
      this.object.position.y,
      this.innitPos.z + z
    );
  }

  calcVecToPoint(point = new Vector3()) {
    let destVec = point.clone().sub(this.object.position);
    // let calcSpeed = destVec.length();
    destVec.normalize();
    destVec.multiplyScalar(this.speed);
    // destVec.multiplyScalar(calcSpeed);
    return destVec;
  }

  currentTime() {
    let curDate = new Date();

    return curDate.getTime();
  }

  calcShortestRot(from, to) {
    if (from < 0) {
      from += 360;
    }

    if (to < 0) {
      to += 360;
    }

    if (from == to || (from == 0 && to == 360) || (from == 360 && to == 0)) {
      return 0;
    }

    let left = 360 - from + to;
    let right = from - to;

    if (from < to) {
      if (to > 0) {
        left = to - from;
        right = 360 - to + from;
      } else {
        left = 360 - to + from;
        right = to - from;
      }
    }

    // Determine the shortest direction.
    return left <= right ? left : right * -1;
  }
}
