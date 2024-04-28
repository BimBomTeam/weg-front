import * as THREE from "three";
import { TestCamera } from "./testCamera";
import { ExtendedObject3D } from "enable3d";

export class CameraOperator {
  constructor({ targetPos = new THREE.Vector3(), camera = new TestCamera() }) {
    this.targetPos = targetPos;
    this.camera = camera;
    this.cameraData = {
      playerFollow: {
        deadZone: { x: 2, y: 2, z: 2 },
        adjustPosition: { x: 0, y: 40, z: 20 },
        cameraSpeed: 10,
      },
    };
    this.eternalUpateList = {
      playerFollow: function fun(deltaTime, targetPos, adjustPos, camData) {
        camera.updateFollowPlayer(deltaTime, targetPos, adjustPos, {
          ...camData,
        });
      },
    };
    this.eternalUpate = {
      name: "playerFollow",
      funUpdate: this.eternalUpateList["playerFollow"],
      state: 1,
    };
    this.eventList = [];
    this.eventUpdates = {
      lerpToAngle: function fun(deltaTime, config) {
        let { targetPos } = config;
        return camera.lerpAngle(deltaTime, targetPos, {});
      },
      NPCzoomIn: function fun(deltaTime, config) {
        let { targetPos, adjustPosition } = config;
        let first = camera.zoomIn(deltaTime, targetPos, {
          adjustPosition: adjustPosition,
          cameraSpeed: 40,
        });
        let second = camera.lerpAngleDynamic(
          deltaTime,
          targetPos.add(new THREE.Vector3(0, 1, 0)),
          { cameraSpeed: 30 }
        );
        // console.log(first, " ", second);
        return first && second;
      },
      NPCzoomOut: (deltaTime, config) => {
        let { targetPos, adjustPosition } = config;
        let first = camera.zoomIn(deltaTime, targetPos, {
          adjustPosition: adjustPosition,
          cameraSpeed: 40,
        });
        let second = camera.lerpAngleDynamic(deltaTime, targetPos, {
          cameraSpeed: 50,
        });
        if (first && second) {
          this.eternalUpate.state = 1;
          return true;
        }
      },
    };

    this.currentAdjustPosition = new THREE.Vector3();
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  getDistancedVector2Fixed(
    objectToObjectVector = new THREE.Vector3(),
    distance,
    angle
  ) {
    let v1 = objectToObjectVector.clone().normalize().multiplyScalar(distance);
    v1 = new THREE.Vector2(v1.x, v1.z);
    let x1 = v1.clone().divideScalar(Math.cos(angle));
    x1.rotateAround(new THREE.Vector2(), angle);
    return x1;
  }

  getDistancedVector(object = new ExtendedObject3D(), distance) {
    let v1 = new THREE.Vector2(0, -distance);
    v1.rotateAround(new THREE.Vector2(), object.world.theta - Math.PI);
    return v1;
  }

  rotateVector2(v1 = new THREE.Vector2(), angle) {
    v1.set(
      Math.cos(angle) * v1.x - Math.sin(angle) * v1.y,
      Math.sin(angle) * v1.x + Math.cos(angle) * v1.y
    );
    return v1;
  }

  update(deltaTime) {
    this.eventList = this.eventList.filter(
      (element) =>
        !this.eventUpdates[element.name](deltaTime, { ...element.config })
    );
    // console.log(this.eventList);

    //Place for enternalUpdate logic
    if (this.eternalUpate.state == 1) {
      this.eternalUpate.funUpdate(
        deltaTime,
        this.targetPos,
        this.currentAdjustPosition,
        { ...this.cameraData[this.eternalUpate.name] }
      );
    }
  }

  setTargetObject(targetObj) {
    this.targetPos = targetObj.position;
    this.setEnternalUpdate(this.eternalUpate.name);
  }

  setEnternalUpdate(event) {
    if (
      this.cameraData[event] === undefined ||
      this.cameraData[event].adjustPosition === undefined
    ) {
      console.log(
        "Position can't be updated. Verify name of event or if event contain adjustPosition."
      );
      return;
    }
    // console.log(this.camera.rotation);
    this.camera.position.copy(
      new THREE.Vector3(
        this.targetPos.x + this.cameraData[event].adjustPosition.x,
        this.targetPos.y + this.cameraData[event].adjustPosition.y,
        this.targetPos.z + this.cameraData[event].adjustPosition.z
      )
    );
    this.currentAdjustPosition = this.cameraData[event].adjustPosition;
  }

  addEvent(eventName, config) {
    if (this.eventIsPlayed(eventName)) return;
    if (!this.eventIsExist(eventName)) return;
    let event = { name: eventName, config: config };
    this.eventList.push(event);
    if (eventName == "NPCzoomIn") {
      this.currentAdjustPosition = {
        x: config.targetPos.x + config.adjustPosition.x,
        y: config.targetPos.y + config.adjustPosition.y,
        z: config.targetPos.z + config.adjustPosition.z,
      };
      this.eternalUpate.state = 0;
    }
  }

  addLerpToAngle({ targetPos = new THREE.Vector3() }) {
    const eventName = "lerpToAngle";
    if (this.eventIsPlayed(eventName)) return;
    let event = {
      name: eventName,
      config: { targetPos: targetPos },
    };
    this.eventList.push(event);
  }

  addNPCzoomIn({
    targetPos = new THREE.Vector3(),
    adjustPosition = new THREE.Vector3(),
  }) {
    const eventName = "NPCzoomIn";
    if (this.eventIsPlayed(eventName)) return;
    let event = {
      name: eventName,
      config: { targetPos: targetPos, adjustPosition: adjustPosition },
    };
    this.eventList.push(event);
    this.currentAdjustPosition = {
      x: targetPos.x + adjustPosition.x,
      y: targetPos.y + adjustPosition.y,
      z: targetPos.z + adjustPosition.z,
    };
    this.eternalUpate.state = 0;
    this.removeEvent("NPCzoomOut");
    this.removeEvent("lerpToAngle");
    this.camera.angleTmpData = undefined;
  }

  addNPCzoomOut(targetPos, adjustPosition) {
    const eventName = "NPCzoomOut";
    if (this.eventIsPlayed(eventName)) return;
    if (targetPos === undefined) {
      targetPos = this.targetPos.clone();
    }
    if (adjustPosition === undefined) {
      adjustPosition = this.cameraData.playerFollow.adjustPosition;
    }
    let event = {
      name: eventName,
      config: { targetPos: targetPos, adjustPosition: adjustPosition },
    };
    this.eventList.push(event);
    this.currentAdjustPosition =
      this.cameraData[this.eternalUpate.name].addjustPosition;
    this.removeEvent("NPCzoomIn");
    this.removeEvent("lerpToAngle");
    this.camera.angleTmpData = undefined;
  }

  eventIsPlayed(eventName) {
    for (let element of this.eventList) {
      if (element.name == eventName) return true;
    }
    return false;
  }

  eventIsExist(eventName) {
    if (eventName in this.eventUpdates) return true;
    console.log("camera event isn't exist in eventUpdates");
    return false;
  }

  removeEvent(eventName) {
    if (!this.eventIsExist(eventName)) return;
    let ind = this.eventList.findIndex((element) => element.name == eventName);
    if (ind == -1) return;
    this.eventList.splice(ind, 1);
  }
}
