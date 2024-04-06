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
    };
    this.moveDirections = {
      moveLeft: 0,
      moveRight: 0,
      moveForward: 0,
      moveBackward: 0,
    };
    //   this.window = window;
    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyA":
          this.key.a.pressed = true;
          this.moveDirections.moveRight = 1;
          break;
        case "KeyD":
          this.key.d.pressed = true;
          this.moveDirections.moveLeft = 1;
          break;
        case "KeyW":
          this.key.w.pressed = true;
          this.moveDirections.moveForward = 1;
          break;
        case "KeyS":
          this.key.s.pressed = true;
          this.moveDirections.moveBackward = 1;
          break;
        case "Space":
          this.key.space.pressed = true;
          break;
        case "KeyE":
          this.key.e.pressed = true;
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyA":
          this.key.a.pressed = false;
          this.moveDirections.moveRight = 0;
          break;
        case "KeyD":
          this.key.d.pressed = false;
          this.moveDirections.moveLeft = 0;
          break;
        case "KeyW":
          this.key.w.pressed = false;
          this.moveDirections.moveForward = 0;
          break;
        case "KeyS":
          this.key.s.pressed = false;
          this.moveDirections.moveBackward = 0;
          break;
        case "Space":
          this.key.space.pressed = false;
          break;
        case "KeyE":
          this.key.e.click = true;
          this.key.e.pressed = false;
          break;
      }
    });
  }

  update() {
    for (let element in this.key) {
      if (this.key[element].click !== undefined) {
        this.key[element].click = false;
      }
    }
  }
}