import { Vector3 } from "three";

export class KeyHandler {
  constructor() {
    this.key = {
      a: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
      w: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
      space: {
        pressed: false,
      },
      e: {
        pressed: false,
        click: false,
      },
      esc: {
        pressed: false,
        click: false,
      },
      p: {
        pressed: false,
        click: false,
      },
    };
    this.moveVector = new Vector3();

    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyA":
          this.key.a.pressed = true;
          this.moveVector.x = -1;
          break;
        case "KeyD":
          this.key.d.pressed = true;
          this.moveVector.x = 1;
          break;
        case "KeyW":
          this.key.w.pressed = true;
          this.moveVector.z = -1;
          break;
        case "KeyS":
          this.key.s.pressed = true;
          this.moveVector.z = 1;
          break;
        case "Space":
          this.key.space.pressed = true;
          break;
        case "KeyE":
          this.key.e.pressed = true;
          break;
        case "Escape":
          this.key.esc.pressed = true;
          break;
        case "KeyP":
          this.key.p.pressed = true;
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyA":
          this.key.a.pressed = false;
          this.moveVector.x = 0;
          break;
        case "KeyD":
          this.key.d.pressed = false;
          this.moveVector.x = 0;
          break;
        case "KeyW":
          this.key.w.pressed = false;
          this.moveVector.z = 0;
          break;
        case "KeyS":
          this.key.s.pressed = false;
          this.moveVector.z = 0;
          break;
        case "Space":
          this.key.space.pressed = false;
          break;
        case "KeyE":
          this.key.e.click = true;
          this.key.e.pressed = false;
          break;
        case "Escape":
          this.key.esc.click = true;
          this.key.esc.pressed = false;
          break;
        case "KeyP":
          this.key.p.click = true;
          this.key.p.pressed = false;
          break;
      }
    });

    // window.addEventListener("focus", (event) => {
    //   this.moveVector = new Vector3();
    //   console.log(event);
    // });
    window.oncontextmenu = (e) => {
      this.moveVector = new Vector3();
    };
  }

  update() {
    for (let element in this.key) {
      if (this.key[element].click !== undefined) {
        this.key[element].click = false;
      }
      // this.key[element].pressed = false;
    }
  }
}
