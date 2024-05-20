import * as THREE from "three";
export class TestCamera extends THREE.PerspectiveCamera {
  constructor() {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.angleTmpData = undefined;

    this.targetAngleData = undefined;
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  update(targetPos) {
    this.position = targetPos;
  }

  updateFollowPlayer(
    deltaTime,
    objectPosition,
    adjustPosition = { x: 0, y: 40, z: 20 },
    { deadZone = { x: 4, y: 4, z: 4 }, cameraSpeed = 10 }
  ) {
    let adjustVector = new THREE.Vector3(0, 0, 0);
    let targetPosition = {
      x: objectPosition.x + adjustPosition.x,
      y: objectPosition.y + adjustPosition.y,
      z: objectPosition.z + adjustPosition.z,
    };

    let moveX = targetPosition.x - this.position.x;
    let moveY = targetPosition.y - this.position.y;
    let moveZ = targetPosition.z - this.position.z;

    if (moveX > deadZone.x || moveX < -deadZone.x) {
      adjustVector.add(new THREE.Vector3(moveX, 0, 0));
    }
    if (moveY > deadZone.y || moveY < -deadZone.y) {
      adjustVector.add(new THREE.Vector3(0, moveY, 0));
    }
    if (moveZ > deadZone.z || moveZ < -deadZone.z) {
      adjustVector.add(new THREE.Vector3(0, 0, moveZ));
    }

    if (adjustVector.x != 0 || adjustVector.y != 0 || adjustVector.z != 0) {
      adjustVector.add(this.position);
      this.position.lerp(adjustVector, deltaTime * 0.0001 * cameraSpeed);
    }
  }

  zoomIn(
    deltaTime,
    objectPosition = new THREE.Vector3(),
    { adjustPosition = new THREE.Vector3(), cameraSpeed = 10 }
  ) {
    let targetPosition = new THREE.Vector3(
      objectPosition.x + adjustPosition.x,
      objectPosition.y + adjustPosition.y,
      objectPosition.z + adjustPosition.z
    );
    this.position.lerp(targetPosition, deltaTime * 0.0001 * cameraSpeed);
    let moveX = targetPosition.x - this.position.x;
    let moveY = targetPosition.y - this.position.y;
    let moveZ = targetPosition.z - this.position.z;
    if (Math.abs(moveX) + Math.abs(moveY) + Math.abs(moveZ) <= 4) return true;
  }

  lerpAngleDynamic(
    deltaTime,
    objectPosition = new THREE.Vector3(),
    { cameraSpeed = 10 }
  ) {
    let firstPos = new THREE.Quaternion().copy(this.quaternion);
    this.lookAt(objectPosition);
    let finalPos = new THREE.Quaternion().copy(this.quaternion);
    this.quaternion.copy(firstPos);
    this.quaternion.slerpQuaternions(
      firstPos,
      finalPos,
      deltaTime * 0.0001 * cameraSpeed
    );
    if (Math.abs(this.quaternion.dot(finalPos)) + 0.0001 >= 1) {
      return true;
    }
  }
  lerpAngle(
    deltaTime,
    objectPosition = new THREE.Vector3(),
    { cameraSpeed = 10 }
  ) {
    if (this.angleTmpData === undefined) {
      let firstPos = new THREE.Quaternion().copy(this.quaternion);
      this.lookAt(objectPosition);
      let finalPos = new THREE.Quaternion().copy(this.quaternion);
      this.quaternion.copy(firstPos);
      this.angleTmpData = finalPos.clone();
    }
    let firstPos = new THREE.Quaternion().copy(this.quaternion);
    this.quaternion.slerpQuaternions(
      firstPos,
      this.angleTmpData,
      deltaTime * 0.0001 * cameraSpeed
    );
    if (Math.abs(this.quaternion.dot(this.angleTmpData)) + 0.0001 >= 1) {
      this.angleTmpData = undefined;
      return true;
    }
  }

  setTargetAngle(objectPosition = new THREE.Vector3()) {}
}
