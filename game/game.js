import getAssets from "./assets.js"
import { drawMap, map } from "./background.js"

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const assets = {};


getAssets()
.then((loadedAssets) => {Object.assign(assets, loadedAssets);})
.then(() => {
  drawMap(ctx, map);
});



canvas.width = 900;
canvas.height = 600;

