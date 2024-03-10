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
    this.jumpForce = 15;
    this.speed = 3;
    this.isWalking = false;

    //Initializing Player in physics world
    this.object = sketch.physics.add.box(
      {
        ...pos,
        ...sizes,
        name: this.objName,
        mass: 1,
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
    this.playerParticleSystem = new PlayerParticleSystem(sketch)
  }

  initSensor(sketch) {
    this.sensor = new ExtendedObject3D();
    this.sensor.position.setY(this.object.position.y - 1.5 + 0.09);
    sketch.physics.add.existing(this.sensor, {
      mass: 1e-8,
      shape: "box",
      width: 0.2,
      height: 0.2,
      depth: 0.2,
    });
    this.sensor.body.setCollisionFlags(4);

    // connect sensor to player
    sketch.physics.add.constraints.lock(this.object.body, this.sensor.body);
  }

  update(KeyHandler) {
    this.sensor.body.on.collision((otherObject, event) => {
      if (event !== "end") this.onGround = true;
      else this.onGround = false;
    });

    let showParticles = false
    let accrossVel = 0;
    let straightVel = 0;

    if (KeyHandler.key.a.pressed) {
      this.object.body.setVelocityX(-this.speed);
      this.isWalking = true;
      accrossVel = -1;
      showParticles = true
    } else if (KeyHandler.key.d.pressed) {
      this.object.body.setVelocityX(this.speed);
      this.isWalking = true;
      accrossVel = 1;
      showParticles = true
    }
    if (KeyHandler.key.w.pressed) {
      this.object.body.setVelocityZ(-this.speed);
      this.isWalking = true;
      straightVel = -1;
      showParticles = true
    } else if (KeyHandler.key.s.pressed) {
      this.object.body.setVelocityZ(this.speed);
      this.isWalking = true;
      straightVel = 1;
      showParticles = true
    }
    if (
      KeyHandler.key.space.pressed &&
      this.onGround == true &&
      Math.abs(this.object.body.velocity.y) < 1e-1
    ) {
      this.object.body.applyForceY(this.jumpForce);
      this.onGround = false;
    }

    this.animateWalk();
    
    if (!this.onGround) {
      showParticles = false;
    }
    this.playerParticleSystem.active = showParticles;
    this.playerParticleSystem.update( this.object.position , new Vector3(accrossVel, 0, straightVel))
  }

  animateWalk() {
    if (this.isWalking) {
      if (this.onGround == true) {
        this.object.body.applyForceY(2);
        this.onGround = false;
        this.isWalking = false;
      }
    }
  }
}
