import {
  Scene3D,
  ExtendedObject3D,
  THREE,
  Project,
  PhysicsLoader,
} from "enable3d";
import Stats from "stats.js";
import { KeyHandler } from "./keyHandler";

import { MyCamera } from "./myCamera";
import { Player } from "./player";
import { Vector3 } from "three";

import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

class MainScene extends Scene3D {
  constructor() {
    super({ key: "MainScene" });
  }

  init() {
    this.initRender();
    this.initStats();
    //World margin that safes objects from being stucked in wireware (objects physic body.y needed to be rised to this value)
    this.worldMargin = 0.2;
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
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    document.body.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    document.body.appendChild(this.labelRenderer.domElement);
  }

  initStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
    this.KeyHandler = new KeyHandler();
  }

  preload() {}

  lightsSetup(lights) {
    lights.directionalLight.intensity = 4;
    lights.directionalLight.color.set(0xffbe54);
    lights.directionalLight.shadow.bias = -0.002;
    lights.directionalLight.shadow.mapSize.width = 2048; // default
    lights.directionalLight.shadow.mapSize.height = 2048; // default
    lights.directionalLight.shadow.camera.near = 0.01; // default
    lights.directionalLight.shadow.camera.far = 300; // default
    lights.directionalLight.shadow.camera.top = -100; // default
    lights.directionalLight.shadow.camera.right = 100; // default
    lights.directionalLight.shadow.camera.left = -100; // default
    lights.directionalLight.shadow.camera.bottom = 100; // default
  }

  async create() {
    const { lights, orbitControls } = await this.warpSpeed("-ground, -sky");
    this.orbitControls = orbitControls;
    orbitControls.update();

    // const dirLight = new THREE.DirectionalLight(0xffffff, 1, 100);
    // lights.position.set(-3, 5, -3);
    // lights.castShadow = true;
    // console.log(lights);
    // lights.directionalLight.position.set(-1, 5, -2);

    this.lightsSetup(lights);
    // this.camera.position.set(0, 5, 20);
    // this.camera.lookAt(0, 0, 0);

    // enable physics debugging
    // this.physics.debug.enable();

    this.setupPlayer();
    this.setupMap();

    this.camera = new MyCamera(new Vector3(0, 0, 0));

    this.box = this.physics.add.box(
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
  }

  setupMap() {
    this.load.gltf("/src/assets/models/map1/world.glb").then((gltf) => {
      this.floor = new ExtendedObject3D();
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
        margin: this.worldMargin,
      });
      this.floor.body.setFriction(1);
      this.floor.body.checkCollisions = true;
      this.floor.name = "floor";
    });
  }

  setupPlayer() {
    this.player = new Player({ sketch: this });
  }

  update(time, delta) {
    this.labelRenderer.render(this.scene, this.camera);
    this.stats.update();

    if (this.player.object && this.player.object.body) {
      this.player.update(this.KeyHandler);

      this.camera.update(this.player.object.position, delta);
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
      PhysicsLoader("/src/threejs/lib/ammo/kripken", () => new Project(config));
    });
  }
}
