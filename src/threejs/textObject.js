import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import * as THREE from "three";
export class TextObject {
  constructor({ textContent, targetObject, posX = 0, posY = 4, posZ = 0 }) {
    const textObjectDiv = document.createElement("div");
    textObjectDiv.className = "label";
    textObjectDiv.textContent = textContent;
    textObjectDiv.style.backgroundColor = "transparent";

    const textObjectLabel = new CSS2DObject(textObjectDiv);
    let box = new THREE.Box3().setFromObject(textObjectLabel);
    this.size = box.getSize(new THREE.Vector3());
    textObjectLabel.position.set(posX, posY, posZ);
    targetObject.add(textObjectLabel);
  }
}
