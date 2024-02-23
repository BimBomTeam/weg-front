import * as THREE from "three";
import * as OIMO from "oimo";

export default class Player {
  constructor(sizeProperties, sketch) {
    // setup
    this.material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    this.geometry = new THREE.BoxGeometry(
      sizeProperties.width,
      sizeProperties.height,
      sizeProperties.depth
    );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    sketch.scene.add(this.mesh);

    this.speed = 1;
    this.maxSpeed=15;

    this.velocity = { x: 0, y: 0, z: 0 };

    this.position = { x: 0, y: 50, z: 0 };

    this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    this.body = sketch.world.add({
      type: "box",
      size: [sizeProperties.width, sizeProperties.height, sizeProperties.depth],
      pos: [this.position.x, this.position.y, this.position.z],
      move: true,
      friction: 1,
      restitution: 0.1,
    });

    return this;
  }
  update() {

    //#COMMENTED SECTION is a test to implement movement with immpulse
    // var force = this.mesh.position.clone().negate().normalize().multiplyScalar(10000);
    // var center=new THREE.Vector3(0, 0, 0);
    // if(this.velocity.x!=0){
    //   this.body.applyImpulse(center, force);
    // }


    //#movement implementation
    if(Math.abs(this.body.linearVelocity.x)+Math.abs(this.body.linearVelocity.z)<=this.maxSpeed){
      this.body.linearVelocity.add({x:this.velocity.x, y:0, z:this.velocity.z})
    }

    this.body.angularVelocity.set(0, 0, 0);
    

    this.mesh.position.copy(this.body.getPosition());
    this.mesh.quaternion.copy(this.body.getQuaternion());
  }
  // const player = new TestPlayer({
  //   sizeProperties: { width: 1, height: 1, depth: 1 },
  //   position: { x: 0, y: 0, z: 0 },
  // });
  // player.castShadow = true;
  // scene.add(player);

  // const box = new TestPlayer({
  //   sizeProperties: { width: 1, height: 1, depth: 1 },
  //   position: { x: -3, y: 0, z: -3 },
  // });
  // scene.add(box);

  // camera.position.set(2, 2, 10);

  //movement
  //
}
