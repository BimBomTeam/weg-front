import * as THREE from "three";
export class MyCamera extends THREE.PerspectiveCamera {
  constructor(playerPosition) {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.cameraHeight = 40;
    this.cameraDistance = 20;
    this.smoothness = 0.02;
    this.cameraSpeed = 10;

    this.position.set(
      playerPosition.x,
      playerPosition.y + this.cameraHeight,
      playerPosition.z + this.cameraDistance
    );
    this.lookAt(playerPosition);

    this.deadZone = {
      x: 2,
      y: 2,
      z: 2,
    };
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  update(playerPosition, deltaTime) {
    let adjustVector = new THREE.Vector3(0, 0, 0);
    let targetPosition = {
      x: playerPosition.x,
      y: playerPosition.y + this.cameraHeight,
      z: playerPosition.z + this.cameraDistance,
    };

    let moveX = targetPosition.x - this.position.x;
    let moveY = targetPosition.y - this.position.y;
    let moveZ = targetPosition.z - this.position.z;

    if (moveX > this.deadZone.x || moveX < -this.deadZone.x) {
      adjustVector.add(new THREE.Vector3(moveX, 0, 0));
    }
    if (moveY > this.deadZone.y || moveY < -this.deadZone.y) {
      adjustVector.add(new THREE.Vector3(0, moveY, 0));
    }
    if (moveZ > this.deadZone.z || moveZ < -this.deadZone.z) {
      adjustVector.add(new THREE.Vector3(0, 0, moveZ));
    }

    if (adjustVector.x != 0 || adjustVector.y != 0 || adjustVector.z != 0) {
      adjustVector.add(this.position);
      this.position.lerp(adjustVector, deltaTime * 0.0001 * this.cameraSpeed);
      // this.lookAt(playerPosition);
    }
  }
}
