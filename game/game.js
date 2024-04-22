import { canvas, ctx, blackout, drawText } from "./canvas.js"
import getAssets from "./assets.js"
import { Diamond, Player, Door } from "./classes.js"
import { Level, levelsProperties } from "./levels.js"

window.settings = {
  gameSpeed: 120,
  animationSpeed: 60,

  currentLevel: 0,
  blackoutLevel: 1,
  gameInterval: null,
}

const levels = [null];

let level = {};
let player = {};

const collectables = [];
const actionQueue = [
  //lvl1
  {
    command: "moveLeft",
    moveBy: 1,
  },
  {
    command: "moveRight",
    moveBy: 10,
  },
  {
    command: "moveLeft",
    moveBy: 1,
  },
  {
    command: "enter"
  },

  // lvl 2
  {
    command: "moveRight",
    moveBy: 4,
  },
  {
    command: "jump",
    direction: "up"
  },
  {
    command: "jump",
    direction: "left"
  },
  {
    command: "jump",
    direction: "right"
  },
  {
    command: "jump",
    direction: "right"
  },
  {
    command: "moveRight",
    moveBy: 4
  },
];

function setupGame(){
  for(let i = 1; i < levelsProperties.length; i++){
    const { map, diamonds, startPoz, endPoz } = levelsProperties[i]; 
    levels.push(new Level(i, levelsProperties[i].map, assets.maps));
    levels[i].map = map.map(arr => [...arr]);
    levels[i].diamonds = diamonds.map(poz => ({...poz}));
    levels[i].startPoz = {...startPoz}
    levels[i].endPoz = {...endPoz}
  };
  advance(settings.currentLevel);
}
function advance(){
  clearInterval(settings.gameInterval);
  buildLevel(++settings.currentLevel);
}
function buildLevel(id){
  level = levels[id];
  level.finished = false;
  level.starting = true;

  level.startDoor = new Door(assets.door, level, "start");
  level.endDoor = new Door(assets.door, level, "end");

  level.diamonds.forEach(diamond => {
    collectables.push(new Diamond(diamond.x, diamond.y, assets.diamond, level));
  });
  level.collectables = collectables;
  player = new Player(level.startPoz.x, level.startPoz.y, assets.player, level);
  level.player = player;
  startGame();
}
function startGame(){
  settings.gameInterval = setInterval(gameLoop, settings.animationSpeed);
  level.startDoor.enter();
  player.enter()
}

function gameLoop(){
  drawPalette();
  updateAnimations();

  if(level.starting){
    if(blackout(false)) level.starting = false;
    
    return;
  }
  if(level.finished){
    if(blackout(true)) advance();
    return;
  }
  checks();
  

  if(player.actions === 0 && !player.bumped)
  updateQueue();
}

function drawPalette(){
  // template
  ctx.fillStyle = "rgb(63, 56, 81)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // background
  level.drawBackground();
  level.endDoor.draw();
  level.startDoor.draw();
  
  // foreground  
  level.drawForeground();
  
  // objects
  collectables.forEach(collectable => collectable.draw());
  player.draw();

  // HUD
  drawText(level);
  // exit
  ctx.fillStyle = `rgba(63, 56, 81, ${settings.blackoutLevel})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function checks(){
  collectables.forEach(collectable => {collectable.checkCollect()});
  if(!level.endDoor.isOpen && collectables.length === 0) {
      level.endDoor.open();
  }
}
function updateAnimations(){
  player.update();
  level.startDoor.update();
  level.endDoor.update();
  collectables.forEach((collectable) => collectable.update());
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
    case "enter": {

      player.exit();
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
  else if(e.key === " "){
    actionQueue.push({
      command: "enter"
    })
  }
});

const assets = {};
getAssets()
.then((loadedAssets) => {
  Object.assign(assets, loadedAssets);
  setupGame();
});
