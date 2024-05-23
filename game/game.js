import { canvas, ctx, blackout, drawText } from "./canvas.js"
import getAssets from "./assets.js"
import { Diamond, Player, Door } from "./classes.js"
import { Level, levelsProperties } from "./levels.js"
import { compile } from "./compiler.js"
import { getIfStatementValue } from "./compiler.js"



const levels = [null];

let level = {};
let player = {};

let collectables = [];
let actionQueue = [
  // //lvl1
  // {
  //   command: "moveLeft",
  //   moveBy: 1,
  // },
  // {
  //   command: "moveRight",
  //   moveBy: 10,
  // },
  // {
  //   command: "moveLeft",
  //   moveBy: 1,
  // },
  // {
  //   command: "enter"
  // },

  // // lvl 2
  // {
  //   command: "moveRight",
  //   moveBy: 4,
  // },
  // {
  //   command: "jump",
  //   direction: "up"
  // },
  // {
  //   command: "jump",
  //   direction: "left"
  // },
  // {
  //   command: "jump",
  //   direction: "right"
  // },
  // {
  //   command: "jump",
  //   direction: "right"
  // },
  // {
  //   command: "moveRight",
  //   moveBy: 4
  // },
];
window.settings = {
  gameSpeed: 70,
  animationSpeed: 60,

  currentLevel: 0,
  blackoutLevel: 1,
  gameInterval: null,
  actionQueue: actionQueue,

  gameRunning: false,
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
  advance(settings.currentLevel);
}
function advance(){
  if(settings.currentLevel !== 0) endGame();
  settings.currentLevel++;
  buildLevel();
}


function buildLevel(){
  level = levels[settings.currentLevel];
  level.finished = false;

  level.startDoor = new Door(assets.door, level, "start");
  level.endDoor = new Door(assets.door, level, "end");
  collectables = [];
  level.diamonds.forEach(diamond => {
    collectables.push(new Diamond(diamond.x, diamond.y, assets.diamond, level));
  });
  level.collectables = collectables;
  player = new Player(level.startPoz.x, level.startPoz.y, assets.player, level);
  level.player = player;
  settings.blackoutLevel = 0;
  gameLoop();
}
function startGame(){
  const code = document.getElementById("game-code").value;
  settings.gameRunning = true;
  actionQueue = compile(code);

  // settings.blackoutLevel = 1;
  settings.gameInterval = setInterval(gameLoop, settings.animationSpeed);
}
function endGame(){
  settings.gameRunning = false;
  clearInterval(settings.gameInterval);
  buildLevel();
}

function gameLoop(){
  drawPalette();
  if(settings.gameRunning){
    updateAnimations();
    checks();
    if(player.actions === 0 && !player.bumped)
      actionQueue = updateQueue(actionQueue, level);
  }
  if(level.finished){
    advance();
  }

  if(settings.gameRunning){
    if(blackout(false)) level.starting = false;
    
    return;
  }
  // if(level.finished){
  //   if(blackout(true)) advance();
  //   return;
  // }
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

function updateQueue(actionQueue, level){
  let player = level.player;
  if(actionQueue === null){
    endGame();
    return;
  }
  console.log(actionQueue);
  if(!actionQueue || actionQueue.length === 0) return;
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
      break;
    }
    case "end":{

      let success = player.exit();
      if(success === null)
        endGame();

      break;
    }
    case "compound": {
      let actions = action.actions;
      actionQueue.unshift(...actions);
      break;
    }
    case "if":{
      let args = action.args;

      let completeNextAction = getIfStatementValue(args, level);
      if(completeNextAction) actionQueue = updateQueue(actionQueue, level);
      else actionQueue.shift();
      break;
    }
    case "while":{
      let args = action.args;

      let completeNextAction = getIfStatementValue(args, level);
      if(completeNextAction){
        actionQueue.unshift(action);
        actionQueue.unshift(actionQueue[1]);
      }
      else{
        actionQueue.shift();
      }
      console.log(actionQueue, action);
      break;
    }
  }
  
  return actionQueue;
}

window.addEventListener("keypress", (e) => {
  
  if(e.key === ";"){
    startGame();
  }
  // if(e.key === 'd'){
  //   actionQueue.push({
  //     command: "moveRight",
  //     moveBy: 1,
  //   });
  // }
  // else if(e.key === 'a'){
  //   actionQueue.push({
  //     command: "moveLeft",
  //     moveBy: 1,
  //   });
  // }
  // else if(e.key === 'w'){
  //   actionQueue.push({
  //     command: "jump",
  //     direction: "up",
  //   })
  // }
  // else if(e.key === 'e'){
  //   actionQueue.push({
  //     command: "jump",
  //     direction: "right",
  //   })
  // }
  // else if(e.key === 'q'){
  //   actionQueue.push({
  //     command: "jump",
  //     direction: "left",
  //   })
  // }
  // else if(e.key === 'c'){
  //   actionQueue.push({
  //     command: "attack",
  //   })
  // }
  // else if(e.key === " "){
  //   actionQueue.push({
  //     command: "enter"
  //   })
  // }
});

const assets = {};
getAssets().then((loadedAssets) => {
  Object.assign(assets, loadedAssets);
  console.log("a");
  setupGame();
});