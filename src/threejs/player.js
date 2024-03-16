import { ExtendedObject3D } from "enable3d";
import { Vector3 } from "three";
import PlayerParticleSystem from "./playerParticleSystem";


export class Player {
  constructor({
    sizes = { width: 3, height: 3, depth: 3 },
    pos = { x: 30, y: 15, z: 0 },
    sketch,
  }) {
    this.sketch = sketch;
    //Player properties
    this.objName = "player";
    this.onGround = false;
    this.jumpForce = 15;
    this.speed = 3;
    this.isWalking = false;
    this.deadLevel = 2.5;
    this.lastSafePosition = new Vector3();
    this.sizes = sizes;
    this.secsorVerticalOffset = - 1.5 + 0.09;
    this.lastFallTime = 0;

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

    //sketch.physics.destroy(this.object);
    
    this.initSensor(sketch);

    const processColision = (otherObject, event) => {
      if (event !== "end") {
        this.onGround = true;
        if (this.object.position.y > this.deadLevel && this.currentTime() - this.lastFallTime > 5) {
            this.lastSafePosition = { ...this.object.position };
        } else if (!(this.object.position.y > this.deadLevel && this.currentTime())) {
          this.setPosition(this.lastSafePosition)
          this.lastFallTime = this.currentTime();
        }
      } else {
          this.onGround = false;
      }
    };

    this.sensor.body.on.collision(processColision);

    //Player ParticleSystem
    this.playerParticleSystem = new PlayerParticleSystem(sketch)
  }

  setPosition(newPos) {
    // set body to be kinematic
    this.object.body.setCollisionFlags(2)
    

    // set the new position
    this.object.position.set(newPos.x, newPos.y, newPos.z)
    this.object.body.needUpdate = true

    // this will run only on the next update if body.needUpdate = true
    this.object.body.once.update(() => {
      // set body back to dynamic
      this.object.body.setCollisionFlags(0)

      // if you do not reset the velocity and angularVelocity, the object will keep it
      this.object.body.setVelocity(0, 0, 0)
      this.object.body.setAngularVelocity(0, 0, 0)
    })
  }

  initSensor(sketch) {
    this.sensor = new ExtendedObject3D();
    this.sensor.position.set(this.object.position.x, this.object.position.y + this.secsorVerticalOffset, this.object.position.z);
    sketch.physics.add.existing(this.sensor, {
      mass: 1e-8,
      shape: "box",
      width: 0.2,
      height: 0.2,
      depth: 0.2,
    });
    this.sensor.body.setCollisionFlags(4);

    //connect sensor to player
    sketch.physics.add.constraints.lock(this.object.body, this.sensor.body);
  }

  update(KeyHandler) {
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

  currentTime() {
    var currentDate = new Date();

    return Math.floor(currentDate.getTime() / 1000);
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
