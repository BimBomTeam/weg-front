import * as THREE from "three";

export default class SoundManager {
  constructor(camera) {
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);

    this.loadSounds();
    
  }

  loadSounds() {
    const audioLoader = new THREE.AudioLoader();

    this.sandFootstepSound = new THREE.Audio(this.listener);

    audioLoader.load("src/assets/sounds/sandFootstep.wav", (buffer) => {
      this.sandFootstepSound.setBuffer(buffer);
      this.sandFootstepSound.setLoop(true);
      this.sandFootstepSound.setVolume(0.1);
    });

    this.waterSplashSound = new THREE.Audio(this.listener);

    audioLoader.load("src/assets/sounds/waterSplash.wav", (buffer) => {
      this.waterSplashSound.setBuffer(buffer);
      this.waterSplashSound.setLoop(false);
      this.waterSplashSound.setVolume(0.3);
    });
  }
}