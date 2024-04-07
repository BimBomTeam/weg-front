import { ExtendedObject3D } from "enable3d";
import { Vector3 } from "three";
import * as THREE from "three";
import PlayerParticleSystem from "./playerParticleSystem";
import { TextObject } from "./textObject";

export class Player {
  constructor({ pos = { x: 40, y: 20, z: 0 }, sketch }) {
    this.sketch = sketch;
    //Player properties
    this.objName = "player";
    this.onGround = false;
    this.particlesPermisionDuration = 0.15;
    this.jumpForce = 15;
    this.speed = 7;
    this.isWalking = false;
    this.scale = 2;
    this.deadLevel = -20;
    this.lastSafePosition = new Vector3();
    this.lastFallTime = 0;

    this.initPlayer(pos, sketch);
  }

  async initPlayer(pos, sketch) {
    await this.initPlayerObject(pos, sketch);

    sketch.camOperator.setTargetObject(this.object);
    sketch.camOperator.addEvent("lerpToAngle", {
      targetPos: this.object.position,
    });

    this.object.name = "player";
    this.playAnimation("Idle");

    //Attaching the collision sensor to player body
    this.initSensor(sketch, pos);
    this.initAutoJumpSensors(sketch, pos);

    this.textObject = new TextObject({
      textContent: "dimasikhdashdjs",
      targetObject: this.object,
    });

    const processColision = (otherObject, event) => {
      if (event !== "end" && this.object.body.velocity.y < 1) {
        this.onGround = true;
        this.particlesPermision = this.currentTime();
        if (
          this.object.position.y > this.deadLevel &&
          this.currentTime() - this.lastFallTime > 2
        ) {
          this.lastSafePosition = { ...this.object.position };
        }
      } else if (event === "end") {
        this.onGround = false;
      }
    };

    this.sensor.body.on.collision(processColision);

    this.playerParticleSystem = new PlayerParticleSystem(sketch);
  }

  async initPlayerObject(pos, sketch) {
    await sketch.load
      .gltf("/src/assets/models/player/playerRework.glb")
      .then((gltf) => {
        this.object = new ExtendedObject3D();
        // gltf.scene.children[0].geometry.center();
        gltf.scene.rotateY(Math.PI);

        //Getting the size of Player glb object
        let box = new THREE.Box3().setFromObject(gltf.scene);
        this.size = box.getSize(new THREE.Vector3());

        //Render setup
        this.object.add(gltf.scene);
        sketch.add.existing(this.object);

        this.object.position.set(pos.x, pos.y, pos.z);

        this.object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = child.receiveShadow = true;
          }
        });

        //Setting Player glb object scale
        this.object.scale.set(this.scale, this.scale, this.scale);

        //Physics enabling
        sketch.physics.add.existing(this.object, {
          shape: "box",
          mass: 1,
          width: 1,
          height: this.size.y,
          depth: 1,
          offset: {
            x: 0,
            y: (-this.size.y * this.scale) / 2 - sketch.worldMargin,
            z: 0,
          },
        });
        this.object.body.checkCollisions = true;
        this.object.body.setAngularFactor(0, 0, 0);
        this.object.body.setFriction(0.8);

        this.object.body.setCcdMotionThreshold(1);
        this.object.body.setCcdSweptSphereRadius(0.25);

        //Updating player initial position
        // this.setPosition(pos);

