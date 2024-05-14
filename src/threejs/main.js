import {
  Scene3D,
  ExtendedObject3D,
  THREE,
  Project,
  PhysicsLoader,
} from "enable3d";
import Stats from "stats.js";
import { KeyHandler } from "./keyHandler";

import { Player } from "./player";
import { Vector2, Vector3 } from "three";

import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky";
import { TestCamera } from "./testCamera";
import { CameraOperator } from "./cameraOperator";
import { StandartNPC } from "./standartNPC";
import GenerateWordsById from "../logic/GenerateWordsById";
import { BossNPC } from "./bossNPC";
import SoundManager from "./soundManager";

import store from "../store/store";
import { ModelLoader } from "./modelLoaderService";
import { setBossHit, setUiState } from "../actions/interact";
import { UiStates } from "../reducers/interactReducer";

let sceneLoaded;

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

    window.addEventListener("resize", (event) => {
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.camOperator.camera.aspect = window.innerWidth / window.innerHeight;
      this.camOperator.camera.updateProjectionMatrix();
    });
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
    lights.directionalLight.shadow.camera.top = -200; // default
    lights.directionalLight.shadow.camera.right = 200; // default
    lights.directionalLight.shadow.camera.left = -200; // default
    lights.directionalLight.shadow.camera.bottom = 200; // default
  }

  async initWater() {
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);

    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "/lib/water/waternormals.jpg",
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

    this.soundManager = new SoundManager(this.camera);
    const rolesReduxArr = store.getState().roles.roles.roles;

    console.log("rolesReduxArr", rolesReduxArr);

    const modelsPath = "/lib/models/";
    this.modelLoader = new ModelLoader();
    await this.modelLoader.loadModelsAsync(modelsPath, this);

    this.setupPlayer();
    this.setupNpcs(rolesReduxArr);
    this.setupMap();
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

    const bossHitFunc = () => {
      this.bossNPC.hitPlayer(this.player.object.position);
    };

    store.dispatch(setBossHit(bossHitFunc));

    sceneLoaded();
  }

  setupNpcs(rolesReduxArr) {
    this.npcArray = [];

    this.bossNPC = new BossNPC({
      pos: { x: 16, y: 10, z: -23 },
      sketch: this,
      gltf: this.modelLoader.modelsArray["boss"],
      playerPosition: this.player.object.position,
    });
    this.standNPC = new StandartNPC({
      pos: { x: -80, y: 10, z: -118 },
      sketch: this,
      zoneRadius: 10,
      gltf: this.modelLoader.modelsArray["npc5"],
      textObjectText: rolesReduxArr[0].name,
    });
    this.standNPC2 = new StandartNPC({
      pos: { x: 64, y: 10, z: -111 },
      sketch: this,
      zoneRadius: 12,
      textObjectText: rolesReduxArr[1].name,
      gltf: this.modelLoader.modelsArray["npc1"],
    });
    this.standNPC3 = new StandartNPC({
      pos: { x: 108, y: 10, z: 83 },
      sketch: this,
      zoneRadius: 11,
      textObjectText: rolesReduxArr[2].name,
      gltf: this.modelLoader.modelsArray["npc2"],
    });
    this.standNPC4 = new StandartNPC({
      pos: { x: -69, y: 10, z: 75 },
      sketch: this,
      zoneRadius: 12,
      textObjectText: rolesReduxArr[3].name,
      gltf: this.modelLoader.modelsArray["npc4"],
    });
    this.standNPC5 = new StandartNPC({
      pos: { x: -86, y: 4, z: -28 },
      sketch: this,
      zoneRadius: -10,
      textObjectText: rolesReduxArr[4].name,
      gltf: this.modelLoader.modelsArray["npc3"],
    });
    this.npcArray = [
      this.bossNPC,
      this.standNPC,
      this.standNPC2,
      this.standNPC3,
      this.standNPC4,
      this.standNPC5,
    ];
  }

  sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  setupMap() {
    const gltf = this.modelLoader.modelsArray["map"];
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
  }

  startBattle(NPC = BossNPC) {
    this.player.mode = "battle";
    this.player.addRotateEvent(NPC.object.position);
    let playerReturnPos = this.player.object.position
      .clone()
      .sub(NPC.object.position)
      .normalize()
      .multiplyScalar(13)
      .add(NPC.object.position);
    this.player.addReturnEvent(playerReturnPos);
    NPC.standPos = NPC.object.position.clone();
    NPC.mode = "battle";
    let adjustVec = this.player.object.position
      .clone()
      .sub(NPC.object.position)
      .normalize()
      .multiplyScalar(17);
    let adjustVec2 = new Vector2(adjustVec.x, adjustVec.z);
    adjustVec2.rotateAround(new Vector2(), Math.PI / 10);
    this.camOperator.removeEvent("NPCzoomIn");
    this.camOperator.addNPCzoomIn({
      targetPos: NPC.object.position,
      adjustPosition: new Vector3(adjustVec2.x, 3, adjustVec2.y),
    });
    // setTimeout(() => this.player.hitBoss(NPC.object.position), 5000);
    // setTimeout(() => NPC.hitPlayer(this.player.object.position), 10000);
    // setTimeout(() => this.player.hitBoss(NPC.object.position), 15000);
    // setTimeout(() => this.player.hitBoss(NPC.object.position), 20000);
  }

  processInteraction(NPC = StandartNPC) {
    if (NPC.mode == "prepToInteract" || NPC.mode == "interact") {
      if (this.KeyHandler.key.e.click && this.player.mode == "freeWalk") {
        store.dispatch(setUiState(UiStates.CHAT));
        //TODO: chat -true
        //TODO: hint - false
        this.player.mode = "interact";
        NPC.mode = "interact";
        this.player.addRotateEvent(NPC.object.position);
        let NpcToPlayerVec = this.player.object.position
          .clone()
          .sub(NPC.object.position);
        let x1 = this.camOperator.getDistancedVector2Fixed(
          NpcToPlayerVec,
          NPC.scale + 4,
          Math.PI / 3.4
        );
        this.camOperator.addNPCzoomIn({
          targetPos: NPC.object.position,
          adjustPosition: new Vector3(x1.x, NPC.size.y * NPC.scale, x1.y),
        });
      }

      //--ts--начало
      if (!this.isReduxDataGenerated) {
        const reduxData = GenerateWordsById(3); //вместо 2 -> вызов метода с взятием роли у NPS (return int)
        console.log("->", reduxData);
        this.isReduxDataGenerated = true;
      }

      if (this.KeyHandler.key.esc.click && this.player.mode == "interact") {
        store.dispatch(setUiState(UiStates.NONE));
        //TODO: chat - false
        this.player.mode = "freeWalk";
        this.player.moveEvent = [];
        NPC.mode = "prepToInteract";

        this.camOperator.addNPCzoomOut();
      }
    }
  }

  processBattle(NPC = BossNPC) {
    if (NPC.mode == "prepToInteract" || NPC.mode == "interact") {
      if (this.KeyHandler.key.e.click && this.player.mode == "freeWalk") {
        store.dispatch(setUiState(UiStates.FIGHT));
        //TODO : battleUI - true
        //TODO : hint - false
        this.startBattle(NPC);
      }
    } else if (NPC.mode == "battle") {
      NPC.updateBattle();
      if (this.KeyHandler.key.esc.click && this.player.mode == "battle") {
        this.player.mode = "freeWalk";
        store.dispatch(setUiState(UiStates.NONE));
        // setBattleVisibility(false);
        //TODO : battleUI - false
        this.player.moveEvent = [];
        NPC.addEvents = [];
        NPC.actionEvents = [];
        NPC.mode = "prepToInteract";
        this.camOperator.addNPCzoomOut();
      }
    }
  }

  checkPlayerSoftLockOnInteraction() {
    if (
      this.npcArray.every((NPC) => NPC.mode != "interact") &&
      this.player.mode == "interact"
    ) {
      store.dispatch(setUiState(UiStates.NONE));
      //TODO: chat - false
      this.player.mode = "freeWalk";
      this.player.moveEvent = [];

      if (this.camOperator.eternalUpate.state == 0) {
        this.camOperator.addNPCzoomOut();
      }
    }
  }

  setupPlayer() {
    let testPos = { x: -80, y: 30, z: -90 };
    this.player = new Player({
      pos: testPos,
      gltf: this.modelLoader.modelsArray["player"],
      sketch: this,
    });
  }

  update(time, delta) {
    this.labelRenderer.render(this.scene, this.camera);
    this.water.material.uniforms["time"].value += delta / 1000 / 2;
    this.stats.update();

    if (this.player.object && this.player.object.body) {
      if (this.KeyHandler.key.p.click) {
        console.log("Player position - ", this.player.object.position);
      }
      this.player.update(this.KeyHandler, delta);
      this.npcArray.forEach((Npc) => {
        Npc.update();
        if (Npc.objName != "Boss") {
          Npc.checkInteraction(this.player.object.position);
          this.processInteraction(Npc);
        } else {
          if (Npc.mode != "battle")
            Npc.checkInteraction(this.player.object.position);
          this.processBattle(Npc);
        }
      });
      this.checkPlayerSoftLockOnInteraction();
      // this.standNPC.update();
      // this.standNPC.checkInteraction(this.player.object.position);
      // this.standNPC2.update();
      // this.standNPC2.checkInteraction(this.player.object.position);
      // this.bossNPC.update();
      // if (this.bossNPC.mode != "battle")
      //   this.bossNPC.checkInteraction(this.player.object.position);

      // this.processBattle(this.bossNPC);
      // this.processInteraction(this.standNPC);
      // this.processInteraction(this.standNPC2);
      // this.processInteraction(this.bossNPC);

      this.camOperator.update(delta);
      this.KeyHandler.update();
    }

    // Проверка изменения состояния интерфейса перед вызовом dispatch
    const npcModes = this.npcArray.map((x) => x.mode);
    const hintVisible = npcModes.includes("prepToInteract");
    const uiState = hintVisible
      ? UiStates.HINT
      : this.player.mode === "battle"
      ? UiStates.FIGHT
      : this.player.mode === "interact"
      ? UiStates.CHAT // Add CHAT (without it, the default value was called)
      : UiStates.NONE;

    if (uiState !== this.previousUiState) {
      store.dispatch(setUiState(uiState));
      this.previousUiState = uiState;
      this.isReduxDataGenerated = false;
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
  constructor(sceneLoadedProp) {
    sceneLoaded = sceneLoadedProp;

    this.test = null;

    window.addEventListener("load", () => {
      PhysicsLoader("/lib/ammo/kripken", () => {
        this.test = new Project(config);
        // sceneLoadedProp();
      });
    });
  }
}
