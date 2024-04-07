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
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky";
import { TestCamera } from "./testCamera";
import { CameraOperator } from "./cameraOperator";
import { StandartNPC } from "./standartNPC";

let changeUiVisibilityTest;

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

  async initWater() {
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);

    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "src/assets/water/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.needsUpdate = true;
        }
      ),
      sunDirection: new THREE.Vector3(2, 0, 0),
      sunColor: 0xffbe54,
      waterColor: 0x20b7e6,
      distortionScale: 3.5,
      fog: this.scene.fog !== undefined,
    });

    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = 0.1;
    this.water.position.x = -5;
    // this.water.receiveShadow = true;

    this.scene.add(this.water);
  }

  initSky() {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    this.scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;
    skyUniforms["sunPosition"].value = new THREE.Vector3(2, 1, 0);
  }

  async create() {
    const { lights, orbitControls } = await this.warpSpeed("-ground, -sky");
    this.orbitControls = orbitControls;
    orbitControls.update();

    this.scene.fog = new THREE.Fog(0xffffff, 50, 300);
    this.initSky();
    await this.initWater();

    this.lightsSetup(lights);

    // enable physics debugging
    // this.physics.debug.enable();
    // this.camera = new MyCamera(new Vector3(0, 0, 0));
    this.camera = new TestCamera();
    this.camOperator = new CameraOperator({ camera: this.camera });

    this.setupPlayer();
    this.setupMap();
    this.standNPC = new StandartNPC({
      pos: { x: 38, y: 10, z: 10 },
      sketch: this,
    });

    this.box = this.physics.add.box(
      {
        name: "box",
        y: 10,
        width: 3,
        depth: 3,
        height: 3,
        mass: 1,
        x: 30,
      },
      { phong: { color: 0x00ff00 } }
    );
    this.box.body.setAngularFactor(0, 0, 0);
  }

  setupMap() {
    this.load.gltf("/src/assets/models/map1/world2.glb").then((gltf) => {
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
    let testPos = { x: 40, y: 30, z: 75 };
    this.player = new Player({ sketch: this });
  }

  update(time, delta) {
    this.labelRenderer.render(this.scene, this.camera);
    this.water.material.uniforms["time"].value += 1.0 / 240.0;
    this.stats.update();

    if (this.player.object && this.player.object.body) {
      this.player.update(this.KeyHandler);
      this.standNPC.update();
      this.standNPC.checkInteraction(this.player.object.position);

      // this.camOperator.removeEvent("lerpToAngle");

      if (this.standNPC.mode == "prepToInteract") {
        if (this.KeyHandler.key.e.click && this.player.mode == "freeWalk") {
          changeUiVisibilityTest(true);
          this.player.mode = "interact";
          this.player.addRotateEvent(this.standNPC.object.position);
          this.camOperator.addNPCzoomIn({
            targetPos: this.standNPC.object.position,
            adjustPosition: new Vector3(3, 1, 8),
          });
        }
        if (this.KeyHandler.key.esc.click && this.player.mode == "interact") {
          changeUiVisibilityTest(false);
          this.player.mode = "freeWalk";
          this.player.moveEvent = [];
          this.camOperator.addNPCzoomOut();
        }
      }
      // this.camera.update(
      //   this.player.object.position,
      //   delta,
      //   this.KeyHandler,
      //   npcNearBy
      // );
      this.camOperator.update(delta, this.KeyHandler);
      this.KeyHandler.update();
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
    changeUiVisibilityTest = changeUIVisibility;

    window.addEventListener("load", () => {
      PhysicsLoader("/src/threejs/lib/ammo/kripken", () => new Project(config));
    });
  }
}
