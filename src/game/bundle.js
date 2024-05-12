/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets.js":
/*!*******************!*\
  !*** ./assets.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__() {
  const assets = {
    player: {
      attack: new Image(),
      doorIn: new Image(),
      doorOut: new Image(),
      ground: new Image(),
      idle: new Image(),
      die: new Image(),
      run: new Image(),
      jump: new Image(),
      fall: new Image(),
      hit: new Image(),
    },
    box: {
      boxPiece1: new Image(),
      boxPiece2: new Image(),
      boxPiece3: new Image(),
      boxPiece4: new Image(),
      hit: new Image(),
      idle: new Image(),
    },
    door: {
      closing: new Image(),
      opening: new Image(),
      idle: new Image(),
    },
    diamond:{
      idle: new Image(),
      disappear: new Image(),
    },
    maps: {
      lvl1Foreground: new Image(),
      lvl1Background: new Image(),
      lvl2Foreground: new Image(),
      lvl2Background: new Image(),
      lvl3Background: new Image(),
      lvl3Foreground: new Image(),
      lvl4Background: new Image(),
      lvl4Foreground: new Image(),
    }
  };

  let promises = [];
  for(let folder in assets){
    for(let file in assets[folder]){
      let image = assets[folder][file];
      image.src = `./sprites/${folder}/${file}.png`;

      let promise = new Promise((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = (event) => {
          console.error(`Error loading image ${image.src}:`, event);
          reject(event);
        };
      });

      promises.push(promise);
    }
  }

  return Promise.all(promises).then(() => assets);
}

/***/ }),

/***/ "./canvas.js":
/*!*******************!*\
  !*** ./canvas.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   blackout: () => (/* binding */ blackout),
/* harmony export */   canvas: () => (/* binding */ canvas),
/* harmony export */   ctx: () => (/* binding */ ctx),
/* harmony export */   drawText: () => (/* binding */ drawText)
/* harmony export */ });
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

function blackout(isIncreasing){
  settings.blackoutLevel += 0.1 * (isIncreasing? 1 : -1);
  if(isIncreasing && settings.blackoutLevel >= 0.99){
    settings.blackoutLevel = 1;
    return true;
  }
  if(!isIncreasing && settings.blackoutLevel <= 0.01){
    settings.blackoutLevel = 0;
    return true;
  }

  return false;
}

function drawText(level) {
  const levelId = String(level.nr).padStart(2, '0');
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.strokeStyle = "rgb(110, 110, 110)";
  ctx.lineWidth = 5;
  ctx.font = `20px "Press Start 2P", monospace`;

  const x = 20;
  const y = canvas.height - 20;
  ctx.strokeText(`Level ${levelId}`, x, y);
  ctx.fillText(`Level ${levelId}`, x, y);
}

/***/ }),

/***/ "./classes.js":
/*!********************!*\
  !*** ./classes.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Diamond: () => (/* binding */ Diamond),
/* harmony export */   Door: () => (/* binding */ Door),
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas.js */ "./canvas.js");
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors.js */ "./errors.js");


class GameObject {
  constructor(pozX, pozY, assets, level, totalFrames) {
    this.x = pozX;
    this.y = pozY;
    this.level = level;
    this.boxSizeX = level.boxSizeX;
    this.boxSizeY = level.boxSizeY;
    this.assets = assets;
    this.asset = assets.idle;
    this.totalFrames = totalFrames;
    this.currentFrame = 0;
    this.frameWidth = this.asset.width / this.totalFrames;
    this.frameHeight = this.asset.height;
  }
  
  update() {
    if(this.animationStasis && this.currentFrame === this.totalFrames - 1) return;
    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
  }
}
class Door extends GameObject {
  constructor(assets, level, type){
    super(level[`${type}Poz`].x, level[`${type}Poz`].y, assets, level, 1);
    this.type = type;
    this.animationStasis = false;
  }

  draw() {
    _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.drawImage(
      this.asset,
      this.frameWidth * this.currentFrame,
      0,
      this.frameWidth,
      this.frameHeight,
      (this.x - 0.1 / 2) * this.boxSizeX,
      (this.y - 0.6) * this.boxSizeY,
      this.boxSizeX * 1.1,
      this.boxSizeY * 1.6
    );
  }
  open(){
    this.isOpen = true;
    this.animationStasis = true;
    this.openingAnimation();
  }
  close(){
    this.animationStasis = false;
    this.closingAnimation();
    setTimeout(() => this.idle(), this.totalFrames * settings.animationSpeed);
  }
  idle(){
    this.animationStasis = false;
    this.idleAnimation();
  }
  enter() {
    this.open();
    setTimeout(() => {
      this.close();
    }, (this.totalFrames + 8) * settings.animationSpeed);
  }
  exit() {
    this.level.finished = true;
    this.close();
  }

  closingAnimation(){
    this.asset = this.assets.closing;
    this.totalFrames = 3;
    this.currentFrame = 0;
  }
  openingAnimation(){
    this.asset = this.assets.opening;
    this.totalFrames = 5;
    this.currentFrame = 0;
  }
  idleAnimation(){
    this.asset = this.assets.idle;
    this.totalFrames = 1;
    this.currentFrame = 0;
  }

}
class Diamond extends GameObject {
  constructor(pozX, pozY, asset, level) {
    super(pozX, pozY, asset, level, 10);
  }
  
  draw() {
      _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.drawImage(
      this.asset,
      this.frameWidth * this.currentFrame,
      0,
      this.frameWidth,
      this.frameHeight,
      this.x * this.boxSizeX + this.boxSizeX * 0.07,
      this.y * this.boxSizeY + this.boxSizeY * 0.25,
      this.boxSizeX / 1.4,
      this.boxSizeY / 1.4
    );
  }
  
  checkCollect(){
    if(Math.round(this.level.player.x)  === this.x && Math.round(this.level.player.y)  === this.y){
      this.collect();
    }
  }

  collect(){
    const index = this.level.collectables.indexOf(this);
    this.level.collectables.splice(index, 1);
  }
}

class Player extends GameObject {
  constructor(pozX, pozY, asset, level) {
    super(pozX, pozY, asset, level, 11);
    this.facing = "right";
    this.bumped = false;
    this.actions = 0;
  }

  draw() {
  if(this.facing === "right"){
      _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.drawImage(
        this.asset,
        this.frameWidth * this.currentFrame,
        0,
        this.frameWidth,
        this.frameHeight,
        this.x * this.boxSizeX - this.boxSizeX * 0.5,
        this.y * this.boxSizeY - this.boxSizeY * 0.87,
        this.boxSizeX * 2.5,
        this.boxSizeY * 2.5
      )
    }
    else if(this.facing === "left"){
      _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.save();
      _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.scale(-1, 1);
      _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.drawImage(
        this.asset,
        this.frameWidth * this.currentFrame,
        0,
        this.frameWidth,
        this.frameHeight,
        -((this.x + 2) * this.boxSizeX - this.boxSizeX * 0.5),
        this.y * this.boxSizeY - this.boxSizeY * 0.87,
        this.boxSizeX * 2.5,
        this.boxSizeY * 2.5
      )
      _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.restore();
    }
  }
  checkBottomCollision() {
    let row = Math.floor(this.y) + 1;
    let col = Math[this.facing === "left"? "floor" : "ceil"](this.x);
    if(!this.level.map[row]) return true;
    return this.level.map[row][col] !== 0

  }
  checkLeftCollision(jump = false) {
    let row = Math.floor(this.y - jump);
    let col = Math.floor(this.x - jump + 0.01);
    return this.level.map[row][col] === 1
  }
  checkRightCollision(jump = false){
    let row = Math.floor(this.y - jump);
    let col = Math.ceil(this.x + jump);
    return this.level.map[row][col] === 1
  }
  checkTopCollision(){
    let row = Math.floor(this.y - 0.01);
    let col = Math[this.facing === "left"? "ceil" : "floor"](this.x);
    if(!this.level.map[row]) return true;
    return this.level.map[row][col] === 1 || this.level.map[row][col] === 3;
  }
  idle(){
    if(this.x % 1 || this.y % 1)
      console.error("Decimal pozition detected in idle state: ",{x: this.x, y: this.y});
    this.falling = false;
    this.idleAnimation();
  }
  fall(jump = false) {
    this.actions++;
    let gravity = jump ? 0.1 : 0.08;
    let velocity = 0;
    let speed = settings.gameSpeed;
    this.falling = true;
    this.fallAnimation();
  
    const moving = setInterval(() => {
      this.y += velocity;
      velocity += gravity;
      if (this.checkBottomCollision()) {
        this.y = Math.floor(this.y);
        clearInterval(moving);
        this.idle();
        this.actions--;
        return;
      }
    }, speed);
  }
  jump(direction) {
    if(!(0,_errors_js__WEBPACK_IMPORTED_MODULE_1__.is_direction)(direction) ){
      return;
    }
    this.currentAction = "jump";
    this.actions++;
    let maxHeight = 0.75;
    let gravity = 0.15;
    let velocity = Math.sqrt(maxHeight * gravity * 2);
    let speed = settings.gameSpeed;
    
    setTimeout(() => {
      if(direction === "left") this.moveLeft(1, true);
      if(direction === "right") this.moveRight(1, true);
    }, settings.gameSpeed * 0.5)

    this.jumpAnimation();
    const moving = setInterval(() => {
      if (velocity <= 0) {
        clearInterval(moving)
        this.fall(true);
        this.actions--;
        return;
      }
      if (this.checkTopCollision()){
        clearInterval(moving);
        this.die();
        this.fall();
        return;
      }
      this.y -= velocity;
      velocity -= gravity;
    }, speed);
  }
  moveRight(x, jump = false){
    if(!(0,_errors_js__WEBPACK_IMPORTED_MODULE_1__.is_UINT)(x)){
      return;
    }
    this.actions++;
    this.facing = "right";
    let speed = settings.gameSpeed * 0.5;
    let step = 0.1;
    let i = 0;
    
    if(!jump)this.runAnimation();
    if(jump && this.checkRightCollision(true)){
      this.die();
      this.actions--;
      return;
    };
    
    const moving = setInterval(() => {
      this.x += step;
      if(i >= x / step){
        this.x = Math.floor(this.x);
        clearInterval(moving);
        if(!jump && !this.falling)this.idle();
        this.actions--;
      }
      else if(!jump && this.checkRightCollision()){
        clearInterval(moving);
        this.die();
        this.actions--;
      };
      if(!jump && !this.checkBottomCollision() && !this.falling){
        this.fall();
      }
      if(this.bumped){
        this.x -= step;
        clearInterval(moving);
        return;
      }
      i++;
    }, speed);
  }
  moveLeft(x, jump = false){
    if(!(0,_errors_js__WEBPACK_IMPORTED_MODULE_1__.is_UINT)(x)){
      return;
    }
    this.actions++;
    this.facing = "left";
    let speed = settings.gameSpeed * 0.5;
    let step = 0.1;
    let i = 0;
    
    if(!jump)this.runAnimation();
    if(jump && this.checkLeftCollision(true)){
      this.die();
      this.actions--;
      return
    };
    

    const moving = setInterval(() => {
      this.x -= step;
      if(i >= x / step){
        this.x = Math.ceil(this.x);
        clearInterval(moving);
        if(!jump && !this.falling) this.idle();
        this.actions--;
      }
      else if(!jump && this.checkLeftCollision()){
        clearInterval(moving);
        this.die();
        return;
      };
      if(!jump && !this.checkBottomCollision() && !this.falling){
        this.fall();
      }
      if(this.bumped){
        this.x += step;
        clearInterval(moving);
        return;
      }
      i++;
    }, speed);
  }
  attack(){
    this.attackAnimation();
    this.actions++;
    this.animationStasis = true;
    setTimeout(() => {
      this.idle()
      this.actions--;
      this.animationStasis = false;
    }, settings.animationSpeed * this.totalFrames);
  }
  die(){
    (0,_errors_js__WEBPACK_IMPORTED_MODULE_1__.bumped)();
    this.bumped = true;
    this.dieAnimation();
    this.x = Math[this.facing === "left"? "ceil" : "floor"](this.x);
    this.y = Math.floor(this.y);
    this.update = () => {
      if(this.currentFrame === this.totalFrames - 1) return;
      this.currentFrame = (this.currentFrame + 1);
    }
  }
  enter(){
    this.level.startDoor.enter();
    this.actions++;
    const drawCpy = this.draw;
    this.draw = () => {};
    
    setTimeout(() => {
      this.draw = drawCpy;
      this.doorOut()
      
      setTimeout(() => {
        this.idle();
        this.actions--;
      }, this.totalFrames * settings.animationSpeed)
    }, 5 * settings.animationSpeed);
  }
  exit(){
    if(!(0,_errors_js__WEBPACK_IMPORTED_MODULE_1__.is_validExit)(this)){
      return null;
    }
    this.level.endDoor.exit();
    this.actions++;
    this.doorIn();
    setTimeout(() => {
      this.actions--;
      this.draw = () => {};
      this.level.endDoor.exit();
    }, this.totalFrames * settings.animationSpeed);
  }
  doorIn(){
    this.doorInAnimation();
  }
  doorOut(){
    this.doorOutAnimation();
  }
  runAnimation(){
    if(this.bumped)return;
    this.asset = this.assets.run;
    this.totalFrames = 8;
    this.currentFrame = 0;
  }
  idleAnimation(){
    if(this.bumped) return;
    this.asset = this.assets.idle;
    this.totalFrames = 11;
    this.currentFrame = 1;
  }
  jumpAnimation(){
    if(this.bumped) return;
    this.asset = this.assets.jump;
    this.currentFrame = 0;
    this.totalFrames = 1;
  }
  fallAnimation(){
    if(this.bumped) return;
    this.asset = this.assets.fall;
    this.currentFrame = 0;
    this.totalFrames = 1;
  }
  attackAnimation(){
    if(this.bumped) return;
    this.asset = this.assets.attack;
    this.currentFrame = 0;
    this.totalFrames = 3;
  }
  dieAnimation(){
    this.asset = this.assets.die;
    this.currentFrame = 0;
    this.totalFrames = 4;
  }
  doorInAnimation(){
    this.asset = this.assets.doorIn;
    this.currentFrame = 0;
    this.totalFrames = 8;
  }
  doorOutAnimation(){
    this.asset = this.assets.doorOut;
    this.currentFrame = 0;
    this.totalFrames = 8;
  }
}



