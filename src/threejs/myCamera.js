import * as THREE from "three";

export class MyCamera extends THREE.PerspectiveCamera {
  constructor(playerPosition) {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.cameraHeight = 40;
    this.cameraDistance = 20;
    this.smoothness = 0.02;
    this.cameraSpeed = 10;
    this.cameraRotationSpeed = 10;
    this.changeModeCooldown = 1
    this.lastChangeModeTime = Math.floor((new Date()).getTime() / 1000);

    this.cameraSettings = {
      fallowPlayer: {
        cameraHeight: 40,
        cameraPosZ: 20,
        cameraRotation: new THREE.Vector3(-1.107, 0, 0)
      },
      focusOnNpc: {
        cameraHeight: 2,
        cameraPosZ: 5,
        cameraRotation: new THREE.Vector3(-0.5, 0, 0)
      }
    };
    this.inNpcFocusMod = false;

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

  update(objectPosition, deltaTime, KeyHandler, switchModeCondition = true) {
    console.log(this.rotation)
    let currentTime = Math.floor((new Date()).getTime() / 1000);
    if (KeyHandler.key.e.pressed 
        && switchModeCondition 
        && currentTime - this.lastChangeModeTime > this.changeModeCooldown) {
      this.inNpcFocusMod = ! this.inNpcFocusMod;
      this.lastChangeModeTime = currentTime;
    }

    let cameraData = this.cameraSettings.fallowPlayer;

    if (this.inNpcFocusMod) {
      cameraData = this.cameraSettings.focusOnNpc;
    }

    let adjustVector = new THREE.Vector3(0, 0, 0);
    let targetPosition = {
      x: objectPosition.x,
      y: objectPosition.y + cameraData.cameraHeight,
      z: objectPosition.z + cameraData.cameraPosZ,
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
      
    }

    let targetRotation = cameraData.cameraRotation;

    if (this.rotation.x != targetRotation.x 
        || this.rotation.y != targetRotation.y 
        || this.rotation.z != targetRotation.z)
    {
      let newRotation = (new THREE.Vector3(
        this.rotation.x,
        this.rotation.y,
        this.rotation.z
      )).lerp(targetRotation, deltaTime * 0.0001 * this.cameraRotationSpeed);

      this.setRotationFromEuler(new THREE.Euler(
          newRotation.x,
          newRotation.y,
          newRotation.z
        ));
    }
  }
}
