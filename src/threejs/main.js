import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { KeyHandler } from "./keyListener";
import { Platform } from "./scene";
import { TestPlayer } from "./scene";
import MyCamera from "./myCamera.js";

//#setting scene camera renderer
export function mainGameFunc(changeUiVisibility) {
  const scene = new THREE.Scene();

  const canvas = document.querySelector("#webgl");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  //#setting lihgts
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.y = 4;
  light.position.z = -2;
  light.position.x = -1;
  light.castShadow = true;
  scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  //#adding platform
  const plat = new Platform({
    sizeProperties: { width: 10, height: 1, depth: 10 },
    position: { x: -5, y: -1, z: -5 },
    color: 0xff0000,
  });
  plat.receiveShadow = true;
  scene.add(plat);

  //#adding player

  // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  // const player = new THREE.Mesh( geometry, material );

  const player = new TestPlayer({
    sizeProperties: { width: 1, height: 1, depth: 1 },
    position: { x: 0, y: 0, z: 0 },
  });
  player.castShadow = true;
  scene.add(player);

  const box = new TestPlayer({
    sizeProperties: { width: 1, height: 1, depth: 1 },
    position: { x: -3, y: 0, z: -3 },
  });
  scene.add(box);

  // camera.position.set(2, 2, 10);

  const camera = new MyCamera(player.position);

  //#camera controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.enabled = false;

  //movement
  const keyHl = new KeyHandler(window);

  const raycaster = new THREE.Raycaster();

  function isNearNpc() {
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
  function animate() {
    requestAnimationFrame(animate);

    player.velocity.x = 0;
    player.velocity.z = 0;

    if (keyHl.key.a.pressed) player.velocity.x = -player.speed;
    else if (keyHl.key.d.pressed) player.velocity.x = player.speed;

    if (keyHl.key.w.pressed) player.velocity.z = -player.speed;
    else if (keyHl.key.s.pressed) player.velocity.z = player.speed;

    player.update();

    camera.cameraUpdate(player.position);
    renderer.render(scene, camera);

    isNearNpc();
  }
  animate();
}
