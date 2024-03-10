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
    this.onGround = true;
    this.jumpForce = 8;
    this.speed = 6;

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
    this.object.body.setFriction(2);

    //Player ParticleSystem
    this.playerParticleSystem = new PlayerParticleSystem(sketch)
  }

  update(KeyHandler) {
    this.object.body.on.collision((otherObject, event) => {
      this.onGround = true;
    });

    let showParticles = false
    let accrossVel = 0;
    let straightVel = 0;

    if (KeyHandler.key.a.pressed) {
      this.object.body.setVelocityX(-this.speed);
      accrossVel = -1;
      showParticles = true
    } else if (KeyHandler.key.d.pressed) {
      this.object.body.setVelocityX(this.speed);
      accrossVel = 1;
      showParticles = true
    }
    if (KeyHandler.key.w.pressed) {
      this.object.body.setVelocityZ(-this.speed);
      straightVel = -1;
      showParticles = true
    } else if (KeyHandler.key.s.pressed) {
      this.object.body.setVelocityZ(this.speed);
      straightVel = 1;
      showParticles = true
    }

    if (!this.onGround) {
      showParticles = false;
    }

    this.playerParticleSystem.active = showParticles;

    if (KeyHandler.key.space.pressed && this.onGround == true) {
      this.object.body.applyForceY(this.jumpForce);
      this.onGround = false;
    }
    this.playerParticleSystem.update( this.object.position , new Vector3(accrossVel, 0, straightVel))
  }
}
