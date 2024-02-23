import * as THREE from "three";

export class Platform extends THREE.Mesh {
  constructor({
    sizeProperties = {
      width: 1,
      height: 1,
      depth: 1,
    },
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    color = 0xff0000,
  }) {
    super(
      new THREE.BoxGeometry(
        sizeProperties.width,
        sizeProperties.height,
        sizeProperties.depth
      ),
      new THREE.MeshStandardMaterial(color)
    );

    this.width = sizeProperties.width;
    this.height = sizeProperties.height;
    this.depth = sizeProperties.depth;

    this.position.set(position.x, position.y, position.z);
  }
}

export class TestPlayer extends THREE.Mesh {
  constructor({
    sizeProperties = {
      width: 4,
      height: 4,
      depth: 4,
    },
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    color = 0x00ff00,
  }) {
    super(
      new THREE.BoxGeometry(
        sizeProperties.width,
        sizeProperties.height,
        sizeProperties.depth
      ),
      new THREE.MeshStandardMaterial({ color })
    );

    this.width = sizeProperties.width;
    this.height = sizeProperties.height;
    this.depth = sizeProperties.depth;

    this.speed = 0.06;

    this.velocity = { x: 0, y: 0, z: 0 };

    this.position.set(position.x, position.y, position.z);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
  }
}
