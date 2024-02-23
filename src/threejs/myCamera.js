import * as THREE from "three";

export default class MyCamera extends THREE.PerspectiveCamera {
  camera = null;
  constructor(playerPosition) {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.cameraHeight = 50;
    this.cameraDistance = 120;
    this.smoothness = 0.02;

    this.lookAt(playerPosition);
    this.position.set(0, this.cameraHeight, this.cameraDistance);

    this.deadZone = {
      minX: -2,
      maxX: 2,
      minY: -1,
      maxY: 1,
      minZ: 0, //far from you. more is longer
      maxZ: 80,
    };
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  cameraUpdate(playerPosition) {
    const desiredPosition = {
      x: playerPosition.x,
      y: playerPosition.y + this.cameraHeight,
      z: playerPosition.z + this.cameraDistance,
    };

    let moveX = desiredPosition.x - this.position.x;
    let moveY = desiredPosition.y - this.position.y;
    let moveZ = desiredPosition.z - this.position.z;

    if (
      Math.abs(moveX) > this.deadZone.maxX ||
      Math.abs(moveX) < this.deadZone.minX
    ) {
      this.position.x = this.lerp(
        this.position.x,
        desiredPosition.x,
        this.smoothness
      );
    }

    if (
      Math.abs(moveY) > this.deadZone.maxY ||
      Math.abs(moveY) < this.deadZone.minY
    ) {
      this.position.y = this.lerp(
        this.position.y,
        desiredPosition.y,
        this.smoothness
      );
    }

    if (
      Math.abs(moveZ) > this.deadZone.maxZ ||
      Math.abs(moveZ) < this.deadZone.minZ
    ) {
      this.position.z = this.lerp(
        this.position.z,
        desiredPosition.z,
        this.smoothness
      );
    }
  }
}
