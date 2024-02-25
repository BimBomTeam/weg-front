import * as THREE from "three";
export default class GameMap {
  constructor(
    mapMesh,
    position = {
      x: 0,
      y: 20,
      z: 0,
    },
    sketch
  ) {
    this.mesh = mapMesh;
    this.mesh.recieveShadow = true;
    this.mesh.castShadow = true;
    this.initMesh(position);
    this.size = new THREE.Vector3();
    new THREE.Box3().setFromObject(this.mesh).getSize(this.size);
    // this.innitColider(sketch);
    this.body = sketch.world.add({
      type: "box",
      size: [this.size.x, this.size.y, this.size.z],
      pos: [position.x, position.y, position.z],
      move: false,
      friction: 0.2,
      restitution: 0.2,
    });
    this.mesh.position.copy(this.body.getPosition());
    this.mesh.quaternion.copy(this.body.getQuaternion());
    sketch.scene.add(this.mesh);
    return this;
  }

  innitColider(sketch) {
    var vertices = this.mesh.geometry.attributes.position.array;
    var r = 1;
    var x, y, z;
    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      // vertices[j + 1] = data[i] * 10 - 100;
      x = vertices[j];
      y = vertices[j + 1] - r;
      z = vertices[j + 2];

      var b = sketch.world.add({ type: "sphere", size: [r], pos: [x, y, z] });
    }
  }

  initMesh(position) {
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.scale.multiplyScalar(30);
  }
}