        //Animation setup
        sketch.animationMixers.add(this.object.anims.mixer);
        gltf.animations.forEach((animation) => {
          this.object.anims.add(animation.name, animation);
        });
      });
  }

  setPosition(newPos) {
    // set body to be kinematic
    this.object.body.setCollisionFlags(2);

    // set the new position
    this.object.position.set(newPos.x, newPos.y, newPos.z);
    this.object.body.needUpdate = true;

    // this will run only on the next update if body.needUpdate = true
    this.object.body.once.update(() => {
      // set body back to dynamic
      this.object.body.setCollisionFlags(0);

      // if you do not reset the velocity and angularVelocity, the object will keep it
      this.object.body.setVelocity(0, 0, 0);
      this.object.body.setAngularVelocity(0, 0, 0);
    });
  }

  initAutoJumpSensors(sketch, pos) {
    let downSensor = new ExtendedObject3D();
    downSensor.position.set(
      0 + pos.x,
      0 - (this.size.y * this.scale) / 2 + 0.3 + pos.y,
      0 + pos.z + 2
    );

    sketch.physics.add.existing(downSensor, {
      mass: 1e-8,
      shape: "box",
      width: this.scale - 0.5,
      height: 0.2,
      depth: this.scale - 0.5,
    });
    downSensor.body.setCollisionFlags(4);

    sketch.physics.add.constraints.lock(this.object.body, downSensor.body);

    let upSensor = new ExtendedObject3D();
    upSensor.position.set(
      0 + pos.x,
      0 - (this.size.y * this.scale) / 2 + 2 + pos.y,
      0 + pos.z + 2
    );

    sketch.physics.add.existing(upSensor, {
      mass: 1e-8,
      shape: "box",
      width: this.scale - 0.5,
      height: 0.2,
      depth: this.scale - 0.5,
    });
    upSensor.body.setCollisionFlags(4);

    sketch.physics.add.constraints.lock(this.object.body, upSensor.body);

    this.autoJump = {
      canJump: true,
      isNear: false,
    };

    downSensor.body.on.collision((otherObject, event) => {
      if (event !== "end") {
        this.autoJump.isNear = true;
      } else {
        this.autoJump.isNear = false;
      }
    });
    upSensor.body.on.collision((otherObject, event) => {
      if (event !== "end") {
        this.autoJump.canJump = false;
      } else {
        this.autoJump.canJump = true;
      }
    });
  }

  initSensor(sketch, pos) {
    this.sensor = new ExtendedObject3D();
    this.sensor.position.set(
      0 + pos.x,
      0 - (this.size.y * this.scale) / 2 + 0.1 + pos.y - 0.2,
      0 + pos.z
    );

    sketch.physics.add.existing(this.sensor, {
      mass: 1e-8,
      shape: "box",
      width: this.scale - 0.5,
      height: 0.2,
      depth: this.scale - 0.5,
    });
    this.sensor.body.setCollisionFlags(4);

    //connect sensor to player
    sketch.physics.add.constraints.lock(this.object.body, this.sensor.body);
  }

  update(KeyHandler) {
    this.isWalking = false;
    let showParticles = false;
    let accrossVel = 0;
    let straightVel = 0;


    let moveVec = new THREE.Vector3();
    if (this.object.position.y < this.deadLevel) {
      let tmpPosition = { ...this.lastSafePosition };
      tmpPosition.y += 3;
      this.setPosition(tmpPosition);
      this.lastFallTime = this.currentTime();

    if (KeyHandler.key.a.pressed) {
      this.object.body.setVelocityX(-this.speed);
      this.isWalking = true;
      accrossVel = -1;
      showParticles = true;
      moveVec.x = -1;
    } else if (KeyHandler.key.d.pressed) {
      this.object.body.setVelocityX(this.speed);
      this.isWalking = true;
      accrossVel = 1;
      showParticles = true;
      moveVec.x = 1;
    }
    if (KeyHandler.key.w.pressed) {
      this.object.body.setVelocityZ(-this.speed);
      this.isWalking = true;
      straightVel = -1;
      showParticles = true;
      moveVec.z = -1;

    } else if (KeyHandler.key.s.pressed) {
      this.object.body.setVelocityZ(this.speed);
      this.isWalking = true;
      straightVel = 1;
      showParticles = true;
      moveVec.z = 1;
    }
    if (KeyHandler.key.space.pressed && this.onGround == true) {
      this.object.body.applyForceY(this.jumpForce);
      this.onGround = false;
      //Needed to add aditional velocity in order to end event on collision sensor worked
      this.object.body.setVelocityZ(0.1);
      this.playAnimation("Jump");
    }


    if (this.currentTime() - this.particlesPermision > this.particlesPermisionDuration ) {
      showParticles = false;
    }

    this.object.body.setAngularVelocityY(0);
    moveVec = moveVec.length() == 0 ? undefined : moveVec;
    this.animateWalk(moveVec);


    this.playerParticleSystem.active = showParticles;

    this.playerParticleSystem.update(
      this.object.position,
      new Vector3(accrossVel, 0, straightVel)
    );
  }

  currentTime() {
    var currentDate = new Date();

    return currentDate.getTime() / 1000;
  }

  animateWalk(moveVec) {
    if (this.isWalking && this.onGround == true) {
      this.playAnimation("Walk");
      console.log(this.autoJump.isNear, " ", this.autoJump.canJump);
      if (this.autoJump.isNear && this.autoJump.canJump) {
        console.log("jump");
        this.object.body.applyForceY(6);
        this.onGround = false;
      }
    } else if (!this.isWalking && this.onGround == true) {
      this.playAnimation("Idle");
    }
    if (moveVec != undefined) {
      let rotateAngle = Math.atan(moveVec.x / moveVec.z);
      rotateAngle = moveVec.z < 0 ? rotateAngle + Math.PI : rotateAngle;
      let rotateSpeed =
        this.calcShortestRot(
          this.radToDeg(this.object.world.theta),
          this.radToDeg(rotateAngle)
        ) / 10;
      this.object.body.setAngularVelocityY(rotateSpeed);
    }
  }

  radToDeg(radVal) {
    return (radVal * 180) / Math.PI;
  }

  playAnimation(animName) {
    if (this.object.anims.current !== animName) {
      this.object.anims.play(animName);
    }
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

  calcShortestRotDirection(from, to) {
    // If the value is positive, return true (left).
    if (this.calcShortestRot(from, to) >= 0) {
      return true;
    }
    return false; // right
  }
}
