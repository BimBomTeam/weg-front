import * as THREE from "three";

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
    this.body.pos.x += this.velocity.x;
    this.body.pos.z += this.velocity.z;

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
