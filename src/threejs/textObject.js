import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import * as THREE from "three";
export class TextObject {
  constructor({ textContent, targetObject, posX = 0, posY = 4, posZ = 0 }) {
    this.textObjectDiv = document.createElement("div");
    this.textObjectDiv.className = "label";
    this.textObjectDiv.textContent = textContent;
    this.textObjectDiv.style.backgroundColor = "transparent";

    this.textObjectLabel = new CSS2DObject(this.textObjectDiv);
    let box = new THREE.Box3().setFromObject(this.textObjectLabel);
    this.size = box.getSize(new THREE.Vector3());
    this.textObjectLabel.position.set(posX, posY, posZ);
    targetObject.add(this.textObjectLabel);
  }

  changeVisibility(visibility) {
    this.textObjectLabel.visible = visibility;
  }
}
