import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

// export function loadModel(materialPath, modelPath) {
//   return new Promise((resolve, reject) => {
//     const mtlLoader = new MTLLoader();
//     mtlLoader.load(
//       materialPath,
//       (mtl) => {
//         mtl.preload();
//         const objLoader = new OBJLoader();
//         objLoader.setMaterials(mtl);
//         objLoader.load(
//           modelPath,
//           (obj) => {
//             resolve(obj);
//           },
//           null,
//           reject
//         );
//       },
//       null,
//       reject
//     );
//   });
// }

export async function loadModel(materialPath, modelPath) {
  const mtlLoader = new MTLLoader();
  const mtl = await new Promise((resolve, reject) => {
    mtlLoader.load(materialPath, resolve, undefined, reject);
  });
  mtl.preload();
  const objLoader = new OBJLoader();
  const obj = await new Promise((resolve, reject) => {
    objLoader.setMaterials(mtl);
    objLoader.load(modelPath, resolve, undefined, reject);
  });
  return obj;
}
