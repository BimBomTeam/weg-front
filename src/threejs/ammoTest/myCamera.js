import * as THREE from "three";
export class MyCamera extends THREE.PerspectiveCamera {
  constructor(playerPosition) {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.cameraHeight = 40;
    this.cameraDistance = 20;
    this.smoothness = 0.005;

    this.position.set(
      playerPosition.x,
      playerPosition.y + this.cameraHeight,
      playerPosition.z + this.cameraDistance
    );

    this.deadZone = {
      x: 4,
      y: 4,
      z: 4,
    };
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  update(playerPosition) {
    this.lookAt(playerPosition);
    let targetPosition = {
      x: playerPosition.x,
      y: playerPosition.y + this.cameraHeight,
      z: playerPosition.z + this.cameraDistance,
    };

    let moveX = targetPosition.x - this.position.x;
    let moveY = targetPosition.y - this.position.y;
    let moveZ = targetPosition.z - this.position.z;

    if (moveX > this.deadZone.x || moveX < -this.deadZone.x) {
      this.position.x = this.lerp(
        this.position.x,
        targetPosition.x,
        this.smoothness
      );
    }
    if (moveY > this.deadZone.y || moveY < -this.deadZone.y) {
      this.position.y = this.lerp(
        this.position.y,
        targetPosition.y,
        this.smoothness
      );
    }
    if (moveZ > this.deadZone.z || moveZ < -this.deadZone.z) {
      this.position.z = this.lerp(
        this.position.z,
        targetPosition.z,
        this.smoothness
      );
    }
  }
}
