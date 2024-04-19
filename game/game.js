import getAssets from "./assets.js"

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const assets = {};


getAssets()
.then((loadedAssets) => {
  Object.assign(assets, loadedAssets);

  console.log(assets);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(assets.tileSet.decorations, 0, 0, canvas.width, canvas.height);
});

canvas.width = 900;
canvas.height = 600;

