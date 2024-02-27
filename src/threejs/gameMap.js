import * as THREE from "three";
import * as CANNON from "cannon"
import CannonUtils from './cannonUtils'

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
    
    const meshShape = CannonUtils.createTrimesh(this.mesh.geometry, 30);

    const material = new CANNON.Material();
    material.friction = 0;
    this.body
    this.body = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      material: material
    })
    
    this.body.addShape(meshShape);
    this.body.position.set(0, 0, 0);
    sketch.world.addBody(this.body);
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
    sketch.scene.add(this.mesh);
    return this;
  }

  createConvexHull() {
    const position = this.mesh.geometry.attributes.position.array
    const points = []
    for (let i = 0; i < position.length; i += 3) {
        points.push(
            new THREE.Vector3(position[i], position[i + 1], position[i + 2])
        )
    }
    const convexGeometry = new THREE.Mesh(points);
    this.convexHull = new THREE.Mesh(
        convexGeometry,
        new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        })
    )
}

  /*
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
  }*/

  initMesh(position) {
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.scale.multiplyScalar(30);
  }
}
