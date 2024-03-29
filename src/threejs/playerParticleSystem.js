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



export default class PlayerParticleSystem {
  constructor(sketch) {
    this.fromPlayerDist = 1.5;
    this.fromPlayerVerticalOffset = -1;
    this.active = true;
    this.initialRate = new Rate(new Span(5, 10), new Span(0.1, 0.25));

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
          new Position(new BoxZone(1)),
          new RadialVelocity(30, new Vector3D(0, 1, 0), 10),
        ])
        .addBehaviours([
          new Rotate("random", "random"),
          new Scale(1, 0.1),
          new Gravity(2),
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
        material: new THREE.MeshLambertMaterial({ color: "#b3b33e" }),
      }),
    });

    this.nebula = system
      .addEmitter(cubeEmitter)
      .addRenderer(nebulaMeshRenderer);


    return this;
  }

  update(playerPosition, playerDirection) {
    const horizontaVel = new Vector3D(playerDirection.x, 0, playerDirection.z)
    let moveDirection = horizontaVel.normalize();
    
    const nebulaEmiters = this.nebula.emitters;
    for (let i = 0; i < nebulaEmiters.length; i++) {
      nebulaEmiters[i].setPosition(new Vector3D(playerPosition.x - moveDirection.x * this.fromPlayerDist
        , playerPosition.y + this.fromPlayerVerticalOffset, playerPosition.z - moveDirection.z * this.fromPlayerDist))
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