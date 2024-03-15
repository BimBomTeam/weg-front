import { ExtendedObject3D } from "enable3d";
import { Vector3 } from "three";
import PlayerParticleSystem from "./playerParticleSystem";

export class Player {
  constructor({
    sizes = { width: 3, height: 3, depth: 3 },
    pos = { x: 0, y: 5, z: 0 },
    sketch,
  }) {
    //Player properties
    this.objName = "player";
    this.onGround = false;
    this.jumpForce = 12;
    this.speed = 3;
    this.isWalking = false;

    //Initializing Player in physics world
    this.object = sketch.physics.add.box(
      {
        ...pos,
        ...sizes,
        name: this.objName,
        // mass: 1,
        offset: { y: -0.2, x: 0.2, z: -0.2 },
      },
      {
        phong: { color: 0x0000ff },
      }
    );
    this.object.body.setAngularFactor(0, 0, 0);
    this.object.body.setFriction(0.5);

    this.initSensor(sketch);
    //Player ParticleSystem
    this.playerParticleSystem = new PlayerParticleSystem(sketch);
  }

  initSensor(sketch) {
    // console.log(this.object.geometry);
    this.sensor = new ExtendedObject3D();
    this.sensor.position.setY(this.object.position.y - 1.5 + 0.1);
    sketch.physics.add.existing(this.sensor, {
      mass: 1e-8,
      shape: "box",
      width: 3 - 0.5,
      height: 0.2,
      depth: 3 - 0.5,
    });
    this.sensor.body.setCollisionFlags(4);

    // connect sensor to player
    sketch.physics.add.constraints.lock(this.object.body, this.sensor.body);
  }

  update(KeyHandler) {
    this.sensor.body.on.collision((otherObject, event) => {
      if (otherObject.name == "floor") {
        if (event !== "end" && this.object.body.velocity.y < 1)
          this.onGround = true;
        else {
          this.onGround = false;
        }
      }
    });
    // console.log(this.onGround);
    this.isWalking = false;

    let showParticles = true;
    let accrossVel = 0;
    let straightVel = 0;
    if (!this.onGround) {
      showParticles = false;
    }

    if (KeyHandler.key.a.pressed) {
      this.object.body.setVelocityX(-this.speed);
      this.isWalking = true;
      accrossVel = -1;
      // showParticles = true;
    } else if (KeyHandler.key.d.pressed) {
      this.object.body.setVelocityX(this.speed);
      this.isWalking = true;
      accrossVel = 1;
      // showParticles = true;
    }
    if (KeyHandler.key.w.pressed) {
      this.object.body.setVelocityZ(-this.speed);
      this.isWalking = true;
      straightVel = -1;
      // showParticles = true;
    } else if (KeyHandler.key.s.pressed) {
      this.object.body.setVelocityZ(this.speed);
      this.isWalking = true;
      straightVel = 1;
      // showParticles = true;
    }
    if (KeyHandler.key.space.pressed && this.onGround == true) {
      this.object.body.applyForceY(this.jumpForce);
      this.onGround = false;
    }

    this.animateWalk();

    this.playerParticleSystem.active = showParticles;
    this.playerParticleSystem.update(
      this.object.position,
      new Vector3(accrossVel, 0, straightVel)
    );
  }

  animateWalk() {
    if (this.isWalking && this.onGround == true) {
      this.object.body.applyForceY(4);
      this.onGround = false;
      // this.isWalking = false;
    }
  }
}
