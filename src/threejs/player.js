import { ExtendedObject3D } from "enable3d";
import { Vector3 } from "three";
import * as THREE from "three";
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
    this.speed = 7;
    this.isWalking = false;
    this.scale = 3;
    this.deadLevel = 2.5;
    this.lastSafePosition = new Vector3();
    this.lastFallTime = 0;

    this.initPlayer(pos, sketch);
  }

  async initPlayer(pos, sketch) {
    await this.initPlayerObject(pos, sketch);
    this.object.name = "player";

    //Attaching the collision sensor to player body
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

    this.playerParticleSystem = new PlayerParticleSystem(sketch);
  }

  async initPlayerObject(pos, sketch) {
    await sketch.load
      .gltf("/src/assets/models/player/player7.glb")
      .then((gltf) => {
        this.object = new ExtendedObject3D();
        // gltf.scene.children[0].geometry.center();

        //Getting the size of Player glb object
        let box = new THREE.Box3().setFromObject(gltf.scene);
        this.size = box.getSize(new THREE.Vector3());

        //Render setup
        this.object.add(gltf.scene);
        sketch.add.existing(this.object);
        this.object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = child.receiveShadow = true;
          }
        });

        //Setting Player glb object scale
        this.object.scale.set(this.scale, this.scale, this.scale);

        //Updating the initial Player position
        //!!!Not Working Now!!!
        //Needed to be replaced by Teleport method
        this.object.position.setX(pos.x);
        this.object.position.setY(pos.y);
        this.object.position.setY(pos.z);

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
        this.object.body.setFriction(0.5);

        //Animation setup
        sketch.animationMixers.add(this.object.anims.mixer);
        gltf.animations.forEach((animation) => {
          this.object.anims.add(animation.name, animation);
        });
      });
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
    this.sensor.position.set(this.object.position.x, this.object.position.y - (this.size.y * this.scale) / 2 + 0.1, this.object.position.z);
    
    sketch.physics.add.existing(this.sensor, {
      mass: 1e-8,
      shape: "box",
      width: 3 - 0.5,
      height: 0.2,
      depth: 3 - 0.5,
    });
    this.sensor.body.setCollisionFlags(4);

    //connect sensor to player
    sketch.physics.add.constraints.lock(this.object.body, this.sensor.body);
  }

  update(KeyHandler) {
    this.isWalking = false;
    let showParticles = false
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

  currentTime() {
    var currentDate = new Date();

    return Math.floor(currentDate.getTime() / 1000);
  }

  animateWalk() {
    if (this.isWalking && this.onGround == true) {
      this.object.body.applyForceY(5.8);
      this.onGround = false;
      this.playAnimation("jumping");
      // this.isWalking = false;
    }
  }

  playAnimation(animName) {
    if (this.object.anims.current !== animName) {
      this.object.anims.play(animName);
    }
  }
}
