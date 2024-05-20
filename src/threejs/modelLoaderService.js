export class ModelLoader {
  constructor() {
    this.modelsArray = [];
  }

  async loadModelsAsync(folderPath, sketch) {
    const models = [
      { path: "/Npcs/Npc1.glb", name: "npc1" },
      { path: "/Npcs/Npc2.glb", name: "npc2" },
      { path: "/Npcs/Npc3.glb", name: "npc3" },
      { path: "/Npcs/Npc4.glb", name: "npc4" },
      { path: "/Npcs/Npc5.glb", name: "npc5" },
      { path: "/Boss/Boss.glb", name: "boss" },
      { path: "/player/Player.glb", name: "player" },
      { path: "/map1/BigWorld.glb", name: "map" },
    ];

    for (let index = 0; index < models.length; index++) {
      const modelInfo = models[index];
      await sketch.load.gltf(folderPath + modelInfo.path).then((gltf) => {
        this.modelsArray[modelInfo.name] = gltf;
      });
    }
  }
}
