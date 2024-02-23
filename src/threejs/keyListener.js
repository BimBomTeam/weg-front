export class KeyHandler{
    constructor({
        window
    }){
        this.key={
            a:{
                pressed:false,
            },
            d:{
                pressed:false,
            },
            w:{
                pressed:false
            },
            s:{
                pressed:false
            }
        }
        this.window=window
        window.addEventListener('keydown', (event)=>{
            switch(event.code){
                case 'KeyA':
                    this.key.a.pressed=true
                    break
                case 'KeyD':
                    this.key.d.pressed=true
                    break
                case 'KeyW':
                    this.key.w.pressed=true
                    break
                case 'KeyS':
                    this.key.s.pressed=true
                    break
            }
        })
        window.addEventListener("keyup", (event)=>{
            switch(event.code){
                case 'KeyA':
                    this.key.a.pressed=false
                    break
                case 'KeyD':
                    this.key.d.pressed=false
                    break
                case 'KeyW':
                    this.key.w.pressed=false
                    break
                case 'KeyS':
                    this.key.s.pressed=false
                    break
            }
        })
    }

}