/***/ }),

/***/ "./compiler.js":
/*!*********************!*\
  !*** ./compiler.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compile: () => (/* binding */ compile)
/* harmony export */ });
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors.js */ "./errors.js");


function tokenizeCode(code){
  let codeRows = code.split('\n');
  codeRows = codeRows.map(row => row.split('#')[0].replace(/\s+/g, ' ').trim());
  return codeRows;
}

function compileCode(tokenizedCode){
  let actions = [];
  for (let tokenizedRow of tokenizedCode) {
    if(!(0,_errors_js__WEBPACK_IMPORTED_MODULE_0__.isStatement)(tokenizedRow)) return null;
    if(tokenizedRow === "") continue;
    const tokens = tokenizedRow.split(" ");
    let command = tokens.shift();
    let args = [...tokens];
    let action = {};
    switch(command){
      case "walk": {
        let command = args[0] === "right"? "moveRight" : "moveLeft";
        // if(actions[actions.length - 1].command === command) {
        //   actions[actions.length - 1].moveBy++;
        //   continue;
        // }
        action = {command, moveBy: 1};
        break;
      }
      case "jump": {
        let direction = args[0];
        action = {command: "jump", direction};
        break;
      }
      case "attack": {
        action = {command: "attack"};
        break;
      }
      case "start": {
        action = {command: "start"};
        break;
      }
      case "end": {
        action = {command: "end"};
        break;
      }
      case "if": {
        action = compileIfStatement(args);
        break;
      }
    }
    actions.push(action);
  }

  return actions;
}

function compileIfStatement(tokens){
  let negate = false;
  /*
    if facing door/wall/diamond...
    if not facing door/wall/diamond...
    if on floor/platform...
    if on floor or facing door
    if on floor and facing wall or facing door
    if on door or facing door and on platform


  */
  for(let token of tokens){

  }
}


function compile(code){
  const tokenizedCode = tokenizeCode(code);
  const compiledCode = compileCode(tokenizedCode);

  return compiledCode;
}

/***/ }),

/***/ "./errors.js":
/*!*******************!*\
  !*** ./errors.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bumped: () => (/* binding */ bumped),
/* harmony export */   isCommand: () => (/* binding */ isCommand),
/* harmony export */   isStatement: () => (/* binding */ isStatement),
/* harmony export */   is_UINT: () => (/* binding */ is_UINT),
/* harmony export */   is_argumentNumberCorrect: () => (/* binding */ is_argumentNumberCorrect),
/* harmony export */   is_direction: () => (/* binding */ is_direction),
/* harmony export */   is_validExit: () => (/* binding */ is_validExit)
/* harmony export */ });
function invalid_UINT(x){
  console.error(x + " is not a valid positive integer");
};
function invalid_direction(direction, walking = false){
  console.error(`"${direction}" is not a valid ${walking? "walkable " : ""}direction`);
}
function invalid_doorAccessPosition(){
  console.error("You need to be on the door to access it");
}
function invalid_doorOpenState(){
  console.error("The door needs to be open to access it.\n Collect all diamonds to open it");
}
function invalid_doorType(){
  console.error("You are trying to access the wrong door");
}
function invalid_command(command){
  console.error(`"${command}" is not a valid command`);
}
function invalid_argumentNumber(exceeding){
  console.error(`${exceeding? "Too many": "Insufficient"} arguments`);
}

function is_validExit(player){
  if(player.x === player.level.startDoor.x && player.y === player.level.startDoor.y){
    invalid_doorType();
    return false;
  }
  if(player.x !== player.level.endDoor.x || player.y !== player.level.endDoor.y){
    invalid_doorAccessPosition();
    return false;
  }
  if(!player.level.endDoor.isOpen){
    invalid_doorOpenState();
    return false;
  }
  return true;
}
function is_UINT(x){
  if(!Number.isInteger(x) || x < 0){
    invalid_UINT(x);
    return false;
  }
  return true;
}
function is_direction(direction, walking = false){
  switch(direction){
    case "left":
    case "right": 
      return true;
    case "up":
      if(walking){
        invalid_direction(direction, true);
        return false;
      }
      return true;
    default:
      invalid_direction(direction);
      return false;
  }
}
function is_argumentNumberCorrect(n, argLen){
  if(argLen > n){
    invalid_argumentNumber(true);
    return false;
  }
  else if(argLen < n){
    invalid_argumentNumber(false);
    return false;
  }

  return true;
}
function bumped(){
  console.error("You bumped into a wall");
}
function isCommand(command){
  const commands = ["start", "end", "walk", "jump", "attack", ""];
  if(!commands.includes(command)){
    invalid_command(command);
    return false;
  }

  return true;
}
function isStatement(statement){
  statement = statement.split(" ");
  const command = statement.shift();
  const args = [...statement];
  if(!isCommand(command)) return false;

  let argsLen = args.length;
  switch(command){
    case "walk": {
      if(!is_argumentNumberCorrect(1, argsLen)) return false;
      if(!is_direction(args[0], true)) return false;
      return true;
    }
    case "jump": {
      if(!is_argumentNumberCorrect(1, argsLen)) return false;
      if(!is_direction(args[0])) return false;
      return true;
    }
    case "attack":
    case "start":
    case "end": {
      if(!is_argumentNumberCorrect(0, argsLen)) return false;
      return true;
    }
    case "": return true;
    default: {
      return false;
    }
    
  }
}

/***/ }),

/***/ "./levels.js":
/*!*******************!*\
  !*** ./levels.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Level: () => (/* binding */ Level),
/* harmony export */   levelsProperties: () => (/* binding */ levelsProperties)
/* harmony export */ });
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas.js */ "./canvas.js");


const levelsProperties = [
  null,
  { map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    diamonds: [
    {x: 2, y: 4}, {x: 12, y: 6}],
    startPoz: {x: 3, y: 4},
    endPoz: {x: 11, y: 6},
  },
  { map: [
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    ],
    diamonds: [
    {x: 10, y: 6}, {x: 5, y: 6}, {x: 6, y: 8}],
    startPoz: {x: 2, y: 8},
    endPoz: {x: 11, y: 6},
  },
  { 
    map: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 2, 3, 3, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 2, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    diamonds: [
    {x: 2, y: 1}, {x: 7, y: 4}, {x: 2, y: 7}],
    startPoz: {x: 7, y: 7},
    endPoz: {x: 11, y: 2},
  },{ 
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1], 
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 1], 
      [1, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 1], 
      [1, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1], 
      [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    diamonds: [
    {x: 10, y: 6}],
    startPoz: {x: 2, y: 7},
    endPoz: {x: 13, y: 2},
  },
  
]

class Level{
  constructor(nr, map, assets){
    this.sizeY = map.length;
    this.sizeX = map[0].length;
    this.map = map;
    this.boxSizeX = _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.width / this.sizeX; 
    this.boxSizeY = _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.height / this.sizeY, 
    this.assets = assets;
    this.nr = nr;
  }
  
  drawBackground(){
    let canvasSizeX = _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.width;
    let canvasSizeY = _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.height;
    _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.drawImage(this.assets[`lvl${this.nr}Background`], 0, 0, canvasSizeX, canvasSizeY);
  }
  drawForeground(){
    let canvasSizeX = _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.width;
    let canvasSizeY = _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.height;
    _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.drawImage(this.assets[`lvl${this.nr}Foreground`], 0, 0, canvasSizeX, canvasSizeY);
  }
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************!*\
  !*** ./game.js ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas.js */ "./canvas.js");
/* harmony import */ var _assets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets.js */ "./assets.js");
/* harmony import */ var _classes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes.js */ "./classes.js");
/* harmony import */ var _levels_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./levels.js */ "./levels.js");
/* harmony import */ var _compiler_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./compiler.js */ "./compiler.js");








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
  for(let i = 1; i < _levels_js__WEBPACK_IMPORTED_MODULE_3__.levelsProperties.length; i++){
    const { map, diamonds, startPoz, endPoz } = _levels_js__WEBPACK_IMPORTED_MODULE_3__.levelsProperties[i]; 
    levels.push(new _levels_js__WEBPACK_IMPORTED_MODULE_3__.Level(i, _levels_js__WEBPACK_IMPORTED_MODULE_3__.levelsProperties[i].map, assets.maps));
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

  level.startDoor = new _classes_js__WEBPACK_IMPORTED_MODULE_2__.Door(assets.door, level, "start");
  level.endDoor = new _classes_js__WEBPACK_IMPORTED_MODULE_2__.Door(assets.door, level, "end");

  level.diamonds.forEach(diamond => {
    collectables.push(new _classes_js__WEBPACK_IMPORTED_MODULE_2__.Diamond(diamond.x, diamond.y, assets.diamond, level));
  });
  level.collectables = collectables;
  player = new _classes_js__WEBPACK_IMPORTED_MODULE_2__.Player(level.startPoz.x, level.startPoz.y, assets.player, level);
  level.player = player;
  settings.blackoutLevel = 0;
  gameLoop();
}
function startGame(){
  const code = document.getElementById("game-code").value;
  settings.gameRunning = true;
  actionQueue = (0,_compiler_js__WEBPACK_IMPORTED_MODULE_4__.compile)(code);

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
      updateQueue();
  }
  if(level.finished){
    advance();
  }

  if(settings.gameRunning){
    if((0,_canvas_js__WEBPACK_IMPORTED_MODULE_0__.blackout)(false)) level.starting = false;
    
    return;
  }
  // if(level.finished){
  //   if(blackout(true)) advance();
  //   return;
  // }
}

