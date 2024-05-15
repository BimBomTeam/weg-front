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

    this.backgroundSong = new THREE.Audio(this.listener);

    audioLoader.load("src/assets/sounds/Peritune_Zephyr_Fields-chosic.com_.mp3", (buffer) => {
      this.backgroundSong.setBuffer(buffer);
      this.backgroundSong.setLoop(true);
      this.backgroundSong.setVolume(0.01);
    });
  }
}