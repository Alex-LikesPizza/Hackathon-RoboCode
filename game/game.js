import { canvas, ctx } from "./setup.js"
import getAssets from "./assets.js"
import { Diamond, Player, Door } from "./classes.js"
import { Level, levelsProperties } from "./levels.js"

window.settings = {
  gameSpeed: 60,
  animationSpeed: 60
}

const levels = [null];

let level = {};
let player = {};

const collectables = [];
const actionQueue = [];

function drawCollectables() {
  collectables.forEach((collectable) => collectable.draw());
}

function setupGame(){
  for(let i = 1; i < levelsProperties.length; i++){
    const { map, diamonds, startPoz, endPoz } = levelsProperties[i]; 
    levels.push(new Level(i, levelsProperties[i].map, assets.maps));
    levels[i].map = map.map(arr => [...arr]);
    levels[i].diamonds = diamonds.map(poz => ({...poz}));
    levels[i].startPoz = {...startPoz}
    levels[i].endPoz = {...endPoz}
  };
  buildLevel(2);
  startGame();
}
function buildLevel(id){
  level = levels[id];
  level.startDoor = new Door(assets.door, level, "start");
  level.endDoor = new Door(assets.door, level, "end");
  level.diamonds.forEach(diamond => {
    collectables.push(new Diamond(diamond.x, diamond.y, assets.diamond, level));
  });
  player = new Player(level.startPoz.x, level.startPoz.y, assets.player, level);
  
}
function startGame(){
  setInterval(gameLoop, settings.animationSpeed);
  level.startDoor.access();
  player.enter()
}

function gameLoop(){
  drawPalette();
  updateAnimations();
  

  if(player.actions === 0 && !player.bumped)
  updateQueue();
}

function updateAnimations(){
  player.update();
  level.startDoor.update();
  level.endDoor.update();
  collectables.forEach((collectable) => collectable.update());
}
function drawPalette(){
  // template
  ctx.fillStyle = "#3F3851";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // background
  level.drawBackground();
  level.endDoor.draw();
  level.startDoor.draw();
  
  //foreground  
  level.drawForeground();
  
  // objects
  collectables.forEach(collectable => collectable.draw());
  player.draw();
}

function updateQueue(){
  if(actionQueue.length === 0) return;
  const action = actionQueue.shift();
  switch(action.command){
    case "moveRight": {
      let moveBy = action.moveBy;

      player.moveRight(moveBy);
      break }
    case "moveLeft": {
      let moveBy = action.moveBy;

      player.moveLeft(moveBy);
      break }
    case "jump": {
      let direction = action.direction;
      
      player.jump(direction);
      break }
    case "attack": {

      player.attack();
      break }
  }
}

window.addEventListener("keypress", (e) => {
  if(e.key === 'd'){
    actionQueue.push({
      command: "moveRight",
      moveBy: 1,
    });
  }
  else if(e.key === 'a'){
    actionQueue.push({
      command: "moveLeft",
      moveBy: 1,
    });
  }
  else if(e.key === 'w'){
    actionQueue.push({
      command: "jump",
      direction: "up",
    })
  }
  else if(e.key === 'e'){
    actionQueue.push({
      command: "jump",
      direction: "right",
    })
  }
  else if(e.key === 'q'){
    actionQueue.push({
      command: "jump",
      direction: "left",
    })
  }
  else if(e.key === 'c'){
    actionQueue.push({
      command: "attack",
    })
  }
});

const assets = {};
getAssets()
.then((loadedAssets) => {
  Object.assign(assets, loadedAssets);
  setupGame();
});