function drawPalette(){
  // template
  _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.fillStyle = "rgb(63, 56, 81)";
  _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.fillRect(0, 0, _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.width, _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.height);
  
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
  (0,_canvas_js__WEBPACK_IMPORTED_MODULE_0__.drawText)(level);
  // exit
  _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.fillStyle = `rgba(63, 56, 81, ${settings.blackoutLevel})`;
  _canvas_js__WEBPACK_IMPORTED_MODULE_0__.ctx.fillRect(0, 0, _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.width, _canvas_js__WEBPACK_IMPORTED_MODULE_0__.canvas.height);
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
  if(actionQueue === null){
    endGame();
    return;
  }
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
    case "start":{

      player.enter()
      break;
    }
    case "end":{

      let success = player.exit();
      if(success === null)
        endGame();
      break;
    } 
  }
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
(0,_assets_js__WEBPACK_IMPORTED_MODULE_1__["default"])()
.then((loadedAssets) => {
  Object.assign(assets, loadedAssets);
  setupGame();
});


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkJBQWUsNENBQWdCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsT0FBTyxHQUFHLEtBQUs7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsVUFBVTtBQUN6RDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzlETztBQUNBO0FBQ1A7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEMsd0JBQXdCLFFBQVE7QUFDaEM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCa0M7QUFDd0M7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSxtQkFBbUIsS0FBSyxrQkFBa0IsS0FBSztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSwyQ0FBRztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sMkNBQUc7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sMkNBQUc7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFHO0FBQ1QsTUFBTSwyQ0FBRztBQUNULE1BQU0sMkNBQUc7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sMkNBQUc7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUscUJBQXFCO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsUUFBUSx3REFBWTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsUUFBUSxtREFBTztBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxRQUFRLG1EQUFPO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksa0RBQU07QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLFFBQVEsd0RBQVk7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsb0RBQVE7QUFDVjtBQUNBLEVBQUUsMkNBQUcsaUNBQWlDLHVCQUF1QjtBQUM3RCxFQUFFLDJDQUFHLGdCQUFnQiw4Q0FBTSxRQUFRLDhDQUFNO0FBQ3pDO0FBQ0E7QUFDQSx1Q0FBdUMsMkJBQTJCO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxzREFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCIsInNvdXJjZXMiOlsid2VicGFjazovL2dhbWUvLi9hc3NldHMuanMiLCJ3ZWJwYWNrOi8vZ2FtZS8uL2NhbnZhcy5qcyIsIndlYnBhY2s6Ly9nYW1lLy4vY2xhc3Nlcy5qcyIsIndlYnBhY2s6Ly9nYW1lLy4vY29tcGlsZXIuanMiLCJ3ZWJwYWNrOi8vZ2FtZS8uL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly9nYW1lLy4vbGV2ZWxzLmpzIiwid2VicGFjazovL2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9nYW1lLy4vZ2FtZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbigpe1xyXG4gIGNvbnN0IGFzc2V0cyA9IHtcclxuICAgIHBsYXllcjoge1xyXG4gICAgICBhdHRhY2s6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBkb29ySW46IG5ldyBJbWFnZSgpLFxyXG4gICAgICBkb29yT3V0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgZ3JvdW5kOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgaWRsZTogbmV3IEltYWdlKCksXHJcbiAgICAgIGRpZTogbmV3IEltYWdlKCksXHJcbiAgICAgIHJ1bjogbmV3IEltYWdlKCksXHJcbiAgICAgIGp1bXA6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBmYWxsOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgaGl0OiBuZXcgSW1hZ2UoKSxcclxuICAgIH0sXHJcbiAgICBib3g6IHtcclxuICAgICAgYm94UGllY2UxOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgYm94UGllY2UyOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgYm94UGllY2UzOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgYm94UGllY2U0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgaGl0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgaWRsZTogbmV3IEltYWdlKCksXHJcbiAgICB9LFxyXG4gICAgZG9vcjoge1xyXG4gICAgICBjbG9zaW5nOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgb3BlbmluZzogbmV3IEltYWdlKCksXHJcbiAgICAgIGlkbGU6IG5ldyBJbWFnZSgpLFxyXG4gICAgfSxcclxuICAgIGRpYW1vbmQ6e1xyXG4gICAgICBpZGxlOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgZGlzYXBwZWFyOiBuZXcgSW1hZ2UoKSxcclxuICAgIH0sXHJcbiAgICBtYXBzOiB7XHJcbiAgICAgIGx2bDFGb3JlZ3JvdW5kOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgbHZsMUJhY2tncm91bmQ6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBsdmwyRm9yZWdyb3VuZDogbmV3IEltYWdlKCksXHJcbiAgICAgIGx2bDJCYWNrZ3JvdW5kOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgbHZsM0JhY2tncm91bmQ6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBsdmwzRm9yZWdyb3VuZDogbmV3IEltYWdlKCksXHJcbiAgICAgIGx2bDRCYWNrZ3JvdW5kOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgbHZsNEZvcmVncm91bmQ6IG5ldyBJbWFnZSgpLFxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGxldCBwcm9taXNlcyA9IFtdO1xyXG4gIGZvcihsZXQgZm9sZGVyIGluIGFzc2V0cyl7XHJcbiAgICBmb3IobGV0IGZpbGUgaW4gYXNzZXRzW2ZvbGRlcl0pe1xyXG4gICAgICBsZXQgaW1hZ2UgPSBhc3NldHNbZm9sZGVyXVtmaWxlXTtcclxuICAgICAgaW1hZ2Uuc3JjID0gYC4vc3ByaXRlcy8ke2ZvbGRlcn0vJHtmaWxlfS5wbmdgO1xyXG5cclxuICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaW1hZ2Uub25sb2FkID0gKCkgPT4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIGltYWdlLm9uZXJyb3IgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGxvYWRpbmcgaW1hZ2UgJHtpbWFnZS5zcmN9OmAsIGV2ZW50KTtcclxuICAgICAgICAgIHJlamVjdChldmVudCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IGFzc2V0cyk7XHJcbn0iLCJleHBvcnQgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNhbnZhc1wiKTtcclxuZXhwb3J0IGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYmxhY2tvdXQoaXNJbmNyZWFzaW5nKXtcclxuICBzZXR0aW5ncy5ibGFja291dExldmVsICs9IDAuMSAqIChpc0luY3JlYXNpbmc/IDEgOiAtMSk7XHJcbiAgaWYoaXNJbmNyZWFzaW5nICYmIHNldHRpbmdzLmJsYWNrb3V0TGV2ZWwgPj0gMC45OSl7XHJcbiAgICBzZXR0aW5ncy5ibGFja291dExldmVsID0gMTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICBpZighaXNJbmNyZWFzaW5nICYmIHNldHRpbmdzLmJsYWNrb3V0TGV2ZWwgPD0gMC4wMSl7XHJcbiAgICBzZXR0aW5ncy5ibGFja291dExldmVsID0gMDtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd1RleHQobGV2ZWwpIHtcclxuICBjb25zdCBsZXZlbElkID0gU3RyaW5nKGxldmVsLm5yKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gIGN0eC5maWxsU3R5bGUgPSBcInJnYigyNTUsIDI1NSwgMjU1KVwiO1xyXG4gIGN0eC5zdHJva2VTdHlsZSA9IFwicmdiKDExMCwgMTEwLCAxMTApXCI7XHJcbiAgY3R4LmxpbmVXaWR0aCA9IDU7XHJcbiAgY3R4LmZvbnQgPSBgMjBweCBcIlByZXNzIFN0YXJ0IDJQXCIsIG1vbm9zcGFjZWA7XHJcblxyXG4gIGNvbnN0IHggPSAyMDtcclxuICBjb25zdCB5ID0gY2FudmFzLmhlaWdodCAtIDIwO1xyXG4gIGN0eC5zdHJva2VUZXh0KGBMZXZlbCAke2xldmVsSWR9YCwgeCwgeSk7XHJcbiAgY3R4LmZpbGxUZXh0KGBMZXZlbCAke2xldmVsSWR9YCwgeCwgeSk7XHJcbn0iLCJpbXBvcnQgeyBjdHggfSBmcm9tIFwiLi9jYW52YXMuanNcIjtcclxuaW1wb3J0IHsgYnVtcGVkLCBpc19VSU5ULCBpc19kaXJlY3Rpb24sIGlzX3ZhbGlkRXhpdCB9IGZyb20gXCIuL2Vycm9ycy5qc1wiO1xyXG5jbGFzcyBHYW1lT2JqZWN0IHtcclxuICBjb25zdHJ1Y3Rvcihwb3pYLCBwb3pZLCBhc3NldHMsIGxldmVsLCB0b3RhbEZyYW1lcykge1xyXG4gICAgdGhpcy54ID0gcG96WDtcclxuICAgIHRoaXMueSA9IHBvelk7XHJcbiAgICB0aGlzLmxldmVsID0gbGV2ZWw7XHJcbiAgICB0aGlzLmJveFNpemVYID0gbGV2ZWwuYm94U2l6ZVg7XHJcbiAgICB0aGlzLmJveFNpemVZID0gbGV2ZWwuYm94U2l6ZVk7XHJcbiAgICB0aGlzLmFzc2V0cyA9IGFzc2V0cztcclxuICAgIHRoaXMuYXNzZXQgPSBhc3NldHMuaWRsZTtcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSB0b3RhbEZyYW1lcztcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICAgIHRoaXMuZnJhbWVXaWR0aCA9IHRoaXMuYXNzZXQud2lkdGggLyB0aGlzLnRvdGFsRnJhbWVzO1xyXG4gICAgdGhpcy5mcmFtZUhlaWdodCA9IHRoaXMuYXNzZXQuaGVpZ2h0O1xyXG4gIH1cclxuICBcclxuICB1cGRhdGUoKSB7XHJcbiAgICBpZih0aGlzLmFuaW1hdGlvblN0YXNpcyAmJiB0aGlzLmN1cnJlbnRGcmFtZSA9PT0gdGhpcy50b3RhbEZyYW1lcyAtIDEpIHJldHVybjtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gKHRoaXMuY3VycmVudEZyYW1lICsgMSkgJSB0aGlzLnRvdGFsRnJhbWVzO1xyXG4gIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRG9vciBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG4gIGNvbnN0cnVjdG9yKGFzc2V0cywgbGV2ZWwsIHR5cGUpe1xyXG4gICAgc3VwZXIobGV2ZWxbYCR7dHlwZX1Qb3pgXS54LCBsZXZlbFtgJHt0eXBlfVBvemBdLnksIGFzc2V0cywgbGV2ZWwsIDEpO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMuYW5pbWF0aW9uU3Rhc2lzID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBkcmF3KCkge1xyXG4gICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgdGhpcy5hc3NldCxcclxuICAgICAgdGhpcy5mcmFtZVdpZHRoICogdGhpcy5jdXJyZW50RnJhbWUsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRoaXMuZnJhbWVXaWR0aCxcclxuICAgICAgdGhpcy5mcmFtZUhlaWdodCxcclxuICAgICAgKHRoaXMueCAtIDAuMSAvIDIpICogdGhpcy5ib3hTaXplWCxcclxuICAgICAgKHRoaXMueSAtIDAuNikgKiB0aGlzLmJveFNpemVZLFxyXG4gICAgICB0aGlzLmJveFNpemVYICogMS4xLFxyXG4gICAgICB0aGlzLmJveFNpemVZICogMS42XHJcbiAgICApO1xyXG4gIH1cclxuICBvcGVuKCl7XHJcbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XHJcbiAgICB0aGlzLmFuaW1hdGlvblN0YXNpcyA9IHRydWU7XHJcbiAgICB0aGlzLm9wZW5pbmdBbmltYXRpb24oKTtcclxuICB9XHJcbiAgY2xvc2UoKXtcclxuICAgIHRoaXMuYW5pbWF0aW9uU3Rhc2lzID0gZmFsc2U7XHJcbiAgICB0aGlzLmNsb3NpbmdBbmltYXRpb24oKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pZGxlKCksIHRoaXMudG90YWxGcmFtZXMgKiBzZXR0aW5ncy5hbmltYXRpb25TcGVlZCk7XHJcbiAgfVxyXG4gIGlkbGUoKXtcclxuICAgIHRoaXMuYW5pbWF0aW9uU3Rhc2lzID0gZmFsc2U7XHJcbiAgICB0aGlzLmlkbGVBbmltYXRpb24oKTtcclxuICB9XHJcbiAgZW50ZXIoKSB7XHJcbiAgICB0aGlzLm9wZW4oKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9LCAodGhpcy50b3RhbEZyYW1lcyArIDgpICogc2V0dGluZ3MuYW5pbWF0aW9uU3BlZWQpO1xyXG4gIH1cclxuICBleGl0KCkge1xyXG4gICAgdGhpcy5sZXZlbC5maW5pc2hlZCA9IHRydWU7XHJcbiAgICB0aGlzLmNsb3NlKCk7XHJcbiAgfVxyXG5cclxuICBjbG9zaW5nQW5pbWF0aW9uKCl7XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMuY2xvc2luZztcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSAzO1xyXG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xyXG4gIH1cclxuICBvcGVuaW5nQW5pbWF0aW9uKCl7XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMub3BlbmluZztcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSA1O1xyXG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xyXG4gIH1cclxuICBpZGxlQW5pbWF0aW9uKCl7XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMuaWRsZTtcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSAxO1xyXG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xyXG4gIH1cclxuXHJcbn1cclxuZXhwb3J0IGNsYXNzIERpYW1vbmQgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuICBjb25zdHJ1Y3Rvcihwb3pYLCBwb3pZLCBhc3NldCwgbGV2ZWwpIHtcclxuICAgIHN1cGVyKHBvelgsIHBvelksIGFzc2V0LCBsZXZlbCwgMTApO1xyXG4gIH1cclxuICBcclxuICBkcmF3KCkge1xyXG4gICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICB0aGlzLmFzc2V0LFxyXG4gICAgICB0aGlzLmZyYW1lV2lkdGggKiB0aGlzLmN1cnJlbnRGcmFtZSxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5mcmFtZVdpZHRoLFxyXG4gICAgICB0aGlzLmZyYW1lSGVpZ2h0LFxyXG4gICAgICB0aGlzLnggKiB0aGlzLmJveFNpemVYICsgdGhpcy5ib3hTaXplWCAqIDAuMDcsXHJcbiAgICAgIHRoaXMueSAqIHRoaXMuYm94U2l6ZVkgKyB0aGlzLmJveFNpemVZICogMC4yNSxcclxuICAgICAgdGhpcy5ib3hTaXplWCAvIDEuNCxcclxuICAgICAgdGhpcy5ib3hTaXplWSAvIDEuNFxyXG4gICAgKTtcclxuICB9XHJcbiAgXHJcbiAgY2hlY2tDb2xsZWN0KCl7XHJcbiAgICBpZihNYXRoLnJvdW5kKHRoaXMubGV2ZWwucGxheWVyLngpICA9PT0gdGhpcy54ICYmIE1hdGgucm91bmQodGhpcy5sZXZlbC5wbGF5ZXIueSkgID09PSB0aGlzLnkpe1xyXG4gICAgICB0aGlzLmNvbGxlY3QoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbGxlY3QoKXtcclxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5sZXZlbC5jb2xsZWN0YWJsZXMuaW5kZXhPZih0aGlzKTtcclxuICAgIHRoaXMubGV2ZWwuY29sbGVjdGFibGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcbiAgY29uc3RydWN0b3IocG96WCwgcG96WSwgYXNzZXQsIGxldmVsKSB7XHJcbiAgICBzdXBlcihwb3pYLCBwb3pZLCBhc3NldCwgbGV2ZWwsIDExKTtcclxuICAgIHRoaXMuZmFjaW5nID0gXCJyaWdodFwiO1xyXG4gICAgdGhpcy5idW1wZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuYWN0aW9ucyA9IDA7XHJcbiAgfVxyXG5cclxuICBkcmF3KCkge1xyXG4gIGlmKHRoaXMuZmFjaW5nID09PSBcInJpZ2h0XCIpe1xyXG4gICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgIHRoaXMuYXNzZXQsXHJcbiAgICAgICAgdGhpcy5mcmFtZVdpZHRoICogdGhpcy5jdXJyZW50RnJhbWUsXHJcbiAgICAgICAgMCxcclxuICAgICAgICB0aGlzLmZyYW1lV2lkdGgsXHJcbiAgICAgICAgdGhpcy5mcmFtZUhlaWdodCxcclxuICAgICAgICB0aGlzLnggKiB0aGlzLmJveFNpemVYIC0gdGhpcy5ib3hTaXplWCAqIDAuNSxcclxuICAgICAgICB0aGlzLnkgKiB0aGlzLmJveFNpemVZIC0gdGhpcy5ib3hTaXplWSAqIDAuODcsXHJcbiAgICAgICAgdGhpcy5ib3hTaXplWCAqIDIuNSxcclxuICAgICAgICB0aGlzLmJveFNpemVZICogMi41XHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGVsc2UgaWYodGhpcy5mYWNpbmcgPT09IFwibGVmdFwiKXtcclxuICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgY3R4LnNjYWxlKC0xLCAxKTtcclxuICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICB0aGlzLmFzc2V0LFxyXG4gICAgICAgIHRoaXMuZnJhbWVXaWR0aCAqIHRoaXMuY3VycmVudEZyYW1lLFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgdGhpcy5mcmFtZVdpZHRoLFxyXG4gICAgICAgIHRoaXMuZnJhbWVIZWlnaHQsXHJcbiAgICAgICAgLSgodGhpcy54ICsgMikgKiB0aGlzLmJveFNpemVYIC0gdGhpcy5ib3hTaXplWCAqIDAuNSksXHJcbiAgICAgICAgdGhpcy55ICogdGhpcy5ib3hTaXplWSAtIHRoaXMuYm94U2l6ZVkgKiAwLjg3LFxyXG4gICAgICAgIHRoaXMuYm94U2l6ZVggKiAyLjUsXHJcbiAgICAgICAgdGhpcy5ib3hTaXplWSAqIDIuNVxyXG4gICAgICApXHJcbiAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNoZWNrQm90dG9tQ29sbGlzaW9uKCkge1xyXG4gICAgbGV0IHJvdyA9IE1hdGguZmxvb3IodGhpcy55KSArIDE7XHJcbiAgICBsZXQgY29sID0gTWF0aFt0aGlzLmZhY2luZyA9PT0gXCJsZWZ0XCI/IFwiZmxvb3JcIiA6IFwiY2VpbFwiXSh0aGlzLngpO1xyXG4gICAgaWYoIXRoaXMubGV2ZWwubWFwW3Jvd10pIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIHRoaXMubGV2ZWwubWFwW3Jvd11bY29sXSAhPT0gMFxyXG5cclxuICB9XHJcbiAgY2hlY2tMZWZ0Q29sbGlzaW9uKGp1bXAgPSBmYWxzZSkge1xyXG4gICAgbGV0IHJvdyA9IE1hdGguZmxvb3IodGhpcy55IC0ganVtcCk7XHJcbiAgICBsZXQgY29sID0gTWF0aC5mbG9vcih0aGlzLnggLSBqdW1wICsgMC4wMSk7XHJcbiAgICByZXR1cm4gdGhpcy5sZXZlbC5tYXBbcm93XVtjb2xdID09PSAxXHJcbiAgfVxyXG4gIGNoZWNrUmlnaHRDb2xsaXNpb24oanVtcCA9IGZhbHNlKXtcclxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKHRoaXMueSAtIGp1bXApO1xyXG4gICAgbGV0IGNvbCA9IE1hdGguY2VpbCh0aGlzLnggKyBqdW1wKTtcclxuICAgIHJldHVybiB0aGlzLmxldmVsLm1hcFtyb3ddW2NvbF0gPT09IDFcclxuICB9XHJcbiAgY2hlY2tUb3BDb2xsaXNpb24oKXtcclxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKHRoaXMueSAtIDAuMDEpO1xyXG4gICAgbGV0IGNvbCA9IE1hdGhbdGhpcy5mYWNpbmcgPT09IFwibGVmdFwiPyBcImNlaWxcIiA6IFwiZmxvb3JcIl0odGhpcy54KTtcclxuICAgIGlmKCF0aGlzLmxldmVsLm1hcFtyb3ddKSByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiB0aGlzLmxldmVsLm1hcFtyb3ddW2NvbF0gPT09IDEgfHwgdGhpcy5sZXZlbC5tYXBbcm93XVtjb2xdID09PSAzO1xyXG4gIH1cclxuICBpZGxlKCl7XHJcbiAgICBpZih0aGlzLnggJSAxIHx8IHRoaXMueSAlIDEpXHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJEZWNpbWFsIHBveml0aW9uIGRldGVjdGVkIGluIGlkbGUgc3RhdGU6IFwiLHt4OiB0aGlzLngsIHk6IHRoaXMueX0pO1xyXG4gICAgdGhpcy5mYWxsaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmlkbGVBbmltYXRpb24oKTtcclxuICB9XHJcbiAgZmFsbChqdW1wID0gZmFsc2UpIHtcclxuICAgIHRoaXMuYWN0aW9ucysrO1xyXG4gICAgbGV0IGdyYXZpdHkgPSBqdW1wID8gMC4xIDogMC4wODtcclxuICAgIGxldCB2ZWxvY2l0eSA9IDA7XHJcbiAgICBsZXQgc3BlZWQgPSBzZXR0aW5ncy5nYW1lU3BlZWQ7XHJcbiAgICB0aGlzLmZhbGxpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5mYWxsQW5pbWF0aW9uKCk7XHJcbiAgXHJcbiAgICBjb25zdCBtb3ZpbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHRoaXMueSArPSB2ZWxvY2l0eTtcclxuICAgICAgdmVsb2NpdHkgKz0gZ3Jhdml0eTtcclxuICAgICAgaWYgKHRoaXMuY2hlY2tCb3R0b21Db2xsaXNpb24oKSkge1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IodGhpcy55KTtcclxuICAgICAgICBjbGVhckludGVydmFsKG1vdmluZyk7XHJcbiAgICAgICAgdGhpcy5pZGxlKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLS07XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9LCBzcGVlZCk7XHJcbiAgfVxyXG4gIGp1bXAoZGlyZWN0aW9uKSB7XHJcbiAgICBpZighaXNfZGlyZWN0aW9uKGRpcmVjdGlvbikgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jdXJyZW50QWN0aW9uID0gXCJqdW1wXCI7XHJcbiAgICB0aGlzLmFjdGlvbnMrKztcclxuICAgIGxldCBtYXhIZWlnaHQgPSAwLjc1O1xyXG4gICAgbGV0IGdyYXZpdHkgPSAwLjE1O1xyXG4gICAgbGV0IHZlbG9jaXR5ID0gTWF0aC5zcXJ0KG1heEhlaWdodCAqIGdyYXZpdHkgKiAyKTtcclxuICAgIGxldCBzcGVlZCA9IHNldHRpbmdzLmdhbWVTcGVlZDtcclxuICAgIFxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGlmKGRpcmVjdGlvbiA9PT0gXCJsZWZ0XCIpIHRoaXMubW92ZUxlZnQoMSwgdHJ1ZSk7XHJcbiAgICAgIGlmKGRpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSB0aGlzLm1vdmVSaWdodCgxLCB0cnVlKTtcclxuICAgIH0sIHNldHRpbmdzLmdhbWVTcGVlZCAqIDAuNSlcclxuXHJcbiAgICB0aGlzLmp1bXBBbmltYXRpb24oKTtcclxuICAgIGNvbnN0IG1vdmluZyA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgaWYgKHZlbG9jaXR5IDw9IDApIHtcclxuICAgICAgICBjbGVhckludGVydmFsKG1vdmluZylcclxuICAgICAgICB0aGlzLmZhbGwodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLS07XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmNoZWNrVG9wQ29sbGlzaW9uKCkpe1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobW92aW5nKTtcclxuICAgICAgICB0aGlzLmRpZSgpO1xyXG4gICAgICAgIHRoaXMuZmFsbCgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnkgLT0gdmVsb2NpdHk7XHJcbiAgICAgIHZlbG9jaXR5IC09IGdyYXZpdHk7XHJcbiAgICB9LCBzcGVlZCk7XHJcbiAgfVxyXG4gIG1vdmVSaWdodCh4LCBqdW1wID0gZmFsc2Upe1xyXG4gICAgaWYoIWlzX1VJTlQoeCkpe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjdGlvbnMrKztcclxuICAgIHRoaXMuZmFjaW5nID0gXCJyaWdodFwiO1xyXG4gICAgbGV0IHNwZWVkID0gc2V0dGluZ3MuZ2FtZVNwZWVkICogMC41O1xyXG4gICAgbGV0IHN0ZXAgPSAwLjE7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBcclxuICAgIGlmKCFqdW1wKXRoaXMucnVuQW5pbWF0aW9uKCk7XHJcbiAgICBpZihqdW1wICYmIHRoaXMuY2hlY2tSaWdodENvbGxpc2lvbih0cnVlKSl7XHJcbiAgICAgIHRoaXMuZGllKCk7XHJcbiAgICAgIHRoaXMuYWN0aW9ucy0tO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjb25zdCBtb3ZpbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHRoaXMueCArPSBzdGVwO1xyXG4gICAgICBpZihpID49IHggLyBzdGVwKXtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLmZsb29yKHRoaXMueCk7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb3ZpbmcpO1xyXG4gICAgICAgIGlmKCFqdW1wICYmICF0aGlzLmZhbGxpbmcpdGhpcy5pZGxlKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLS07XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZighanVtcCAmJiB0aGlzLmNoZWNrUmlnaHRDb2xsaXNpb24oKSl7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb3ZpbmcpO1xyXG4gICAgICAgIHRoaXMuZGllKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLS07XHJcbiAgICAgIH07XHJcbiAgICAgIGlmKCFqdW1wICYmICF0aGlzLmNoZWNrQm90dG9tQ29sbGlzaW9uKCkgJiYgIXRoaXMuZmFsbGluZyl7XHJcbiAgICAgICAgdGhpcy5mYWxsKCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYodGhpcy5idW1wZWQpe1xyXG4gICAgICAgIHRoaXMueCAtPSBzdGVwO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobW92aW5nKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaSsrO1xyXG4gICAgfSwgc3BlZWQpO1xyXG4gIH1cclxuICBtb3ZlTGVmdCh4LCBqdW1wID0gZmFsc2Upe1xyXG4gICAgaWYoIWlzX1VJTlQoeCkpe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjdGlvbnMrKztcclxuICAgIHRoaXMuZmFjaW5nID0gXCJsZWZ0XCI7XHJcbiAgICBsZXQgc3BlZWQgPSBzZXR0aW5ncy5nYW1lU3BlZWQgKiAwLjU7XHJcbiAgICBsZXQgc3RlcCA9IDAuMTtcclxuICAgIGxldCBpID0gMDtcclxuICAgIFxyXG4gICAgaWYoIWp1bXApdGhpcy5ydW5BbmltYXRpb24oKTtcclxuICAgIGlmKGp1bXAgJiYgdGhpcy5jaGVja0xlZnRDb2xsaXNpb24odHJ1ZSkpe1xyXG4gICAgICB0aGlzLmRpZSgpO1xyXG4gICAgICB0aGlzLmFjdGlvbnMtLTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9O1xyXG4gICAgXHJcblxyXG4gICAgY29uc3QgbW92aW5nID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB0aGlzLnggLT0gc3RlcDtcclxuICAgICAgaWYoaSA+PSB4IC8gc3RlcCl7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5jZWlsKHRoaXMueCk7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb3ZpbmcpO1xyXG4gICAgICAgIGlmKCFqdW1wICYmICF0aGlzLmZhbGxpbmcpIHRoaXMuaWRsZSgpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy0tO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYoIWp1bXAgJiYgdGhpcy5jaGVja0xlZnRDb2xsaXNpb24oKSl7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb3ZpbmcpO1xyXG4gICAgICAgIHRoaXMuZGllKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9O1xyXG4gICAgICBpZighanVtcCAmJiAhdGhpcy5jaGVja0JvdHRvbUNvbGxpc2lvbigpICYmICF0aGlzLmZhbGxpbmcpe1xyXG4gICAgICAgIHRoaXMuZmFsbCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHRoaXMuYnVtcGVkKXtcclxuICAgICAgICB0aGlzLnggKz0gc3RlcDtcclxuICAgICAgICBjbGVhckludGVydmFsKG1vdmluZyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGkrKztcclxuICAgIH0sIHNwZWVkKTtcclxuICB9XHJcbiAgYXR0YWNrKCl7XHJcbiAgICB0aGlzLmF0dGFja0FuaW1hdGlvbigpO1xyXG4gICAgdGhpcy5hY3Rpb25zKys7XHJcbiAgICB0aGlzLmFuaW1hdGlvblN0YXNpcyA9IHRydWU7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5pZGxlKClcclxuICAgICAgdGhpcy5hY3Rpb25zLS07XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uU3Rhc2lzID0gZmFsc2U7XHJcbiAgICB9LCBzZXR0aW5ncy5hbmltYXRpb25TcGVlZCAqIHRoaXMudG90YWxGcmFtZXMpO1xyXG4gIH1cclxuICBkaWUoKXtcclxuICAgIGJ1bXBlZCgpO1xyXG4gICAgdGhpcy5idW1wZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5kaWVBbmltYXRpb24oKTtcclxuICAgIHRoaXMueCA9IE1hdGhbdGhpcy5mYWNpbmcgPT09IFwibGVmdFwiPyBcImNlaWxcIiA6IFwiZmxvb3JcIl0odGhpcy54KTtcclxuICAgIHRoaXMueSA9IE1hdGguZmxvb3IodGhpcy55KTtcclxuICAgIHRoaXMudXBkYXRlID0gKCkgPT4ge1xyXG4gICAgICBpZih0aGlzLmN1cnJlbnRGcmFtZSA9PT0gdGhpcy50b3RhbEZyYW1lcyAtIDEpIHJldHVybjtcclxuICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSAodGhpcy5jdXJyZW50RnJhbWUgKyAxKTtcclxuICAgIH1cclxuICB9XHJcbiAgZW50ZXIoKXtcclxuICAgIHRoaXMubGV2ZWwuc3RhcnREb29yLmVudGVyKCk7XHJcbiAgICB0aGlzLmFjdGlvbnMrKztcclxuICAgIGNvbnN0IGRyYXdDcHkgPSB0aGlzLmRyYXc7XHJcbiAgICB0aGlzLmRyYXcgPSAoKSA9PiB7fTtcclxuICAgIFxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuZHJhdyA9IGRyYXdDcHk7XHJcbiAgICAgIHRoaXMuZG9vck91dCgpXHJcbiAgICAgIFxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLmlkbGUoKTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMtLTtcclxuICAgICAgfSwgdGhpcy50b3RhbEZyYW1lcyAqIHNldHRpbmdzLmFuaW1hdGlvblNwZWVkKVxyXG4gICAgfSwgNSAqIHNldHRpbmdzLmFuaW1hdGlvblNwZWVkKTtcclxuICB9XHJcbiAgZXhpdCgpe1xyXG4gICAgaWYoIWlzX3ZhbGlkRXhpdCh0aGlzKSl7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sZXZlbC5lbmREb29yLmV4aXQoKTtcclxuICAgIHRoaXMuYWN0aW9ucysrO1xyXG4gICAgdGhpcy5kb29ySW4oKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLmFjdGlvbnMtLTtcclxuICAgICAgdGhpcy5kcmF3ID0gKCkgPT4ge307XHJcbiAgICAgIHRoaXMubGV2ZWwuZW5kRG9vci5leGl0KCk7XHJcbiAgICB9LCB0aGlzLnRvdGFsRnJhbWVzICogc2V0dGluZ3MuYW5pbWF0aW9uU3BlZWQpO1xyXG4gIH1cclxuICBkb29ySW4oKXtcclxuICAgIHRoaXMuZG9vckluQW5pbWF0aW9uKCk7XHJcbiAgfVxyXG4gIGRvb3JPdXQoKXtcclxuICAgIHRoaXMuZG9vck91dEFuaW1hdGlvbigpO1xyXG4gIH1cclxuICBydW5BbmltYXRpb24oKXtcclxuICAgIGlmKHRoaXMuYnVtcGVkKXJldHVybjtcclxuICAgIHRoaXMuYXNzZXQgPSB0aGlzLmFzc2V0cy5ydW47XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gODtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICB9XHJcbiAgaWRsZUFuaW1hdGlvbigpe1xyXG4gICAgaWYodGhpcy5idW1wZWQpIHJldHVybjtcclxuICAgIHRoaXMuYXNzZXQgPSB0aGlzLmFzc2V0cy5pZGxlO1xyXG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IDExO1xyXG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAxO1xyXG4gIH1cclxuICBqdW1wQW5pbWF0aW9uKCl7XHJcbiAgICBpZih0aGlzLmJ1bXBlZCkgcmV0dXJuO1xyXG4gICAgdGhpcy5hc3NldCA9IHRoaXMuYXNzZXRzLmp1bXA7XHJcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gMTtcclxuICB9XHJcbiAgZmFsbEFuaW1hdGlvbigpe1xyXG4gICAgaWYodGhpcy5idW1wZWQpIHJldHVybjtcclxuICAgIHRoaXMuYXNzZXQgPSB0aGlzLmFzc2V0cy5mYWxsO1xyXG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IDE7XHJcbiAgfVxyXG4gIGF0dGFja0FuaW1hdGlvbigpe1xyXG4gICAgaWYodGhpcy5idW1wZWQpIHJldHVybjtcclxuICAgIHRoaXMuYXNzZXQgPSB0aGlzLmFzc2V0cy5hdHRhY2s7XHJcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gMztcclxuICB9XHJcbiAgZGllQW5pbWF0aW9uKCl7XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMuZGllO1xyXG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IDQ7XHJcbiAgfVxyXG4gIGRvb3JJbkFuaW1hdGlvbigpe1xyXG4gICAgdGhpcy5hc3NldCA9IHRoaXMuYXNzZXRzLmRvb3JJbjtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSA4O1xyXG4gIH1cclxuICBkb29yT3V0QW5pbWF0aW9uKCl7XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMuZG9vck91dDtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSA4O1xyXG4gIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaXNTdGF0ZW1lbnQgfSBmcm9tIFwiLi9lcnJvcnMuanNcIjtcclxuXHJcbmZ1bmN0aW9uIHRva2VuaXplQ29kZShjb2RlKXtcclxuICBsZXQgY29kZVJvd3MgPSBjb2RlLnNwbGl0KCdcXG4nKTtcclxuICBjb2RlUm93cyA9IGNvZGVSb3dzLm1hcChyb3cgPT4gcm93LnNwbGl0KCcjJylbMF0ucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKSk7XHJcbiAgcmV0dXJuIGNvZGVSb3dzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb21waWxlQ29kZSh0b2tlbml6ZWRDb2RlKXtcclxuICBsZXQgYWN0aW9ucyA9IFtdO1xyXG4gIGZvciAobGV0IHRva2VuaXplZFJvdyBvZiB0b2tlbml6ZWRDb2RlKSB7XHJcbiAgICBpZighaXNTdGF0ZW1lbnQodG9rZW5pemVkUm93KSkgcmV0dXJuIG51bGw7XHJcbiAgICBpZih0b2tlbml6ZWRSb3cgPT09IFwiXCIpIGNvbnRpbnVlO1xyXG4gICAgY29uc3QgdG9rZW5zID0gdG9rZW5pemVkUm93LnNwbGl0KFwiIFwiKTtcclxuICAgIGxldCBjb21tYW5kID0gdG9rZW5zLnNoaWZ0KCk7XHJcbiAgICBsZXQgYXJncyA9IFsuLi50b2tlbnNdO1xyXG4gICAgbGV0IGFjdGlvbiA9IHt9O1xyXG4gICAgc3dpdGNoKGNvbW1hbmQpe1xyXG4gICAgICBjYXNlIFwid2Fsa1wiOiB7XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSBhcmdzWzBdID09PSBcInJpZ2h0XCI/IFwibW92ZVJpZ2h0XCIgOiBcIm1vdmVMZWZ0XCI7XHJcbiAgICAgICAgLy8gaWYoYWN0aW9uc1thY3Rpb25zLmxlbmd0aCAtIDFdLmNvbW1hbmQgPT09IGNvbW1hbmQpIHtcclxuICAgICAgICAvLyAgIGFjdGlvbnNbYWN0aW9ucy5sZW5ndGggLSAxXS5tb3ZlQnkrKztcclxuICAgICAgICAvLyAgIGNvbnRpbnVlO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBhY3Rpb24gPSB7Y29tbWFuZCwgbW92ZUJ5OiAxfTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIFwianVtcFwiOiB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IGFyZ3NbMF07XHJcbiAgICAgICAgYWN0aW9uID0ge2NvbW1hbmQ6IFwianVtcFwiLCBkaXJlY3Rpb259O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgXCJhdHRhY2tcIjoge1xyXG4gICAgICAgIGFjdGlvbiA9IHtjb21tYW5kOiBcImF0dGFja1wifTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIFwic3RhcnRcIjoge1xyXG4gICAgICAgIGFjdGlvbiA9IHtjb21tYW5kOiBcInN0YXJ0XCJ9O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgXCJlbmRcIjoge1xyXG4gICAgICAgIGFjdGlvbiA9IHtjb21tYW5kOiBcImVuZFwifTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIFwiaWZcIjoge1xyXG4gICAgICAgIGFjdGlvbiA9IGNvbXBpbGVJZlN0YXRlbWVudChhcmdzKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYWN0aW9ucztcclxufVxyXG5cclxuZnVuY3Rpb24gY29tcGlsZUlmU3RhdGVtZW50KHRva2Vucyl7XHJcbiAgbGV0IG5lZ2F0ZSA9IGZhbHNlO1xyXG4gIC8qXHJcbiAgICBpZiBmYWNpbmcgZG9vci93YWxsL2RpYW1vbmQuLi5cclxuICAgIGlmIG5vdCBmYWNpbmcgZG9vci93YWxsL2RpYW1vbmQuLi5cclxuICAgIGlmIG9uIGZsb29yL3BsYXRmb3JtLi4uXHJcbiAgICBpZiBvbiBmbG9vciBvciBmYWNpbmcgZG9vclxyXG4gICAgaWYgb24gZmxvb3IgYW5kIGZhY2luZyB3YWxsIG9yIGZhY2luZyBkb29yXHJcbiAgICBpZiBvbiBkb29yIG9yIGZhY2luZyBkb29yIGFuZCBvbiBwbGF0Zm9ybVxyXG5cclxuXHJcbiAgKi9cclxuICBmb3IobGV0IHRva2VuIG9mIHRva2Vucyl7XHJcblxyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlKGNvZGUpe1xyXG4gIGNvbnN0IHRva2VuaXplZENvZGUgPSB0b2tlbml6ZUNvZGUoY29kZSk7XHJcbiAgY29uc3QgY29tcGlsZWRDb2RlID0gY29tcGlsZUNvZGUodG9rZW5pemVkQ29kZSk7XHJcblxyXG4gIHJldHVybiBjb21waWxlZENvZGU7XHJcbn0iLCJmdW5jdGlvbiBpbnZhbGlkX1VJTlQoeCl7XHJcbiAgY29uc29sZS5lcnJvcih4ICsgXCIgaXMgbm90IGEgdmFsaWQgcG9zaXRpdmUgaW50ZWdlclwiKTtcclxufTtcclxuZnVuY3Rpb24gaW52YWxpZF9kaXJlY3Rpb24oZGlyZWN0aW9uLCB3YWxraW5nID0gZmFsc2Upe1xyXG4gIGNvbnNvbGUuZXJyb3IoYFwiJHtkaXJlY3Rpb259XCIgaXMgbm90IGEgdmFsaWQgJHt3YWxraW5nPyBcIndhbGthYmxlIFwiIDogXCJcIn1kaXJlY3Rpb25gKTtcclxufVxyXG5mdW5jdGlvbiBpbnZhbGlkX2Rvb3JBY2Nlc3NQb3NpdGlvbigpe1xyXG4gIGNvbnNvbGUuZXJyb3IoXCJZb3UgbmVlZCB0byBiZSBvbiB0aGUgZG9vciB0byBhY2Nlc3MgaXRcIik7XHJcbn1cclxuZnVuY3Rpb24gaW52YWxpZF9kb29yT3BlblN0YXRlKCl7XHJcbiAgY29uc29sZS5lcnJvcihcIlRoZSBkb29yIG5lZWRzIHRvIGJlIG9wZW4gdG8gYWNjZXNzIGl0LlxcbiBDb2xsZWN0IGFsbCBkaWFtb25kcyB0byBvcGVuIGl0XCIpO1xyXG59XHJcbmZ1bmN0aW9uIGludmFsaWRfZG9vclR5cGUoKXtcclxuICBjb25zb2xlLmVycm9yKFwiWW91IGFyZSB0cnlpbmcgdG8gYWNjZXNzIHRoZSB3cm9uZyBkb29yXCIpO1xyXG59XHJcbmZ1bmN0aW9uIGludmFsaWRfY29tbWFuZChjb21tYW5kKXtcclxuICBjb25zb2xlLmVycm9yKGBcIiR7Y29tbWFuZH1cIiBpcyBub3QgYSB2YWxpZCBjb21tYW5kYCk7XHJcbn1cclxuZnVuY3Rpb24gaW52YWxpZF9hcmd1bWVudE51bWJlcihleGNlZWRpbmcpe1xyXG4gIGNvbnNvbGUuZXJyb3IoYCR7ZXhjZWVkaW5nPyBcIlRvbyBtYW55XCI6IFwiSW5zdWZmaWNpZW50XCJ9IGFyZ3VtZW50c2ApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNfdmFsaWRFeGl0KHBsYXllcil7XHJcbiAgaWYocGxheWVyLnggPT09IHBsYXllci5sZXZlbC5zdGFydERvb3IueCAmJiBwbGF5ZXIueSA9PT0gcGxheWVyLmxldmVsLnN0YXJ0RG9vci55KXtcclxuICAgIGludmFsaWRfZG9vclR5cGUoKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgaWYocGxheWVyLnggIT09IHBsYXllci5sZXZlbC5lbmREb29yLnggfHwgcGxheWVyLnkgIT09IHBsYXllci5sZXZlbC5lbmREb29yLnkpe1xyXG4gICAgaW52YWxpZF9kb29yQWNjZXNzUG9zaXRpb24oKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgaWYoIXBsYXllci5sZXZlbC5lbmREb29yLmlzT3Blbil7XHJcbiAgICBpbnZhbGlkX2Rvb3JPcGVuU3RhdGUoKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzX1VJTlQoeCl7XHJcbiAgaWYoIU51bWJlci5pc0ludGVnZXIoeCkgfHwgeCA8IDApe1xyXG4gICAgaW52YWxpZF9VSU5UKHgpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNfZGlyZWN0aW9uKGRpcmVjdGlvbiwgd2Fsa2luZyA9IGZhbHNlKXtcclxuICBzd2l0Y2goZGlyZWN0aW9uKXtcclxuICAgIGNhc2UgXCJsZWZ0XCI6XHJcbiAgICBjYXNlIFwicmlnaHRcIjogXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgY2FzZSBcInVwXCI6XHJcbiAgICAgIGlmKHdhbGtpbmcpe1xyXG4gICAgICAgIGludmFsaWRfZGlyZWN0aW9uKGRpcmVjdGlvbiwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgaW52YWxpZF9kaXJlY3Rpb24oZGlyZWN0aW9uKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNfYXJndW1lbnROdW1iZXJDb3JyZWN0KG4sIGFyZ0xlbil7XHJcbiAgaWYoYXJnTGVuID4gbil7XHJcbiAgICBpbnZhbGlkX2FyZ3VtZW50TnVtYmVyKHRydWUpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICBlbHNlIGlmKGFyZ0xlbiA8IG4pe1xyXG4gICAgaW52YWxpZF9hcmd1bWVudE51bWJlcihmYWxzZSk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gYnVtcGVkKCl7XHJcbiAgY29uc29sZS5lcnJvcihcIllvdSBidW1wZWQgaW50byBhIHdhbGxcIik7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tbWFuZChjb21tYW5kKXtcclxuICBjb25zdCBjb21tYW5kcyA9IFtcInN0YXJ0XCIsIFwiZW5kXCIsIFwid2Fsa1wiLCBcImp1bXBcIiwgXCJhdHRhY2tcIiwgXCJcIl07XHJcbiAgaWYoIWNvbW1hbmRzLmluY2x1ZGVzKGNvbW1hbmQpKXtcclxuICAgIGludmFsaWRfY29tbWFuZChjb21tYW5kKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXRlbWVudChzdGF0ZW1lbnQpe1xyXG4gIHN0YXRlbWVudCA9IHN0YXRlbWVudC5zcGxpdChcIiBcIik7XHJcbiAgY29uc3QgY29tbWFuZCA9IHN0YXRlbWVudC5zaGlmdCgpO1xyXG4gIGNvbnN0IGFyZ3MgPSBbLi4uc3RhdGVtZW50XTtcclxuICBpZighaXNDb21tYW5kKGNvbW1hbmQpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gIGxldCBhcmdzTGVuID0gYXJncy5sZW5ndGg7XHJcbiAgc3dpdGNoKGNvbW1hbmQpe1xyXG4gICAgY2FzZSBcIndhbGtcIjoge1xyXG4gICAgICBpZighaXNfYXJndW1lbnROdW1iZXJDb3JyZWN0KDEsIGFyZ3NMZW4pKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKCFpc19kaXJlY3Rpb24oYXJnc1swXSwgdHJ1ZSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBjYXNlIFwianVtcFwiOiB7XHJcbiAgICAgIGlmKCFpc19hcmd1bWVudE51bWJlckNvcnJlY3QoMSwgYXJnc0xlbikpIHJldHVybiBmYWxzZTtcclxuICAgICAgaWYoIWlzX2RpcmVjdGlvbihhcmdzWzBdKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNhc2UgXCJhdHRhY2tcIjpcclxuICAgIGNhc2UgXCJzdGFydFwiOlxyXG4gICAgY2FzZSBcImVuZFwiOiB7XHJcbiAgICAgIGlmKCFpc19hcmd1bWVudE51bWJlckNvcnJlY3QoMCwgYXJnc0xlbikpIHJldHVybiBmYWxzZTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBjYXNlIFwiXCI6IHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDoge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBjYW52YXMsIGN0eCB9IGZyb20gXCIuL2NhbnZhcy5qc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGxldmVsc1Byb3BlcnRpZXMgPSBbXHJcbiAgbnVsbCxcclxuICB7IG1hcDogW1xyXG4gICAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcbiAgICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgICBbMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMV0sXHJcbiAgICAgIFsxLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxXSxcclxuICAgICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDEsIDFdLFxyXG4gICAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMSwgMV0sXHJcbiAgICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcbiAgICBdLFxyXG4gICAgZGlhbW9uZHM6IFtcclxuICAgIHt4OiAyLCB5OiA0fSwge3g6IDEyLCB5OiA2fV0sXHJcbiAgICBzdGFydFBvejoge3g6IDMsIHk6IDR9LFxyXG4gICAgZW5kUG96OiB7eDogMTEsIHk6IDZ9LFxyXG4gIH0sXHJcbiAgeyBtYXA6IFtcclxuICAgICAgWzAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDBdLFxyXG4gICAgICBbMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMF0sXHJcbiAgICAgIFswLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwXSxcclxuICAgICAgWzAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDBdLFxyXG4gICAgICBbMCwgMSwgMiwgMiwgMiwgMiwgMiwgMiwgMiwgMiwgMiwgMiwgMSwgMSwgMF0sXHJcbiAgICAgIFswLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwXSxcclxuICAgICAgWzAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDBdLFxyXG4gICAgICBbMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMF0sXHJcbiAgICAgIFswLCAxLCAwLCAwLCAwLCAwLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAwXSxcclxuICAgICAgWzAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDBdLFxyXG4gICAgXSxcclxuICAgIGRpYW1vbmRzOiBbXHJcbiAgICB7eDogMTAsIHk6IDZ9LCB7eDogNSwgeTogNn0sIHt4OiA2LCB5OiA4fV0sXHJcbiAgICBzdGFydFBvejoge3g6IDIsIHk6IDh9LFxyXG4gICAgZW5kUG96OiB7eDogMTEsIHk6IDZ9LFxyXG4gIH0sXHJcbiAgeyBcclxuICAgIG1hcDogW1xyXG4gICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgWzEsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDFdLFxyXG4gICAgWzEsIDMsIDMsIDMsIDMsIDMsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDFdLFxyXG4gICAgWzEsIDEsIDAsIDAsIDAsIDAsIDIsIDMsIDMsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgWzEsIDEsIDAsIDAsIDAsIDAsIDIsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgWzEsIDEsIDAsIDAsIDAsIDIsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgWzEsIDEsIDAsIDAsIDIsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgWzEsIDEsIDAsIDIsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgXSxcclxuICAgIGRpYW1vbmRzOiBbXHJcbiAgICB7eDogMiwgeTogMX0sIHt4OiA3LCB5OiA0fSwge3g6IDIsIHk6IDd9XSxcclxuICAgIHN0YXJ0UG96OiB7eDogNywgeTogN30sXHJcbiAgICBlbmRQb3o6IHt4OiAxMSwgeTogMn0sXHJcbiAgfSx7IFxyXG4gICAgbWFwOiBbXHJcbiAgICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSwgXHJcbiAgICAgIFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSwgXHJcbiAgICAgIFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSwgXHJcbiAgICAgIFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAzLCAxLCAxLCAxXSwgXHJcbiAgICAgIFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAzLCAxLCAwLCAwLCAwLCAxXSwgXHJcbiAgICAgIFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAzLCAxLCAwLCAwLCAwLCAwLCAwLCAxXSwgXHJcbiAgICAgIFsxLCAwLCAwLCAyLCAxLCAxLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSwgXHJcbiAgICAgIFsxLCAwLCAwLCAyLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSwgXHJcbiAgICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSwgXHJcbiAgICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIF0sXHJcbiAgICBkaWFtb25kczogW1xyXG4gICAge3g6IDEwLCB5OiA2fV0sXHJcbiAgICBzdGFydFBvejoge3g6IDIsIHk6IDd9LFxyXG4gICAgZW5kUG96OiB7eDogMTMsIHk6IDJ9LFxyXG4gIH0sXHJcbiAgXHJcbl1cclxuXHJcbmV4cG9ydCBjbGFzcyBMZXZlbHtcclxuICBjb25zdHJ1Y3RvcihuciwgbWFwLCBhc3NldHMpe1xyXG4gICAgdGhpcy5zaXplWSA9IG1hcC5sZW5ndGg7XHJcbiAgICB0aGlzLnNpemVYID0gbWFwWzBdLmxlbmd0aDtcclxuICAgIHRoaXMubWFwID0gbWFwO1xyXG4gICAgdGhpcy5ib3hTaXplWCA9IGNhbnZhcy53aWR0aCAvIHRoaXMuc2l6ZVg7IFxyXG4gICAgdGhpcy5ib3hTaXplWSA9IGNhbnZhcy5oZWlnaHQgLyB0aGlzLnNpemVZLCBcclxuICAgIHRoaXMuYXNzZXRzID0gYXNzZXRzO1xyXG4gICAgdGhpcy5uciA9IG5yO1xyXG4gIH1cclxuICBcclxuICBkcmF3QmFja2dyb3VuZCgpe1xyXG4gICAgbGV0IGNhbnZhc1NpemVYID0gY2FudmFzLndpZHRoO1xyXG4gICAgbGV0IGNhbnZhc1NpemVZID0gY2FudmFzLmhlaWdodDtcclxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5hc3NldHNbYGx2bCR7dGhpcy5ucn1CYWNrZ3JvdW5kYF0sIDAsIDAsIGNhbnZhc1NpemVYLCBjYW52YXNTaXplWSk7XHJcbiAgfVxyXG4gIGRyYXdGb3JlZ3JvdW5kKCl7XHJcbiAgICBsZXQgY2FudmFzU2l6ZVggPSBjYW52YXMud2lkdGg7XHJcbiAgICBsZXQgY2FudmFzU2l6ZVkgPSBjYW52YXMuaGVpZ2h0O1xyXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmFzc2V0c1tgbHZsJHt0aGlzLm5yfUZvcmVncm91bmRgXSwgMCwgMCwgY2FudmFzU2l6ZVgsIGNhbnZhc1NpemVZKTtcclxuICB9XHJcbn1cclxuXHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY2FudmFzLCBjdHgsIGJsYWNrb3V0LCBkcmF3VGV4dCB9IGZyb20gXCIuL2NhbnZhcy5qc1wiXHJcbmltcG9ydCBnZXRBc3NldHMgZnJvbSBcIi4vYXNzZXRzLmpzXCJcclxuaW1wb3J0IHsgRGlhbW9uZCwgUGxheWVyLCBEb29yIH0gZnJvbSBcIi4vY2xhc3Nlcy5qc1wiXHJcbmltcG9ydCB7IExldmVsLCBsZXZlbHNQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vbGV2ZWxzLmpzXCJcclxuaW1wb3J0IHsgY29tcGlsZSB9IGZyb20gXCIuL2NvbXBpbGVyLmpzXCJcclxuXHJcblxyXG5cclxuY29uc3QgbGV2ZWxzID0gW251bGxdO1xyXG5cclxubGV0IGxldmVsID0ge307XHJcbmxldCBwbGF5ZXIgPSB7fTtcclxuXHJcbmxldCBjb2xsZWN0YWJsZXMgPSBbXTtcclxubGV0IGFjdGlvblF1ZXVlID0gW1xyXG4gIC8vIC8vbHZsMVxyXG4gIC8vIHtcclxuICAvLyAgIGNvbW1hbmQ6IFwibW92ZUxlZnRcIixcclxuICAvLyAgIG1vdmVCeTogMSxcclxuICAvLyB9LFxyXG4gIC8vIHtcclxuICAvLyAgIGNvbW1hbmQ6IFwibW92ZVJpZ2h0XCIsXHJcbiAgLy8gICBtb3ZlQnk6IDEwLFxyXG4gIC8vIH0sXHJcbiAgLy8ge1xyXG4gIC8vICAgY29tbWFuZDogXCJtb3ZlTGVmdFwiLFxyXG4gIC8vICAgbW92ZUJ5OiAxLFxyXG4gIC8vIH0sXHJcbiAgLy8ge1xyXG4gIC8vICAgY29tbWFuZDogXCJlbnRlclwiXHJcbiAgLy8gfSxcclxuXHJcbiAgLy8gLy8gbHZsIDJcclxuICAvLyB7XHJcbiAgLy8gICBjb21tYW5kOiBcIm1vdmVSaWdodFwiLFxyXG4gIC8vICAgbW92ZUJ5OiA0LFxyXG4gIC8vIH0sXHJcbiAgLy8ge1xyXG4gIC8vICAgY29tbWFuZDogXCJqdW1wXCIsXHJcbiAgLy8gICBkaXJlY3Rpb246IFwidXBcIlxyXG4gIC8vIH0sXHJcbiAgLy8ge1xyXG4gIC8vICAgY29tbWFuZDogXCJqdW1wXCIsXHJcbiAgLy8gICBkaXJlY3Rpb246IFwibGVmdFwiXHJcbiAgLy8gfSxcclxuICAvLyB7XHJcbiAgLy8gICBjb21tYW5kOiBcImp1bXBcIixcclxuICAvLyAgIGRpcmVjdGlvbjogXCJyaWdodFwiXHJcbiAgLy8gfSxcclxuICAvLyB7XHJcbiAgLy8gICBjb21tYW5kOiBcImp1bXBcIixcclxuICAvLyAgIGRpcmVjdGlvbjogXCJyaWdodFwiXHJcbiAgLy8gfSxcclxuICAvLyB7XHJcbiAgLy8gICBjb21tYW5kOiBcIm1vdmVSaWdodFwiLFxyXG4gIC8vICAgbW92ZUJ5OiA0XHJcbiAgLy8gfSxcclxuXTtcclxud2luZG93LnNldHRpbmdzID0ge1xyXG4gIGdhbWVTcGVlZDogNzAsXHJcbiAgYW5pbWF0aW9uU3BlZWQ6IDYwLFxyXG5cclxuICBjdXJyZW50TGV2ZWw6IDAsXHJcbiAgYmxhY2tvdXRMZXZlbDogMSxcclxuICBnYW1lSW50ZXJ2YWw6IG51bGwsXHJcbiAgYWN0aW9uUXVldWU6IGFjdGlvblF1ZXVlLFxyXG5cclxuICBnYW1lUnVubmluZzogZmFsc2UsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwR2FtZSgpe1xyXG4gIGZvcihsZXQgaSA9IDE7IGkgPCBsZXZlbHNQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKXtcclxuICAgIGNvbnN0IHsgbWFwLCBkaWFtb25kcywgc3RhcnRQb3osIGVuZFBveiB9ID0gbGV2ZWxzUHJvcGVydGllc1tpXTsgXHJcbiAgICBsZXZlbHMucHVzaChuZXcgTGV2ZWwoaSwgbGV2ZWxzUHJvcGVydGllc1tpXS5tYXAsIGFzc2V0cy5tYXBzKSk7XHJcbiAgICBsZXZlbHNbaV0ubWFwID0gbWFwLm1hcChhcnIgPT4gWy4uLmFycl0pO1xyXG4gICAgbGV2ZWxzW2ldLmRpYW1vbmRzID0gZGlhbW9uZHMubWFwKHBveiA9PiAoey4uLnBven0pKTtcclxuICAgIGxldmVsc1tpXS5zdGFydFBveiA9IHsuLi5zdGFydFBven1cclxuICAgIGxldmVsc1tpXS5lbmRQb3ogPSB7Li4uZW5kUG96fVxyXG4gIH07XHJcbiAgYWR2YW5jZShzZXR0aW5ncy5jdXJyZW50TGV2ZWwpO1xyXG59XHJcbmZ1bmN0aW9uIGFkdmFuY2UoKXtcclxuICBpZihzZXR0aW5ncy5jdXJyZW50TGV2ZWwgIT09IDApIGVuZEdhbWUoKTtcclxuICBzZXR0aW5ncy5jdXJyZW50TGV2ZWwrKztcclxuICBidWlsZExldmVsKCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBidWlsZExldmVsKCl7XHJcbiAgbGV2ZWwgPSBsZXZlbHNbc2V0dGluZ3MuY3VycmVudExldmVsXTtcclxuICBsZXZlbC5maW5pc2hlZCA9IGZhbHNlO1xyXG5cclxuICBsZXZlbC5zdGFydERvb3IgPSBuZXcgRG9vcihhc3NldHMuZG9vciwgbGV2ZWwsIFwic3RhcnRcIik7XHJcbiAgbGV2ZWwuZW5kRG9vciA9IG5ldyBEb29yKGFzc2V0cy5kb29yLCBsZXZlbCwgXCJlbmRcIik7XHJcblxyXG4gIGxldmVsLmRpYW1vbmRzLmZvckVhY2goZGlhbW9uZCA9PiB7XHJcbiAgICBjb2xsZWN0YWJsZXMucHVzaChuZXcgRGlhbW9uZChkaWFtb25kLngsIGRpYW1vbmQueSwgYXNzZXRzLmRpYW1vbmQsIGxldmVsKSk7XHJcbiAgfSk7XHJcbiAgbGV2ZWwuY29sbGVjdGFibGVzID0gY29sbGVjdGFibGVzO1xyXG4gIHBsYXllciA9IG5ldyBQbGF5ZXIobGV2ZWwuc3RhcnRQb3oueCwgbGV2ZWwuc3RhcnRQb3oueSwgYXNzZXRzLnBsYXllciwgbGV2ZWwpO1xyXG4gIGxldmVsLnBsYXllciA9IHBsYXllcjtcclxuICBzZXR0aW5ncy5ibGFja291dExldmVsID0gMDtcclxuICBnYW1lTG9vcCgpO1xyXG59XHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpe1xyXG4gIGNvbnN0IGNvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29kZVwiKS52YWx1ZTtcclxuICBzZXR0aW5ncy5nYW1lUnVubmluZyA9IHRydWU7XHJcbiAgYWN0aW9uUXVldWUgPSBjb21waWxlKGNvZGUpO1xyXG5cclxuICAvLyBzZXR0aW5ncy5ibGFja291dExldmVsID0gMTtcclxuICBzZXR0aW5ncy5nYW1lSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChnYW1lTG9vcCwgc2V0dGluZ3MuYW5pbWF0aW9uU3BlZWQpO1xyXG59XHJcbmZ1bmN0aW9uIGVuZEdhbWUoKXtcclxuICBzZXR0aW5ncy5nYW1lUnVubmluZyA9IGZhbHNlO1xyXG4gIGNsZWFySW50ZXJ2YWwoc2V0dGluZ3MuZ2FtZUludGVydmFsKTtcclxuICBidWlsZExldmVsKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdhbWVMb29wKCl7XHJcbiAgZHJhd1BhbGV0dGUoKTtcclxuICBpZihzZXR0aW5ncy5nYW1lUnVubmluZyl7XHJcbiAgICB1cGRhdGVBbmltYXRpb25zKCk7XHJcbiAgICBjaGVja3MoKTtcclxuICAgIGlmKHBsYXllci5hY3Rpb25zID09PSAwICYmICFwbGF5ZXIuYnVtcGVkKVxyXG4gICAgICB1cGRhdGVRdWV1ZSgpO1xyXG4gIH1cclxuICBpZihsZXZlbC5maW5pc2hlZCl7XHJcbiAgICBhZHZhbmNlKCk7XHJcbiAgfVxyXG5cclxuICBpZihzZXR0aW5ncy5nYW1lUnVubmluZyl7XHJcbiAgICBpZihibGFja291dChmYWxzZSkpIGxldmVsLnN0YXJ0aW5nID0gZmFsc2U7XHJcbiAgICBcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgLy8gaWYobGV2ZWwuZmluaXNoZWQpe1xyXG4gIC8vICAgaWYoYmxhY2tvdXQodHJ1ZSkpIGFkdmFuY2UoKTtcclxuICAvLyAgIHJldHVybjtcclxuICAvLyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdQYWxldHRlKCl7XHJcbiAgLy8gdGVtcGxhdGVcclxuICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoNjMsIDU2LCA4MSlcIjtcclxuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICBcclxuICAvLyBiYWNrZ3JvdW5kXHJcbiAgbGV2ZWwuZHJhd0JhY2tncm91bmQoKTtcclxuICBsZXZlbC5lbmREb29yLmRyYXcoKTtcclxuICBsZXZlbC5zdGFydERvb3IuZHJhdygpO1xyXG4gIFxyXG4gIC8vIGZvcmVncm91bmQgIFxyXG4gIGxldmVsLmRyYXdGb3JlZ3JvdW5kKCk7XHJcbiAgXHJcbiAgLy8gb2JqZWN0c1xyXG4gIGNvbGxlY3RhYmxlcy5mb3JFYWNoKGNvbGxlY3RhYmxlID0+IGNvbGxlY3RhYmxlLmRyYXcoKSk7XHJcbiAgcGxheWVyLmRyYXcoKTtcclxuXHJcbiAgLy8gSFVEXHJcbiAgZHJhd1RleHQobGV2ZWwpO1xyXG4gIC8vIGV4aXRcclxuICBjdHguZmlsbFN0eWxlID0gYHJnYmEoNjMsIDU2LCA4MSwgJHtzZXR0aW5ncy5ibGFja291dExldmVsfSlgO1xyXG4gIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrcygpe1xyXG4gIGNvbGxlY3RhYmxlcy5mb3JFYWNoKGNvbGxlY3RhYmxlID0+IHtjb2xsZWN0YWJsZS5jaGVja0NvbGxlY3QoKX0pO1xyXG4gIGlmKCFsZXZlbC5lbmREb29yLmlzT3BlbiAmJiBjb2xsZWN0YWJsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGxldmVsLmVuZERvb3Iub3BlbigpO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVBbmltYXRpb25zKCl7XHJcbiAgcGxheWVyLnVwZGF0ZSgpO1xyXG4gIGxldmVsLnN0YXJ0RG9vci51cGRhdGUoKTtcclxuICBsZXZlbC5lbmREb29yLnVwZGF0ZSgpO1xyXG4gIGNvbGxlY3RhYmxlcy5mb3JFYWNoKChjb2xsZWN0YWJsZSkgPT4gY29sbGVjdGFibGUudXBkYXRlKCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVRdWV1ZSgpe1xyXG4gIGlmKGFjdGlvblF1ZXVlID09PSBudWxsKXtcclxuICAgIGVuZEdhbWUoKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYoYWN0aW9uUXVldWUubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgY29uc3QgYWN0aW9uID0gYWN0aW9uUXVldWUuc2hpZnQoKTtcclxuICBzd2l0Y2goYWN0aW9uLmNvbW1hbmQpe1xyXG4gICAgY2FzZSBcIm1vdmVSaWdodFwiOiB7XHJcbiAgICAgIGxldCBtb3ZlQnkgPSBhY3Rpb24ubW92ZUJ5O1xyXG5cclxuICAgICAgcGxheWVyLm1vdmVSaWdodChtb3ZlQnkpO1xyXG4gICAgICBicmVhayB9XHJcbiAgICBjYXNlIFwibW92ZUxlZnRcIjoge1xyXG4gICAgICBsZXQgbW92ZUJ5ID0gYWN0aW9uLm1vdmVCeTtcclxuXHJcbiAgICAgIHBsYXllci5tb3ZlTGVmdChtb3ZlQnkpO1xyXG4gICAgICBicmVhayB9XHJcbiAgICBjYXNlIFwianVtcFwiOiB7XHJcbiAgICAgIGxldCBkaXJlY3Rpb24gPSBhY3Rpb24uZGlyZWN0aW9uO1xyXG4gICAgICBcclxuICAgICAgcGxheWVyLmp1bXAoZGlyZWN0aW9uKTtcclxuICAgICAgYnJlYWsgfVxyXG4gICAgY2FzZSBcImF0dGFja1wiOiB7XHJcblxyXG4gICAgICBwbGF5ZXIuYXR0YWNrKCk7XHJcbiAgICAgIGJyZWFrIH1cclxuICAgIGNhc2UgXCJzdGFydFwiOntcclxuXHJcbiAgICAgIHBsYXllci5lbnRlcigpXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY2FzZSBcImVuZFwiOntcclxuXHJcbiAgICAgIGxldCBzdWNjZXNzID0gcGxheWVyLmV4aXQoKTtcclxuICAgICAgaWYoc3VjY2VzcyA9PT0gbnVsbClcclxuICAgICAgICBlbmRHYW1lKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfSBcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgKGUpID0+IHtcclxuICBcclxuICBpZihlLmtleSA9PT0gXCI7XCIpe1xyXG4gICAgc3RhcnRHYW1lKCk7XHJcbiAgfVxyXG4gIC8vIGlmKGUua2V5ID09PSAnZCcpe1xyXG4gIC8vICAgYWN0aW9uUXVldWUucHVzaCh7XHJcbiAgLy8gICAgIGNvbW1hbmQ6IFwibW92ZVJpZ2h0XCIsXHJcbiAgLy8gICAgIG1vdmVCeTogMSxcclxuICAvLyAgIH0pO1xyXG4gIC8vIH1cclxuICAvLyBlbHNlIGlmKGUua2V5ID09PSAnYScpe1xyXG4gIC8vICAgYWN0aW9uUXVldWUucHVzaCh7XHJcbiAgLy8gICAgIGNvbW1hbmQ6IFwibW92ZUxlZnRcIixcclxuICAvLyAgICAgbW92ZUJ5OiAxLFxyXG4gIC8vICAgfSk7XHJcbiAgLy8gfVxyXG4gIC8vIGVsc2UgaWYoZS5rZXkgPT09ICd3Jyl7XHJcbiAgLy8gICBhY3Rpb25RdWV1ZS5wdXNoKHtcclxuICAvLyAgICAgY29tbWFuZDogXCJqdW1wXCIsXHJcbiAgLy8gICAgIGRpcmVjdGlvbjogXCJ1cFwiLFxyXG4gIC8vICAgfSlcclxuICAvLyB9XHJcbiAgLy8gZWxzZSBpZihlLmtleSA9PT0gJ2UnKXtcclxuICAvLyAgIGFjdGlvblF1ZXVlLnB1c2goe1xyXG4gIC8vICAgICBjb21tYW5kOiBcImp1bXBcIixcclxuICAvLyAgICAgZGlyZWN0aW9uOiBcInJpZ2h0XCIsXHJcbiAgLy8gICB9KVxyXG4gIC8vIH1cclxuICAvLyBlbHNlIGlmKGUua2V5ID09PSAncScpe1xyXG4gIC8vICAgYWN0aW9uUXVldWUucHVzaCh7XHJcbiAgLy8gICAgIGNvbW1hbmQ6IFwianVtcFwiLFxyXG4gIC8vICAgICBkaXJlY3Rpb246IFwibGVmdFwiLFxyXG4gIC8vICAgfSlcclxuICAvLyB9XHJcbiAgLy8gZWxzZSBpZihlLmtleSA9PT0gJ2MnKXtcclxuICAvLyAgIGFjdGlvblF1ZXVlLnB1c2goe1xyXG4gIC8vICAgICBjb21tYW5kOiBcImF0dGFja1wiLFxyXG4gIC8vICAgfSlcclxuICAvLyB9XHJcbiAgLy8gZWxzZSBpZihlLmtleSA9PT0gXCIgXCIpe1xyXG4gIC8vICAgYWN0aW9uUXVldWUucHVzaCh7XHJcbiAgLy8gICAgIGNvbW1hbmQ6IFwiZW50ZXJcIlxyXG4gIC8vICAgfSlcclxuICAvLyB9XHJcbn0pO1xyXG5cclxuY29uc3QgYXNzZXRzID0ge307XHJcbmdldEFzc2V0cygpXHJcbi50aGVuKChsb2FkZWRBc3NldHMpID0+IHtcclxuICBPYmplY3QuYXNzaWduKGFzc2V0cywgbG9hZGVkQXNzZXRzKTtcclxuICBzZXR1cEdhbWUoKTtcclxufSk7XHJcblxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=