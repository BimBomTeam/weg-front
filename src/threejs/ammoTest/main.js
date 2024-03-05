import {
  Scene3D,
  ExtendedObject3D,
  THREE,
  Project,
  PhysicsLoader,
} from "enable3d";
import Stats from "stats.js";
import { KeyHandler } from "./keyHandler";

class MainScene extends Scene3D {
  constructor() {
    super({ key: "MainScene" });
  }

  init() {
    this.initRender();
    this.initStats();
  }

  initRender() {
    const oldRenderer = document.querySelector('[data-engine="three.js r156"]');

    oldRenderer.remove();

    const canvas = document.querySelector("#webgl");
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;

    document.body.appendChild(this.renderer.domElement);
  }

  initStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
    this.KeyHandler = new KeyHandler();
  }

  preload() {}

  async create() {
    const { lights, orbitControls } = await this.warpSpeed("-ground");
    this.orbitControls = orbitControls;
    orbitControls.update();

    const dirLight = new THREE.DirectionalLight(0xffffff, 1, 100);
    dirLight.position.set(-3, 5, -3);
    dirLight.castShadow = true;

    this.camera.position.set(0, 5, 20);
    this.camera.lookAt(0, 0, 0);

    // enable physics debugging
    // this.physics.debug.enable();

    this.setupMap();
    this.setupPlayer(3);

    this.physics.add.box(
      {
        name: "box",
        y: 10,
        width: 3,
        depth: 3,
        height: 3,
        mass: 1,
        x: 4,
      },
      { phong: { color: 0x00ff00 } }
    );
    this.box.body.setAngularFactor(0, 0, 0);
  }

  setupMap() {
    this.load.gltf("/src/assets/models/map1/map3.glb").then((gltf) => {
      this.floor = new ExtendedObject3D();
      gltf.scene.children[0].children[0].children[0].geometry.center();
      this.floor.add(gltf.scene);
      this.floor.position.setZ(5);
      this.floor.position.setX(-5);
      const scale = 5;
      this.floor.scale.set(scale, scale, scale);

      this.floor.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = child.receiveShadow = true;
        }
      });
      this.add.existing(this.floor);
      this.physics.add.existing(this.floor, {
        shape: "concave",
        mass: 0,
        margin: 0.2,
      });
    });
  }

  setupPlayer(size) {
    this.box = this.physics.add.box(
      {
        name: "player",
        y: 5,
        width: size,
        depth: size,
        height: size,
        mass: 1,
        offset: { y: -0.2, x: 0.2, z: -0.2 },
      },
      {
        phong: { color: 0xff0000 },
      }
    );
  }

  update(time, delta) {
    this.stats.update();
    if (this.box && this.box.body) {
      let adjustPosition = new THREE.Vector3(
        this.box.position.x,
        8,
        this.box.position.z + 20
      );
      if (this.KeyHandler.key.a.pressed) {
        this.camera.position.lerp(adjustPosition, 0.01);
        this.box.body.setVelocityX(-4);
      } else if (this.KeyHandler.key.d.pressed) {
        this.camera.position.lerp(adjustPosition, 0.01);
        this.box.body.setVelocityX(4);
      }
      if (this.KeyHandler.key.w.pressed) {
        this.camera.position.lerp(adjustPosition, 0.01);
        this.box.body.setVelocityZ(-4);
      } else if (this.KeyHandler.key.s.pressed) {
        this.camera.position.lerp(adjustPosition, 0.01);
        this.box.body.setVelocityZ(4);
      }
    }
  }
}

const config = {
  gravity: { x: 0, y: -30, z: 0 },
  transparent: true,
  antialias: true,
  maxSubSteps: 6,
  fixedTimeStep: 1 / 60,
  scale: {
    width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
    height: window.innerHeight * Math.max(1, window.devicePixelRatio / 2),
  },
  scenes: [MainScene],
};

export default class GameScene {
  constructor(changeUIVisibility) {
    window.addEventListener("load", () => {
      PhysicsLoader(
        "/src/threejs/ammoTest/lib/ammo/kripken",
        () => new Project(config)
      );
    });
  }
}
