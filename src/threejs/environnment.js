import { loadModel } from "./modelLoader";
import * as THREE from "three";

export default class Environment {
  mapMesh;
  constructor() {}

  async loadAssets() {
    await this.loadMapMesh();
  }

  async loadMapMesh() {
    this.mapMesh = await loadModel(
      "/src/assets/models/map1/Map.mtl",
      "/src/assets/models/map1/Map.obj"
    );
    this.mapMesh = this.mapMesh.children[0];
    this.mapMesh.geometry.center();
    console.log(this.mapMesh);
  }
}
