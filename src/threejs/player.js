import * as THREE from "three";
import * as OIMO from "oimo";
import * as CANNON from "cannon"

export default class Player {
  constructor(sizeProperties, sketch) {
    // setup
    this.material = new THREE.MeshStandardMaterial({ color: "#FDA006" });
    this.geometry = new THREE.BoxGeometry(
      sizeProperties.width,
      sizeProperties.height,
      sizeProperties.depth
    );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    sketch.scene.add(this.mesh);

    this.speed = 50;
    this.maxSpeed=50;

    this.velocity = { x: 0, y: 0, z: 0 };

    this.position = { x: 0, y: 50, z: 0 };

    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    const material = new CANNON.Material();
    material.friction = 0;
    const boxShape = new CANNON.Box(new CANNON.Vec3(sizeProperties.width / 2, sizeProperties.height / 2, sizeProperties.depth / 2));
    this.body = new CANNON.Body({
      mass: 50,
      type: CANNON.Body.DYNAMIC,
      fixedRotation: true,
      material: material
    })
    this.body.addShape(boxShape);
    this.body.position = new CANNON.Vec3(0, 50, 0);
    sketch.world.addBody(this.body);

    return this;
  }
  update() {

    //#COMMENTED SECTION is a test to implement movement with immpulse
    // var force = this.mesh.position.clone().negate().normalize().multiplyScalar(10000);
    // var center=new THREE.Vector3(0, 0, 0);
    // if(this.velocity.x!=0){
    //   this.body.applyImpulse(center, force);
    // }

    const sin45 = Math.sin(Math.PI / 4)
    //#movement implementation
    if(Math.abs(this.body.velocity.x)+Math.abs(this.body.velocity.z)<=this.maxSpeed){
      this.body.velocity = new CANNON.Vec3(this.velocity.x, this.body.velocity.y, this.velocity.z);
    }
    else {
      this.body.velocity = new CANNON.Vec3(this.velocity.x * sin45, this.body.velocity.y, this.velocity.z * sin45);
    }
    

    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
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
