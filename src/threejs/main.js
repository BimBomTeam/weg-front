import * as THREE from "three";
import * as OIMO from "oimo";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { KeyHandler } from "./keyListener";
import { Platform } from "./scene";
import { TestPlayer } from "./scene";
import MyCamera from "./myCamera.js";

import Block from "./example/block.js";
import Ball from "./example/ball.js";
import Floor from "./example/floor.js";
import Player from "./player.js";
import Stats from "stats.js";
import Environment from "./environnment.js";
import GameMap from "./gameMap.js";

//#setting scene camera renderer
export default class GameScene {
  constructor(changeUiVisibility) {
    this._init();
  }

  async _init() {
    await this.loadEnv();

    this.setup();
    this.statsInint();

    this.map = new GameMap(
      this.environment.mapMesh,
      { x: 0, y: 0, z: 0 },
      this
    );
    // kick off our animation!
    this.animate();
    this.player.mesh.geometry.width;
  }

  async loadEnv() {
    this.environment = new Environment();
    await this.environment.loadAssets();
  }

  //STATS
  statsInint() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  // ANIMATION
  animate() {
    this.stats.begin();

    this.player.velocity.x = 0;
    this.player.velocity.z = 0;

    if (this.keyHl.key.a.pressed) this.player.velocity.x = -this.player.speed;
    else if (this.keyHl.key.d.pressed)
      this.player.velocity.x = this.player.speed;

    if (this.keyHl.key.w.pressed) this.player.velocity.z = -this.player.speed;
    else if (this.keyHl.key.s.pressed)
      this.player.velocity.z = this.player.speed;

    this.player.update();

    this.camera.cameraUpdate(this.player.mesh.position);

    this.completeFrame();

    this.stats.end();
  }
  completeFrame() {
    // update world
    this.world.step();
    // render this frame of our animation
    this.renderer.render(this.scene, this.camera);
    // line up our next frame
    requestAnimationFrame(this.animate.bind(this));
  }

  setup() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.setupScene();
    this.setupRenderer();
    this.setupLights();

    this.world = new OIMO.World({
      timestep: 1 / 60,
      iterations: 8,
      broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
      worldscale: 1, // scale full world
      random: true, // randomize sample
      info: false, // calculate statistic or not
      gravity: [0, -98, 0],
    });

    this.setupPlayer();
    this.setupCamera();

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }
  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
  }
  setupRenderer() {
    const canvas = document.querySelector("#webgl");

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  }
  setupCamera() {
    this.camera = new MyCamera(this.player.mesh.position);

    this.camera.position.x = 0;
    this.camera.position.y = 100;
    this.camera.position.z = 100;

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enabled = false;

    this.scene.add(this.camera);
  }
  setupLights() {
    let ambLight = new THREE.AmbientLight(0xffffff, 0.7, 100);
    this.scene.add(ambLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1, 100);
    dirLight.position.set(-3, 5, -3);
    dirLight.castShadow = true;
    this.scene.add(dirLight);
  }
  setupCameraControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();
    this.controls.enabled = false;
  }
  setupPlayer() {
    this.player = new Player({ width: 20, height: 20, depth: 20 }, this);
    this.keyHl = new KeyHandler(window);
  }
  onWindowResize() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }

  // const player = new TestPlayer({
  //   sizeProperties: { width: 1, height: 1, depth: 1 },
  //   position: { x: 0, y: 0, z: 0 },
  // });
  // player.castShadow = true;
  // scene.add(player);

  // const box = new TestPlayer({
  //   sizeProperties: { width: 1, height: 1, depth: 1 },
  //   position: { x: -3, y: 0, z: -3 },
  // });
  // scene.add(box);

  // camera.position.set(2, 2, 10);

  //movement
  // const keyHl = new KeyHandler(window);

  isNearNpc() {
    const DISTANCE_TRIGGER = 1;
    const distance = player.position.distanceTo(box.position);
    if (distance < DISTANCE_TRIGGER) {
      console.log("WORKS");
      changeUiVisibility(true);
    } else {
      changeUiVisibility(false);
    }
  }

  //rendering animation
  // animate() {
  //   requestAnimationFrame(animate);

  //   player.velocity.x = 0;
  //   player.velocity.z = 0;

  //   if (keyHl.key.a.pressed) player.velocity.x = -player.speed;
  //   else if (keyHl.key.d.pressed) player.velocity.x = player.speed;

  //   if (keyHl.key.w.pressed) player.velocity.z = -player.speed;
  //   else if (keyHl.key.s.pressed) player.velocity.z = player.speed;

  //   player.update();

  //   camera.cameraUpdate(player.position);
  //   renderer.render(scene, camera);

  //   isNearNpc();
  // }
}
