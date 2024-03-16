import { ExtendedObject3D } from "enable3d";
import { Vector3 } from "three";
import * as THREE from "three";
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
    this.speed = 7;
    this.isWalking = false;
    this.scale = 3;

    this.initPlayer(pos, sketch);

    //Initializing Player in physics world
    // this.object = sketch.physics.add.box(
    //   {
    //     ...pos,
    //     ...sizes,
    //     name: this.objName,
    //     // mass: 1,
    //     offset: { y: -0.2, x: 0.2, z: -0.2 },
    //   },
    //   {
    //     phong: { color: 0x0000ff },
    //   }
    // );
    // this.initPlayer(pos, 5, sketch);

    // this.initSensor(sketch);
    //Player ParticleSystem
    // this.playerParticleSystem = new PlayerParticleSystem(sketch);
  }

  async initPlayer(pos, sketch) {
    await this.initPlayerObject(pos, sketch);
    this.object.name = "player";

    //Attaching the collision sensor to player body
    this.initSensor(sketch);

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

  initSensor(sketch) {
    this.sensor = new ExtendedObject3D();
    this.sensor.position.setY(
      this.object.position.y - (this.size.y * this.scale) / 2 + 0.1
    );
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
      if (event !== "end" && this.object.body.velocity.y < 1) {
        this.onGround = true;
        this.playAnimation("idle");
      } else {
        this.onGround = false;
      }
    });
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
