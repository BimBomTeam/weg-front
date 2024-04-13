import { Vector3 } from "three";
import { StandartNPC } from "./standartNPC";
import { element } from "three/examples/jsm/nodes/Nodes.js";

export class BossNPC extends StandartNPC {
  constructor({ pos = { x: 10, y: 20, z: 10 }, sketch }) {
    super({ pos: pos, sketch: sketch });
    this.actionEvents = [];
    this.addEvents = [];
    this.standPos = null;
    this.onGround = true;
    this.playerPos;
    this.initColission();
  }

  initColission() {
    this.object.body.on.collision((otherObject, event) => {
      if (otherObject.name == "floo") {
        if (event !== "end" && this.object.body.velocity.y < 1) {
          this.onGround = true;
          console.log(event);
        } else if (event === "end") {
          this.onGround = false;
        }
      }
    });
  }

  hitPlayer(playerPos = new Vector3()) {
    this.playerPos = playerPos;
    let directVec = playerPos
      .clone()
      .sub(this.object.position)
      .normalize()
      .multiplyScalar(30);
    let DoJump = (params) => {
      return this.jumpAtack(params.direction);
    };
    this.actionEvents.push({
      func: (params) => {
        return DoJump(params);
      },
      params: { direction: directVec },
    });
  }

  updateBattle() {
    console.log(this.actionEvents);
    this.actionEvents = this.actionEvents.filter(
      (element) => !element.func(element.params)
    );
    this.addEvents.forEach((element) => {
      this.actionEvents.push(element);
    });
    this.addEvents = [];
  }

  jumpAtack(direction = new Vector3(10, 4, 8)) {
    if (this.onGround) {
      this.object.body.applyForceY(7);
      this.object.body.setVelocityZ(direction.z);
      this.object.body.setVelocityX(direction.x);
      this.onGround = false;
    }
    if (
      Math.abs(this.object.body.velocity.x) +
        Math.abs(this.object.body.velocity.z) <=
      1
    ) {
      console.log("shit");
      this.onGround = true;
      this.addEvents.push({
        func: (params) => {
          return this.returnToStandPos();
        },
        params: {},
      });
      return true;
    }
  }

  returnToStandPos() {
    let directVec = this.standPos
      .clone()
      .sub(this.object.position)
      .normalize()
      .multiplyScalar(this.speed);
    this.object.body.setVelocityX(directVec.x);
    this.object.body.setVelocityZ(directVec.z);
    let moveX = this.standPos.x - this.object.position.x;
    let moveZ = this.standPos.z - this.object.position.z;
    if (Math.abs(moveX) + Math.abs(moveZ) <= 3) {
      console.log("SHIT2");
      setTimeout(() => {
        this.hitPlayer(this.playerPos);
      }, 1000);
      return true;
    }
  }
}
