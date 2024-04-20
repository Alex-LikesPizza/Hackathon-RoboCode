import { canvas, ctx } from "./setup.js"
import getAssets from "./assets.js"
import { Diamond, Player } from "./classes.js"
import { Level, levelsProperties } from "./levels.js"

window.gameSpeed = 70;

const levels = [null];
let level = {};
let map = [];
let player = {};
const collectables = [];

function updateCollectables(){
  collectables.forEach((collectable) => collectable.update());
}
function drawCollectables() {
  collectables.forEach((collectable) => collectable.draw());
}

function setupGame(){
  for(let i = 1; i < levelsProperties.length; i++){
    const { map, diamonds, startPoz } = levelsProperties[i]; 
    levels.push(new Level(i, levelsProperties[i].map, assets.maps[`lvl${i}`]));
    levels[i].map = map.map(arr => [...arr]);
    levels[i].diamonds = diamonds.map(poz => ({...poz}));
    levels[i].startPoz = {...startPoz}
  };
  buildLevel(1);
  startGame();
}
function buildLevel(id){
  level = levels[id];
  map = level.map.map(row => [...row]);
  level.diamonds.forEach(diamond => {
    collectables.push(new Diamond(diamond.x, diamond.y, assets.diamond, level));
  });
  player = new Player(level.startPoz.x, level.startPoz.y, assets.player, level);
}
function startGame(){
  setInterval(gameLoop, window.gameSpeed);
}

function gameLoop(){
  level.draw();
  drawCollectables();
  player.draw();
  player.update();
  updateCollectables();
}

const assets = {};
getAssets()
.then((loadedAssets) => {
  Object.assign(assets, loadedAssets);
  setupGame();
});

window.addEventListener("keypress", (e) => {
  if(e.key === 'd'){
    player.moveRight(1);
  }
  else if(e.key === 'a'){
    player.moveLeft(1);
  }
  else if(e.key === 'w'){
    player.jump("up");
  }
  else if(e.key === 'e'){
    player.jump("right");
  }
  else if(e.key === 'q'){
    player.jump("left");
  }
});