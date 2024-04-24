import * as THREE from "three"
import ParticleSystem, {
  Body,
  BoxZone,
  Emitter,
  Gravity,
  Life,
  Mass,
  MeshRenderer,
  Position,
  RadialVelocity,
  Radius,
  Rate,
  Rotate,
  Scale,
  Span,
  Vector3D,
} from "three-nebula";



export default class WaterSplashParticleSystem {
  constructor(sketch) {
    this.verticalPos = 0;
    this.active = true;
    this.initialRate = new Rate(new Span(7, 10), new Span(0.1, 0.25));

    const nebulaMeshRenderer = new MeshRenderer(sketch.scene, THREE);

    const createMesh = ({ geometry, material }) =>
      new THREE.Mesh(geometry, material);

    const createEmitter = ({ position, body }) => {
      const emitter = new Emitter();

      return emitter
        .setRate(this.initialRate)
        .addInitializers([
          new Mass(1),
          new Radius(1),
          new Life(1, 1),
          new Body(body),
          new Position(new BoxZone(4)),
          new RadialVelocity(30, new Vector3D(0, 1, 0), 5),
        ])
        .addBehaviours([
          new Rotate("random", "random"),
          new Scale(1, 0.1),
          new Gravity(1.5),
        ])
        .setPosition(position)
        .emit();
    };

    const system = new ParticleSystem();
    const cubeEmitter = createEmitter({
      position: {
        x: 100,
        y: 0,
      },
      body: createMesh({
        geometry: new THREE.BoxGeometry(0.3, 0.3, 0.3),
        material: new THREE.MeshLambertMaterial({ color: "#3083ff" }),
      }),
    });

    this.nebula = system
      .addEmitter(cubeEmitter)
      .addRenderer(nebulaMeshRenderer);


    return this;
  }

  update(playerPosition, updatePossition = false) {
    const nebulaEmiters = this.nebula.emitters;
    for (let i = 0; i < nebulaEmiters.length; i++) {
      if (updatePossition) {
        nebulaEmiters[i].setPosition(new Vector3D(playerPosition.x, this.verticalPos, playerPosition.z))
      }
      
      if (this.active) {
        nebulaEmiters[i].setRate(this.initialRate)
      }
      else {
        nebulaEmiters[i].setRate(new Rate(0))
      }
    }
    
    this.nebula.update();
  }
}