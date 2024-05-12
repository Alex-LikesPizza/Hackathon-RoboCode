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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUFlLDRDQUFnQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLE9BQU8sR0FBRyxLQUFLO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLFVBQVU7QUFDekQ7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5RE87QUFDQTtBQUNQO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixRQUFRO0FBQ2xDLHdCQUF3QixRQUFRO0FBQ2hDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QmtDO0FBQ3dDO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsbUJBQW1CLEtBQUssa0JBQWtCLEtBQUs7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksMkNBQUc7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFHO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFHO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBRztBQUNULE1BQU0sMkNBQUc7QUFDVCxNQUFNLDJDQUFHO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFHO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLHFCQUFxQjtBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFFBQVEsd0RBQVk7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFFBQVEsbURBQU87QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsUUFBUSxtREFBTztBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLGtEQUFNO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxRQUFRLHdEQUFZO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0YTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1REFBVztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFVBQVUsbUJBQW1CLDBCQUEwQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFFB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QTtBQUNBO0FBQ0E7QUFDQSxFQUFFLG9EQUFRO0FBQ1Y7QUFDQSxFQUFFLDJDQUFHLGlDQUFpQyx1QkFBdUI7QUFDN0QsRUFBRSwyQ0FBRyxnQkFBZ0IsOENBQU0sUUFBUSw4Q0FBTTtBQUN6QztBQUNBO0FBQ0EsdUNBQXVDLDJCQUEyQjtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0Esc0RBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9nYW1lLy4vYXNzZXRzLmpzIiwid2VicGFjazovL2dhbWUvLi9jYW52YXMuanMiLCJ3ZWJwYWNrOi8vZ2FtZS8uL2NsYXNzZXMuanMiLCJ3ZWJwYWNrOi8vZ2FtZS8uL2NvbXBpbGVyLmpzIiwid2VicGFjazovL2dhbWUvLi9lcnJvcnMuanMiLCJ3ZWJwYWNrOi8vZ2FtZS8uL2xldmVscy5qcyIsIndlYnBhY2s6Ly9nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2dhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZ2FtZS8uL2dhbWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24oKXtcclxuICBjb25zdCBhc3NldHMgPSB7XHJcbiAgICBwbGF5ZXI6IHtcclxuICAgICAgYXR0YWNrOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgZG9vckluOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgZG9vck91dDogbmV3IEltYWdlKCksXHJcbiAgICAgIGdyb3VuZDogbmV3IEltYWdlKCksXHJcbiAgICAgIGlkbGU6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBkaWU6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBydW46IG5ldyBJbWFnZSgpLFxyXG4gICAgICBqdW1wOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgZmFsbDogbmV3IEltYWdlKCksXHJcbiAgICAgIGhpdDogbmV3IEltYWdlKCksXHJcbiAgICB9LFxyXG4gICAgYm94OiB7XHJcbiAgICAgIGJveFBpZWNlMTogbmV3IEltYWdlKCksXHJcbiAgICAgIGJveFBpZWNlMjogbmV3IEltYWdlKCksXHJcbiAgICAgIGJveFBpZWNlMzogbmV3IEltYWdlKCksXHJcbiAgICAgIGJveFBpZWNlNDogbmV3IEltYWdlKCksXHJcbiAgICAgIGhpdDogbmV3IEltYWdlKCksXHJcbiAgICAgIGlkbGU6IG5ldyBJbWFnZSgpLFxyXG4gICAgfSxcclxuICAgIGRvb3I6IHtcclxuICAgICAgY2xvc2luZzogbmV3IEltYWdlKCksXHJcbiAgICAgIG9wZW5pbmc6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBpZGxlOiBuZXcgSW1hZ2UoKSxcclxuICAgIH0sXHJcbiAgICBkaWFtb25kOntcclxuICAgICAgaWRsZTogbmV3IEltYWdlKCksXHJcbiAgICAgIGRpc2FwcGVhcjogbmV3IEltYWdlKCksXHJcbiAgICB9LFxyXG4gICAgbWFwczoge1xyXG4gICAgICBsdmwxRm9yZWdyb3VuZDogbmV3IEltYWdlKCksXHJcbiAgICAgIGx2bDFCYWNrZ3JvdW5kOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgbHZsMkZvcmVncm91bmQ6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBsdmwyQmFja2dyb3VuZDogbmV3IEltYWdlKCksXHJcbiAgICAgIGx2bDNCYWNrZ3JvdW5kOiBuZXcgSW1hZ2UoKSxcclxuICAgICAgbHZsM0ZvcmVncm91bmQ6IG5ldyBJbWFnZSgpLFxyXG4gICAgICBsdmw0QmFja2dyb3VuZDogbmV3IEltYWdlKCksXHJcbiAgICAgIGx2bDRGb3JlZ3JvdW5kOiBuZXcgSW1hZ2UoKSxcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBsZXQgcHJvbWlzZXMgPSBbXTtcclxuICBmb3IobGV0IGZvbGRlciBpbiBhc3NldHMpe1xyXG4gICAgZm9yKGxldCBmaWxlIGluIGFzc2V0c1tmb2xkZXJdKXtcclxuICAgICAgbGV0IGltYWdlID0gYXNzZXRzW2ZvbGRlcl1bZmlsZV07XHJcbiAgICAgIGltYWdlLnNyYyA9IGAuL3Nwcml0ZXMvJHtmb2xkZXJ9LyR7ZmlsZX0ucG5nYDtcclxuXHJcbiAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoKTtcclxuICAgICAgICBpbWFnZS5vbmVycm9yID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBsb2FkaW5nIGltYWdlICR7aW1hZ2Uuc3JjfTpgLCBldmVudCk7XHJcbiAgICAgICAgICByZWplY3QoZXZlbnQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiBhc3NldHMpO1xyXG59IiwiZXhwb3J0IGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jYW52YXNcIik7XHJcbmV4cG9ydCBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJsYWNrb3V0KGlzSW5jcmVhc2luZyl7XHJcbiAgc2V0dGluZ3MuYmxhY2tvdXRMZXZlbCArPSAwLjEgKiAoaXNJbmNyZWFzaW5nPyAxIDogLTEpO1xyXG4gIGlmKGlzSW5jcmVhc2luZyAmJiBzZXR0aW5ncy5ibGFja291dExldmVsID49IDAuOTkpe1xyXG4gICAgc2V0dGluZ3MuYmxhY2tvdXRMZXZlbCA9IDE7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgaWYoIWlzSW5jcmVhc2luZyAmJiBzZXR0aW5ncy5ibGFja291dExldmVsIDw9IDAuMDEpe1xyXG4gICAgc2V0dGluZ3MuYmxhY2tvdXRMZXZlbCA9IDA7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdUZXh0KGxldmVsKSB7XHJcbiAgY29uc3QgbGV2ZWxJZCA9IFN0cmluZyhsZXZlbC5ucikucGFkU3RhcnQoMiwgJzAnKTtcclxuICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIjtcclxuICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYigxMTAsIDExMCwgMTEwKVwiO1xyXG4gIGN0eC5saW5lV2lkdGggPSA1O1xyXG4gIGN0eC5mb250ID0gYDIwcHggXCJQcmVzcyBTdGFydCAyUFwiLCBtb25vc3BhY2VgO1xyXG5cclxuICBjb25zdCB4ID0gMjA7XHJcbiAgY29uc3QgeSA9IGNhbnZhcy5oZWlnaHQgLSAyMDtcclxuICBjdHguc3Ryb2tlVGV4dChgTGV2ZWwgJHtsZXZlbElkfWAsIHgsIHkpO1xyXG4gIGN0eC5maWxsVGV4dChgTGV2ZWwgJHtsZXZlbElkfWAsIHgsIHkpO1xyXG59IiwiaW1wb3J0IHsgY3R4IH0gZnJvbSBcIi4vY2FudmFzLmpzXCI7XHJcbmltcG9ydCB7IGJ1bXBlZCwgaXNfVUlOVCwgaXNfZGlyZWN0aW9uLCBpc192YWxpZEV4aXQgfSBmcm9tIFwiLi9lcnJvcnMuanNcIjtcclxuY2xhc3MgR2FtZU9iamVjdCB7XHJcbiAgY29uc3RydWN0b3IocG96WCwgcG96WSwgYXNzZXRzLCBsZXZlbCwgdG90YWxGcmFtZXMpIHtcclxuICAgIHRoaXMueCA9IHBvelg7XHJcbiAgICB0aGlzLnkgPSBwb3pZO1xyXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgdGhpcy5ib3hTaXplWCA9IGxldmVsLmJveFNpemVYO1xyXG4gICAgdGhpcy5ib3hTaXplWSA9IGxldmVsLmJveFNpemVZO1xyXG4gICAgdGhpcy5hc3NldHMgPSBhc3NldHM7XHJcbiAgICB0aGlzLmFzc2V0ID0gYXNzZXRzLmlkbGU7XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gdG90YWxGcmFtZXM7XHJcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICB0aGlzLmZyYW1lV2lkdGggPSB0aGlzLmFzc2V0LndpZHRoIC8gdGhpcy50b3RhbEZyYW1lcztcclxuICAgIHRoaXMuZnJhbWVIZWlnaHQgPSB0aGlzLmFzc2V0LmhlaWdodDtcclxuICB9XHJcbiAgXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgaWYodGhpcy5hbmltYXRpb25TdGFzaXMgJiYgdGhpcy5jdXJyZW50RnJhbWUgPT09IHRoaXMudG90YWxGcmFtZXMgLSAxKSByZXR1cm47XHJcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9ICh0aGlzLmN1cnJlbnRGcmFtZSArIDEpICUgdGhpcy50b3RhbEZyYW1lcztcclxuICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIERvb3IgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuICBjb25zdHJ1Y3Rvcihhc3NldHMsIGxldmVsLCB0eXBlKXtcclxuICAgIHN1cGVyKGxldmVsW2Ake3R5cGV9UG96YF0ueCwgbGV2ZWxbYCR7dHlwZX1Qb3pgXS55LCBhc3NldHMsIGxldmVsLCAxKTtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmFuaW1hdGlvblN0YXNpcyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZHJhdygpIHtcclxuICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgIHRoaXMuYXNzZXQsXHJcbiAgICAgIHRoaXMuZnJhbWVXaWR0aCAqIHRoaXMuY3VycmVudEZyYW1lLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmZyYW1lV2lkdGgsXHJcbiAgICAgIHRoaXMuZnJhbWVIZWlnaHQsXHJcbiAgICAgICh0aGlzLnggLSAwLjEgLyAyKSAqIHRoaXMuYm94U2l6ZVgsXHJcbiAgICAgICh0aGlzLnkgLSAwLjYpICogdGhpcy5ib3hTaXplWSxcclxuICAgICAgdGhpcy5ib3hTaXplWCAqIDEuMSxcclxuICAgICAgdGhpcy5ib3hTaXplWSAqIDEuNlxyXG4gICAgKTtcclxuICB9XHJcbiAgb3Blbigpe1xyXG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgdGhpcy5hbmltYXRpb25TdGFzaXMgPSB0cnVlO1xyXG4gICAgdGhpcy5vcGVuaW5nQW5pbWF0aW9uKCk7XHJcbiAgfVxyXG4gIGNsb3NlKCl7XHJcbiAgICB0aGlzLmFuaW1hdGlvblN0YXNpcyA9IGZhbHNlO1xyXG4gICAgdGhpcy5jbG9zaW5nQW5pbWF0aW9uKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaWRsZSgpLCB0aGlzLnRvdGFsRnJhbWVzICogc2V0dGluZ3MuYW5pbWF0aW9uU3BlZWQpO1xyXG4gIH1cclxuICBpZGxlKCl7XHJcbiAgICB0aGlzLmFuaW1hdGlvblN0YXNpcyA9IGZhbHNlO1xyXG4gICAgdGhpcy5pZGxlQW5pbWF0aW9uKCk7XHJcbiAgfVxyXG4gIGVudGVyKCkge1xyXG4gICAgdGhpcy5vcGVuKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfSwgKHRoaXMudG90YWxGcmFtZXMgKyA4KSAqIHNldHRpbmdzLmFuaW1hdGlvblNwZWVkKTtcclxuICB9XHJcbiAgZXhpdCgpIHtcclxuICAgIHRoaXMubGV2ZWwuZmluaXNoZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jbG9zZSgpO1xyXG4gIH1cclxuXHJcbiAgY2xvc2luZ0FuaW1hdGlvbigpe1xyXG4gICAgdGhpcy5hc3NldCA9IHRoaXMuYXNzZXRzLmNsb3Npbmc7XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gMztcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICB9XHJcbiAgb3BlbmluZ0FuaW1hdGlvbigpe1xyXG4gICAgdGhpcy5hc3NldCA9IHRoaXMuYXNzZXRzLm9wZW5pbmc7XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gNTtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICB9XHJcbiAgaWRsZUFuaW1hdGlvbigpe1xyXG4gICAgdGhpcy5hc3NldCA9IHRoaXMuYXNzZXRzLmlkbGU7XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gMTtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICB9XHJcblxyXG59XHJcbmV4cG9ydCBjbGFzcyBEaWFtb25kIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcbiAgY29uc3RydWN0b3IocG96WCwgcG96WSwgYXNzZXQsIGxldmVsKSB7XHJcbiAgICBzdXBlcihwb3pYLCBwb3pZLCBhc3NldCwgbGV2ZWwsIDEwKTtcclxuICB9XHJcbiAgXHJcbiAgZHJhdygpIHtcclxuICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgdGhpcy5hc3NldCxcclxuICAgICAgdGhpcy5mcmFtZVdpZHRoICogdGhpcy5jdXJyZW50RnJhbWUsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRoaXMuZnJhbWVXaWR0aCxcclxuICAgICAgdGhpcy5mcmFtZUhlaWdodCxcclxuICAgICAgdGhpcy54ICogdGhpcy5ib3hTaXplWCArIHRoaXMuYm94U2l6ZVggKiAwLjA3LFxyXG4gICAgICB0aGlzLnkgKiB0aGlzLmJveFNpemVZICsgdGhpcy5ib3hTaXplWSAqIDAuMjUsXHJcbiAgICAgIHRoaXMuYm94U2l6ZVggLyAxLjQsXHJcbiAgICAgIHRoaXMuYm94U2l6ZVkgLyAxLjRcclxuICAgICk7XHJcbiAgfVxyXG4gIFxyXG4gIGNoZWNrQ29sbGVjdCgpe1xyXG4gICAgaWYoTWF0aC5yb3VuZCh0aGlzLmxldmVsLnBsYXllci54KSAgPT09IHRoaXMueCAmJiBNYXRoLnJvdW5kKHRoaXMubGV2ZWwucGxheWVyLnkpICA9PT0gdGhpcy55KXtcclxuICAgICAgdGhpcy5jb2xsZWN0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb2xsZWN0KCl7XHJcbiAgICBjb25zdCBpbmRleCA9IHRoaXMubGV2ZWwuY29sbGVjdGFibGVzLmluZGV4T2YodGhpcyk7XHJcbiAgICB0aGlzLmxldmVsLmNvbGxlY3RhYmxlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllciBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG4gIGNvbnN0cnVjdG9yKHBvelgsIHBvelksIGFzc2V0LCBsZXZlbCkge1xyXG4gICAgc3VwZXIocG96WCwgcG96WSwgYXNzZXQsIGxldmVsLCAxMSk7XHJcbiAgICB0aGlzLmZhY2luZyA9IFwicmlnaHRcIjtcclxuICAgIHRoaXMuYnVtcGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmFjdGlvbnMgPSAwO1xyXG4gIH1cclxuXHJcbiAgZHJhdygpIHtcclxuICBpZih0aGlzLmZhY2luZyA9PT0gXCJyaWdodFwiKXtcclxuICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICB0aGlzLmFzc2V0LFxyXG4gICAgICAgIHRoaXMuZnJhbWVXaWR0aCAqIHRoaXMuY3VycmVudEZyYW1lLFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgdGhpcy5mcmFtZVdpZHRoLFxyXG4gICAgICAgIHRoaXMuZnJhbWVIZWlnaHQsXHJcbiAgICAgICAgdGhpcy54ICogdGhpcy5ib3hTaXplWCAtIHRoaXMuYm94U2l6ZVggKiAwLjUsXHJcbiAgICAgICAgdGhpcy55ICogdGhpcy5ib3hTaXplWSAtIHRoaXMuYm94U2l6ZVkgKiAwLjg3LFxyXG4gICAgICAgIHRoaXMuYm94U2l6ZVggKiAyLjUsXHJcbiAgICAgICAgdGhpcy5ib3hTaXplWSAqIDIuNVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKHRoaXMuZmFjaW5nID09PSBcImxlZnRcIil7XHJcbiAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgIGN0eC5zY2FsZSgtMSwgMSk7XHJcbiAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgdGhpcy5hc3NldCxcclxuICAgICAgICB0aGlzLmZyYW1lV2lkdGggKiB0aGlzLmN1cnJlbnRGcmFtZSxcclxuICAgICAgICAwLFxyXG4gICAgICAgIHRoaXMuZnJhbWVXaWR0aCxcclxuICAgICAgICB0aGlzLmZyYW1lSGVpZ2h0LFxyXG4gICAgICAgIC0oKHRoaXMueCArIDIpICogdGhpcy5ib3hTaXplWCAtIHRoaXMuYm94U2l6ZVggKiAwLjUpLFxyXG4gICAgICAgIHRoaXMueSAqIHRoaXMuYm94U2l6ZVkgLSB0aGlzLmJveFNpemVZICogMC44NyxcclxuICAgICAgICB0aGlzLmJveFNpemVYICogMi41LFxyXG4gICAgICAgIHRoaXMuYm94U2l6ZVkgKiAyLjVcclxuICAgICAgKVxyXG4gICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjaGVja0JvdHRvbUNvbGxpc2lvbigpIHtcclxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKHRoaXMueSkgKyAxO1xyXG4gICAgbGV0IGNvbCA9IE1hdGhbdGhpcy5mYWNpbmcgPT09IFwibGVmdFwiPyBcImZsb29yXCIgOiBcImNlaWxcIl0odGhpcy54KTtcclxuICAgIGlmKCF0aGlzLmxldmVsLm1hcFtyb3ddKSByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiB0aGlzLmxldmVsLm1hcFtyb3ddW2NvbF0gIT09IDBcclxuXHJcbiAgfVxyXG4gIGNoZWNrTGVmdENvbGxpc2lvbihqdW1wID0gZmFsc2UpIHtcclxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKHRoaXMueSAtIGp1bXApO1xyXG4gICAgbGV0IGNvbCA9IE1hdGguZmxvb3IodGhpcy54IC0ganVtcCArIDAuMDEpO1xyXG4gICAgcmV0dXJuIHRoaXMubGV2ZWwubWFwW3Jvd11bY29sXSA9PT0gMVxyXG4gIH1cclxuICBjaGVja1JpZ2h0Q29sbGlzaW9uKGp1bXAgPSBmYWxzZSl7XHJcbiAgICBsZXQgcm93ID0gTWF0aC5mbG9vcih0aGlzLnkgLSBqdW1wKTtcclxuICAgIGxldCBjb2wgPSBNYXRoLmNlaWwodGhpcy54ICsganVtcCk7XHJcbiAgICByZXR1cm4gdGhpcy5sZXZlbC5tYXBbcm93XVtjb2xdID09PSAxXHJcbiAgfVxyXG4gIGNoZWNrVG9wQ29sbGlzaW9uKCl7XHJcbiAgICBsZXQgcm93ID0gTWF0aC5mbG9vcih0aGlzLnkgLSAwLjAxKTtcclxuICAgIGxldCBjb2wgPSBNYXRoW3RoaXMuZmFjaW5nID09PSBcImxlZnRcIj8gXCJjZWlsXCIgOiBcImZsb29yXCJdKHRoaXMueCk7XHJcbiAgICBpZighdGhpcy5sZXZlbC5tYXBbcm93XSkgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gdGhpcy5sZXZlbC5tYXBbcm93XVtjb2xdID09PSAxIHx8IHRoaXMubGV2ZWwubWFwW3Jvd11bY29sXSA9PT0gMztcclxuICB9XHJcbiAgaWRsZSgpe1xyXG4gICAgaWYodGhpcy54ICUgMSB8fCB0aGlzLnkgJSAxKVxyXG4gICAgICBjb25zb2xlLmVycm9yKFwiRGVjaW1hbCBwb3ppdGlvbiBkZXRlY3RlZCBpbiBpZGxlIHN0YXRlOiBcIix7eDogdGhpcy54LCB5OiB0aGlzLnl9KTtcclxuICAgIHRoaXMuZmFsbGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5pZGxlQW5pbWF0aW9uKCk7XHJcbiAgfVxyXG4gIGZhbGwoanVtcCA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLmFjdGlvbnMrKztcclxuICAgIGxldCBncmF2aXR5ID0ganVtcCA/IDAuMSA6IDAuMDg7XHJcbiAgICBsZXQgdmVsb2NpdHkgPSAwO1xyXG4gICAgbGV0IHNwZWVkID0gc2V0dGluZ3MuZ2FtZVNwZWVkO1xyXG4gICAgdGhpcy5mYWxsaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuZmFsbEFuaW1hdGlvbigpO1xyXG4gIFxyXG4gICAgY29uc3QgbW92aW5nID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB0aGlzLnkgKz0gdmVsb2NpdHk7XHJcbiAgICAgIHZlbG9jaXR5ICs9IGdyYXZpdHk7XHJcbiAgICAgIGlmICh0aGlzLmNoZWNrQm90dG9tQ29sbGlzaW9uKCkpIHtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKHRoaXMueSk7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb3ZpbmcpO1xyXG4gICAgICAgIHRoaXMuaWRsZSgpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy0tO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfSwgc3BlZWQpO1xyXG4gIH1cclxuICBqdW1wKGRpcmVjdGlvbikge1xyXG4gICAgaWYoIWlzX2RpcmVjdGlvbihkaXJlY3Rpb24pICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IFwianVtcFwiO1xyXG4gICAgdGhpcy5hY3Rpb25zKys7XHJcbiAgICBsZXQgbWF4SGVpZ2h0ID0gMC43NTtcclxuICAgIGxldCBncmF2aXR5ID0gMC4xNTtcclxuICAgIGxldCB2ZWxvY2l0eSA9IE1hdGguc3FydChtYXhIZWlnaHQgKiBncmF2aXR5ICogMik7XHJcbiAgICBsZXQgc3BlZWQgPSBzZXR0aW5ncy5nYW1lU3BlZWQ7XHJcbiAgICBcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpZihkaXJlY3Rpb24gPT09IFwibGVmdFwiKSB0aGlzLm1vdmVMZWZ0KDEsIHRydWUpO1xyXG4gICAgICBpZihkaXJlY3Rpb24gPT09IFwicmlnaHRcIikgdGhpcy5tb3ZlUmlnaHQoMSwgdHJ1ZSk7XHJcbiAgICB9LCBzZXR0aW5ncy5nYW1lU3BlZWQgKiAwLjUpXHJcblxyXG4gICAgdGhpcy5qdW1wQW5pbWF0aW9uKCk7XHJcbiAgICBjb25zdCBtb3ZpbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmICh2ZWxvY2l0eSA8PSAwKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb3ZpbmcpXHJcbiAgICAgICAgdGhpcy5mYWxsKHRydWUpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy0tO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5jaGVja1RvcENvbGxpc2lvbigpKXtcclxuICAgICAgICBjbGVhckludGVydmFsKG1vdmluZyk7XHJcbiAgICAgICAgdGhpcy5kaWUoKTtcclxuICAgICAgICB0aGlzLmZhbGwoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy55IC09IHZlbG9jaXR5O1xyXG4gICAgICB2ZWxvY2l0eSAtPSBncmF2aXR5O1xyXG4gICAgfSwgc3BlZWQpO1xyXG4gIH1cclxuICBtb3ZlUmlnaHQoeCwganVtcCA9IGZhbHNlKXtcclxuICAgIGlmKCFpc19VSU5UKHgpKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY3Rpb25zKys7XHJcbiAgICB0aGlzLmZhY2luZyA9IFwicmlnaHRcIjtcclxuICAgIGxldCBzcGVlZCA9IHNldHRpbmdzLmdhbWVTcGVlZCAqIDAuNTtcclxuICAgIGxldCBzdGVwID0gMC4xO1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgXHJcbiAgICBpZighanVtcCl0aGlzLnJ1bkFuaW1hdGlvbigpO1xyXG4gICAgaWYoanVtcCAmJiB0aGlzLmNoZWNrUmlnaHRDb2xsaXNpb24odHJ1ZSkpe1xyXG4gICAgICB0aGlzLmRpZSgpO1xyXG4gICAgICB0aGlzLmFjdGlvbnMtLTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY29uc3QgbW92aW5nID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB0aGlzLnggKz0gc3RlcDtcclxuICAgICAgaWYoaSA+PSB4IC8gc3RlcCl7XHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5mbG9vcih0aGlzLngpO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobW92aW5nKTtcclxuICAgICAgICBpZighanVtcCAmJiAhdGhpcy5mYWxsaW5nKXRoaXMuaWRsZSgpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy0tO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYoIWp1bXAgJiYgdGhpcy5jaGVja1JpZ2h0Q29sbGlzaW9uKCkpe1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobW92aW5nKTtcclxuICAgICAgICB0aGlzLmRpZSgpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy0tO1xyXG4gICAgICB9O1xyXG4gICAgICBpZighanVtcCAmJiAhdGhpcy5jaGVja0JvdHRvbUNvbGxpc2lvbigpICYmICF0aGlzLmZhbGxpbmcpe1xyXG4gICAgICAgIHRoaXMuZmFsbCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHRoaXMuYnVtcGVkKXtcclxuICAgICAgICB0aGlzLnggLT0gc3RlcDtcclxuICAgICAgICBjbGVhckludGVydmFsKG1vdmluZyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGkrKztcclxuICAgIH0sIHNwZWVkKTtcclxuICB9XHJcbiAgbW92ZUxlZnQoeCwganVtcCA9IGZhbHNlKXtcclxuICAgIGlmKCFpc19VSU5UKHgpKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY3Rpb25zKys7XHJcbiAgICB0aGlzLmZhY2luZyA9IFwibGVmdFwiO1xyXG4gICAgbGV0IHNwZWVkID0gc2V0dGluZ3MuZ2FtZVNwZWVkICogMC41O1xyXG4gICAgbGV0IHN0ZXAgPSAwLjE7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBcclxuICAgIGlmKCFqdW1wKXRoaXMucnVuQW5pbWF0aW9uKCk7XHJcbiAgICBpZihqdW1wICYmIHRoaXMuY2hlY2tMZWZ0Q29sbGlzaW9uKHRydWUpKXtcclxuICAgICAgdGhpcy5kaWUoKTtcclxuICAgICAgdGhpcy5hY3Rpb25zLS07XHJcbiAgICAgIHJldHVyblxyXG4gICAgfTtcclxuICAgIFxyXG5cclxuICAgIGNvbnN0IG1vdmluZyA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdGhpcy54IC09IHN0ZXA7XHJcbiAgICAgIGlmKGkgPj0geCAvIHN0ZXApe1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGguY2VpbCh0aGlzLngpO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobW92aW5nKTtcclxuICAgICAgICBpZighanVtcCAmJiAhdGhpcy5mYWxsaW5nKSB0aGlzLmlkbGUoKTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMtLTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKCFqdW1wICYmIHRoaXMuY2hlY2tMZWZ0Q29sbGlzaW9uKCkpe1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobW92aW5nKTtcclxuICAgICAgICB0aGlzLmRpZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfTtcclxuICAgICAgaWYoIWp1bXAgJiYgIXRoaXMuY2hlY2tCb3R0b21Db2xsaXNpb24oKSAmJiAhdGhpcy5mYWxsaW5nKXtcclxuICAgICAgICB0aGlzLmZhbGwoKTtcclxuICAgICAgfVxyXG4gICAgICBpZih0aGlzLmJ1bXBlZCl7XHJcbiAgICAgICAgdGhpcy54ICs9IHN0ZXA7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChtb3ZpbmcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpKys7XHJcbiAgICB9LCBzcGVlZCk7XHJcbiAgfVxyXG4gIGF0dGFjaygpe1xyXG4gICAgdGhpcy5hdHRhY2tBbmltYXRpb24oKTtcclxuICAgIHRoaXMuYWN0aW9ucysrO1xyXG4gICAgdGhpcy5hbmltYXRpb25TdGFzaXMgPSB0cnVlO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuaWRsZSgpXHJcbiAgICAgIHRoaXMuYWN0aW9ucy0tO1xyXG4gICAgICB0aGlzLmFuaW1hdGlvblN0YXNpcyA9IGZhbHNlO1xyXG4gICAgfSwgc2V0dGluZ3MuYW5pbWF0aW9uU3BlZWQgKiB0aGlzLnRvdGFsRnJhbWVzKTtcclxuICB9XHJcbiAgZGllKCl7XHJcbiAgICBidW1wZWQoKTtcclxuICAgIHRoaXMuYnVtcGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuZGllQW5pbWF0aW9uKCk7XHJcbiAgICB0aGlzLnggPSBNYXRoW3RoaXMuZmFjaW5nID09PSBcImxlZnRcIj8gXCJjZWlsXCIgOiBcImZsb29yXCJdKHRoaXMueCk7XHJcbiAgICB0aGlzLnkgPSBNYXRoLmZsb29yKHRoaXMueSk7XHJcbiAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgaWYodGhpcy5jdXJyZW50RnJhbWUgPT09IHRoaXMudG90YWxGcmFtZXMgLSAxKSByZXR1cm47XHJcbiAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gKHRoaXMuY3VycmVudEZyYW1lICsgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVudGVyKCl7XHJcbiAgICB0aGlzLmxldmVsLnN0YXJ0RG9vci5lbnRlcigpO1xyXG4gICAgdGhpcy5hY3Rpb25zKys7XHJcbiAgICBjb25zdCBkcmF3Q3B5ID0gdGhpcy5kcmF3O1xyXG4gICAgdGhpcy5kcmF3ID0gKCkgPT4ge307XHJcbiAgICBcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLmRyYXcgPSBkcmF3Q3B5O1xyXG4gICAgICB0aGlzLmRvb3JPdXQoKVxyXG4gICAgICBcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pZGxlKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLS07XHJcbiAgICAgIH0sIHRoaXMudG90YWxGcmFtZXMgKiBzZXR0aW5ncy5hbmltYXRpb25TcGVlZClcclxuICAgIH0sIDUgKiBzZXR0aW5ncy5hbmltYXRpb25TcGVlZCk7XHJcbiAgfVxyXG4gIGV4aXQoKXtcclxuICAgIGlmKCFpc192YWxpZEV4aXQodGhpcykpe1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHRoaXMubGV2ZWwuZW5kRG9vci5leGl0KCk7XHJcbiAgICB0aGlzLmFjdGlvbnMrKztcclxuICAgIHRoaXMuZG9vckluKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5hY3Rpb25zLS07XHJcbiAgICAgIHRoaXMuZHJhdyA9ICgpID0+IHt9O1xyXG4gICAgICB0aGlzLmxldmVsLmVuZERvb3IuZXhpdCgpO1xyXG4gICAgfSwgdGhpcy50b3RhbEZyYW1lcyAqIHNldHRpbmdzLmFuaW1hdGlvblNwZWVkKTtcclxuICB9XHJcbiAgZG9vckluKCl7XHJcbiAgICB0aGlzLmRvb3JJbkFuaW1hdGlvbigpO1xyXG4gIH1cclxuICBkb29yT3V0KCl7XHJcbiAgICB0aGlzLmRvb3JPdXRBbmltYXRpb24oKTtcclxuICB9XHJcbiAgcnVuQW5pbWF0aW9uKCl7XHJcbiAgICBpZih0aGlzLmJ1bXBlZClyZXR1cm47XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMucnVuO1xyXG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IDg7XHJcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgfVxyXG4gIGlkbGVBbmltYXRpb24oKXtcclxuICAgIGlmKHRoaXMuYnVtcGVkKSByZXR1cm47XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMuaWRsZTtcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSAxMTtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMTtcclxuICB9XHJcbiAganVtcEFuaW1hdGlvbigpe1xyXG4gICAgaWYodGhpcy5idW1wZWQpIHJldHVybjtcclxuICAgIHRoaXMuYXNzZXQgPSB0aGlzLmFzc2V0cy5qdW1wO1xyXG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IDE7XHJcbiAgfVxyXG4gIGZhbGxBbmltYXRpb24oKXtcclxuICAgIGlmKHRoaXMuYnVtcGVkKSByZXR1cm47XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMuZmFsbDtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSAxO1xyXG4gIH1cclxuICBhdHRhY2tBbmltYXRpb24oKXtcclxuICAgIGlmKHRoaXMuYnVtcGVkKSByZXR1cm47XHJcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hc3NldHMuYXR0YWNrO1xyXG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgdGhpcy50b3RhbEZyYW1lcyA9IDM7XHJcbiAgfVxyXG4gIGRpZUFuaW1hdGlvbigpe1xyXG4gICAgdGhpcy5hc3NldCA9IHRoaXMuYXNzZXRzLmRpZTtcclxuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICAgIHRoaXMudG90YWxGcmFtZXMgPSA0O1xyXG4gIH1cclxuICBkb29ySW5BbmltYXRpb24oKXtcclxuICAgIHRoaXMuYXNzZXQgPSB0aGlzLmFzc2V0cy5kb29ySW47XHJcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gODtcclxuICB9XHJcbiAgZG9vck91dEFuaW1hdGlvbigpe1xyXG4gICAgdGhpcy5hc3NldCA9IHRoaXMuYXNzZXRzLmRvb3JPdXQ7XHJcbiAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICB0aGlzLnRvdGFsRnJhbWVzID0gODtcclxuICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGlzU3RhdGVtZW50IH0gZnJvbSBcIi4vZXJyb3JzLmpzXCI7XHJcblxyXG5mdW5jdGlvbiB0b2tlbml6ZUNvZGUoY29kZSl7XHJcbiAgbGV0IGNvZGVSb3dzID0gY29kZS5zcGxpdCgnXFxuJyk7XHJcbiAgY29kZVJvd3MgPSBjb2RlUm93cy5tYXAocm93ID0+IHJvdy5zcGxpdCgnIycpWzBdLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCkpO1xyXG4gIHJldHVybiBjb2RlUm93cztcclxufVxyXG5cclxuZnVuY3Rpb24gY29tcGlsZUNvZGUodG9rZW5pemVkQ29kZSl7XHJcbiAgbGV0IGFjdGlvbnMgPSBbXTtcclxuICBmb3IgKGxldCB0b2tlbml6ZWRSb3cgb2YgdG9rZW5pemVkQ29kZSkge1xyXG4gICAgaWYoIWlzU3RhdGVtZW50KHRva2VuaXplZFJvdykpIHJldHVybiBudWxsO1xyXG4gICAgaWYodG9rZW5pemVkUm93ID09PSBcIlwiKSBjb250aW51ZTtcclxuICAgIGNvbnN0IHRva2VucyA9IHRva2VuaXplZFJvdy5zcGxpdChcIiBcIik7XHJcbiAgICBsZXQgY29tbWFuZCA9IHRva2Vucy5zaGlmdCgpO1xyXG4gICAgbGV0IGFyZ3MgPSBbLi4udG9rZW5zXTtcclxuICAgIGxldCBhY3Rpb24gPSB7fTtcclxuICAgIHN3aXRjaChjb21tYW5kKXtcclxuICAgICAgY2FzZSBcIndhbGtcIjoge1xyXG4gICAgICAgIGxldCBjb21tYW5kID0gYXJnc1swXSA9PT0gXCJyaWdodFwiPyBcIm1vdmVSaWdodFwiIDogXCJtb3ZlTGVmdFwiO1xyXG4gICAgICAgIC8vIGlmKGFjdGlvbnNbYWN0aW9ucy5sZW5ndGggLSAxXS5jb21tYW5kID09PSBjb21tYW5kKSB7XHJcbiAgICAgICAgLy8gICBhY3Rpb25zW2FjdGlvbnMubGVuZ3RoIC0gMV0ubW92ZUJ5Kys7XHJcbiAgICAgICAgLy8gICBjb250aW51ZTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgYWN0aW9uID0ge2NvbW1hbmQsIG1vdmVCeTogMX07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBcImp1bXBcIjoge1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBhcmdzWzBdO1xyXG4gICAgICAgIGFjdGlvbiA9IHtjb21tYW5kOiBcImp1bXBcIiwgZGlyZWN0aW9ufTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIFwiYXR0YWNrXCI6IHtcclxuICAgICAgICBhY3Rpb24gPSB7Y29tbWFuZDogXCJhdHRhY2tcIn07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBcInN0YXJ0XCI6IHtcclxuICAgICAgICBhY3Rpb24gPSB7Y29tbWFuZDogXCJzdGFydFwifTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIFwiZW5kXCI6IHtcclxuICAgICAgICBhY3Rpb24gPSB7Y29tbWFuZDogXCJlbmRcIn07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBcImlmXCI6IHtcclxuICAgICAgICBhY3Rpb24gPSBjb21waWxlSWZTdGF0ZW1lbnQoYXJncyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFjdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBpbGVJZlN0YXRlbWVudCh0b2tlbnMpe1xyXG4gIGxldCBuZWdhdGUgPSBmYWxzZTtcclxuICAvKlxyXG4gICAgaWYgZmFjaW5nIGRvb3Ivd2FsbC9kaWFtb25kLi4uXHJcbiAgICBpZiBub3QgZmFjaW5nIGRvb3Ivd2FsbC9kaWFtb25kLi4uXHJcbiAgICBpZiBvbiBmbG9vci9wbGF0Zm9ybS4uLlxyXG4gICAgaWYgb24gZmxvb3Igb3IgZmFjaW5nIGRvb3JcclxuICAgIGlmIG9uIGZsb29yIGFuZCBmYWNpbmcgd2FsbCBvciBmYWNpbmcgZG9vclxyXG4gICAgaWYgb24gZG9vciBvciBmYWNpbmcgZG9vciBhbmQgb24gcGxhdGZvcm1cclxuXHJcblxyXG4gICovXHJcbiAgZm9yKGxldCB0b2tlbiBvZiB0b2tlbnMpe1xyXG5cclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZShjb2RlKXtcclxuICBjb25zdCB0b2tlbml6ZWRDb2RlID0gdG9rZW5pemVDb2RlKGNvZGUpO1xyXG4gIGNvbnN0IGNvbXBpbGVkQ29kZSA9IGNvbXBpbGVDb2RlKHRva2VuaXplZENvZGUpO1xyXG5cclxuICByZXR1cm4gY29tcGlsZWRDb2RlO1xyXG59IiwiZnVuY3Rpb24gaW52YWxpZF9VSU5UKHgpe1xyXG4gIGNvbnNvbGUuZXJyb3IoeCArIFwiIGlzIG5vdCBhIHZhbGlkIHBvc2l0aXZlIGludGVnZXJcIik7XHJcbn07XHJcbmZ1bmN0aW9uIGludmFsaWRfZGlyZWN0aW9uKGRpcmVjdGlvbiwgd2Fsa2luZyA9IGZhbHNlKXtcclxuICBjb25zb2xlLmVycm9yKGBcIiR7ZGlyZWN0aW9ufVwiIGlzIG5vdCBhIHZhbGlkICR7d2Fsa2luZz8gXCJ3YWxrYWJsZSBcIiA6IFwiXCJ9ZGlyZWN0aW9uYCk7XHJcbn1cclxuZnVuY3Rpb24gaW52YWxpZF9kb29yQWNjZXNzUG9zaXRpb24oKXtcclxuICBjb25zb2xlLmVycm9yKFwiWW91IG5lZWQgdG8gYmUgb24gdGhlIGRvb3IgdG8gYWNjZXNzIGl0XCIpO1xyXG59XHJcbmZ1bmN0aW9uIGludmFsaWRfZG9vck9wZW5TdGF0ZSgpe1xyXG4gIGNvbnNvbGUuZXJyb3IoXCJUaGUgZG9vciBuZWVkcyB0byBiZSBvcGVuIHRvIGFjY2VzcyBpdC5cXG4gQ29sbGVjdCBhbGwgZGlhbW9uZHMgdG8gb3BlbiBpdFwiKTtcclxufVxyXG5mdW5jdGlvbiBpbnZhbGlkX2Rvb3JUeXBlKCl7XHJcbiAgY29uc29sZS5lcnJvcihcIllvdSBhcmUgdHJ5aW5nIHRvIGFjY2VzcyB0aGUgd3JvbmcgZG9vclwiKTtcclxufVxyXG5mdW5jdGlvbiBpbnZhbGlkX2NvbW1hbmQoY29tbWFuZCl7XHJcbiAgY29uc29sZS5lcnJvcihgXCIke2NvbW1hbmR9XCIgaXMgbm90IGEgdmFsaWQgY29tbWFuZGApO1xyXG59XHJcbmZ1bmN0aW9uIGludmFsaWRfYXJndW1lbnROdW1iZXIoZXhjZWVkaW5nKXtcclxuICBjb25zb2xlLmVycm9yKGAke2V4Y2VlZGluZz8gXCJUb28gbWFueVwiOiBcIkluc3VmZmljaWVudFwifSBhcmd1bWVudHNgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzX3ZhbGlkRXhpdChwbGF5ZXIpe1xyXG4gIGlmKHBsYXllci54ID09PSBwbGF5ZXIubGV2ZWwuc3RhcnREb29yLnggJiYgcGxheWVyLnkgPT09IHBsYXllci5sZXZlbC5zdGFydERvb3IueSl7XHJcbiAgICBpbnZhbGlkX2Rvb3JUeXBlKCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIGlmKHBsYXllci54ICE9PSBwbGF5ZXIubGV2ZWwuZW5kRG9vci54IHx8IHBsYXllci55ICE9PSBwbGF5ZXIubGV2ZWwuZW5kRG9vci55KXtcclxuICAgIGludmFsaWRfZG9vckFjY2Vzc1Bvc2l0aW9uKCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIGlmKCFwbGF5ZXIubGV2ZWwuZW5kRG9vci5pc09wZW4pe1xyXG4gICAgaW52YWxpZF9kb29yT3BlblN0YXRlKCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc19VSU5UKHgpe1xyXG4gIGlmKCFOdW1iZXIuaXNJbnRlZ2VyKHgpIHx8IHggPCAwKXtcclxuICAgIGludmFsaWRfVUlOVCh4KTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzX2RpcmVjdGlvbihkaXJlY3Rpb24sIHdhbGtpbmcgPSBmYWxzZSl7XHJcbiAgc3dpdGNoKGRpcmVjdGlvbil7XHJcbiAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgY2FzZSBcInJpZ2h0XCI6IFxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGNhc2UgXCJ1cFwiOlxyXG4gICAgICBpZih3YWxraW5nKXtcclxuICAgICAgICBpbnZhbGlkX2RpcmVjdGlvbihkaXJlY3Rpb24sIHRydWUpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGludmFsaWRfZGlyZWN0aW9uKGRpcmVjdGlvbik7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzX2FyZ3VtZW50TnVtYmVyQ29ycmVjdChuLCBhcmdMZW4pe1xyXG4gIGlmKGFyZ0xlbiA+IG4pe1xyXG4gICAgaW52YWxpZF9hcmd1bWVudE51bWJlcih0cnVlKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgZWxzZSBpZihhcmdMZW4gPCBuKXtcclxuICAgIGludmFsaWRfYXJndW1lbnROdW1iZXIoZmFsc2UpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1bXBlZCgpe1xyXG4gIGNvbnNvbGUuZXJyb3IoXCJZb3UgYnVtcGVkIGludG8gYSB3YWxsXCIpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0NvbW1hbmQoY29tbWFuZCl7XHJcbiAgY29uc3QgY29tbWFuZHMgPSBbXCJzdGFydFwiLCBcImVuZFwiLCBcIndhbGtcIiwgXCJqdW1wXCIsIFwiYXR0YWNrXCIsIFwiXCJdO1xyXG4gIGlmKCFjb21tYW5kcy5pbmNsdWRlcyhjb21tYW5kKSl7XHJcbiAgICBpbnZhbGlkX2NvbW1hbmQoY29tbWFuZCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNTdGF0ZW1lbnQoc3RhdGVtZW50KXtcclxuICBzdGF0ZW1lbnQgPSBzdGF0ZW1lbnQuc3BsaXQoXCIgXCIpO1xyXG4gIGNvbnN0IGNvbW1hbmQgPSBzdGF0ZW1lbnQuc2hpZnQoKTtcclxuICBjb25zdCBhcmdzID0gWy4uLnN0YXRlbWVudF07XHJcbiAgaWYoIWlzQ29tbWFuZChjb21tYW5kKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBsZXQgYXJnc0xlbiA9IGFyZ3MubGVuZ3RoO1xyXG4gIHN3aXRjaChjb21tYW5kKXtcclxuICAgIGNhc2UgXCJ3YWxrXCI6IHtcclxuICAgICAgaWYoIWlzX2FyZ3VtZW50TnVtYmVyQ29ycmVjdCgxLCBhcmdzTGVuKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZighaXNfZGlyZWN0aW9uKGFyZ3NbMF0sIHRydWUpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgY2FzZSBcImp1bXBcIjoge1xyXG4gICAgICBpZighaXNfYXJndW1lbnROdW1iZXJDb3JyZWN0KDEsIGFyZ3NMZW4pKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKCFpc19kaXJlY3Rpb24oYXJnc1swXSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBjYXNlIFwiYXR0YWNrXCI6XHJcbiAgICBjYXNlIFwic3RhcnRcIjpcclxuICAgIGNhc2UgXCJlbmRcIjoge1xyXG4gICAgICBpZighaXNfYXJndW1lbnROdW1iZXJDb3JyZWN0KDAsIGFyZ3NMZW4pKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgY2FzZSBcIlwiOiByZXR1cm4gdHJ1ZTtcclxuICAgIGRlZmF1bHQ6IHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgY2FudmFzLCBjdHggfSBmcm9tIFwiLi9jYW52YXMuanNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBsZXZlbHNQcm9wZXJ0aWVzID0gW1xyXG4gIG51bGwsXHJcbiAgeyBtYXA6IFtcclxuICAgICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcbiAgICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgICAgWzEsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDFdLFxyXG4gICAgICBbMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMV0sXHJcbiAgICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAwLCAwLCAxLCAxXSxcclxuICAgICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDEsIDFdLFxyXG4gICAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcbiAgICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG4gICAgXSxcclxuICAgIGRpYW1vbmRzOiBbXHJcbiAgICB7eDogMiwgeTogNH0sIHt4OiAxMiwgeTogNn1dLFxyXG4gICAgc3RhcnRQb3o6IHt4OiAzLCB5OiA0fSxcclxuICAgIGVuZFBvejoge3g6IDExLCB5OiA2fSxcclxuICB9LFxyXG4gIHsgbWFwOiBbXHJcbiAgICAgIFswLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwXSxcclxuICAgICAgWzAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDBdLFxyXG4gICAgICBbMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMF0sXHJcbiAgICAgIFswLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAwXSxcclxuICAgICAgWzAsIDEsIDIsIDIsIDIsIDIsIDIsIDIsIDIsIDIsIDIsIDIsIDEsIDEsIDBdLFxyXG4gICAgICBbMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMF0sXHJcbiAgICAgIFswLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwXSxcclxuICAgICAgWzAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDBdLFxyXG4gICAgICBbMCwgMSwgMCwgMCwgMCwgMCwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMF0sXHJcbiAgICAgIFswLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAwXSxcclxuICAgIF0sXHJcbiAgICBkaWFtb25kczogW1xyXG4gICAge3g6IDEwLCB5OiA2fSwge3g6IDUsIHk6IDZ9LCB7eDogNiwgeTogOH1dLFxyXG4gICAgc3RhcnRQb3o6IHt4OiAyLCB5OiA4fSxcclxuICAgIGVuZFBvejoge3g6IDExLCB5OiA2fSxcclxuICB9LFxyXG4gIHsgXHJcbiAgICBtYXA6IFtcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxXSxcclxuICAgIFsxLCAzLCAzLCAzLCAzLCAzLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxXSxcclxuICAgIFsxLCAxLCAwLCAwLCAwLCAwLCAyLCAzLCAzLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAxLCAwLCAwLCAwLCAwLCAyLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAxLCAwLCAwLCAwLCAyLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAxLCAwLCAwLCAyLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAxLCAwLCAyLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuICAgIF0sXHJcbiAgICBkaWFtb25kczogW1xyXG4gICAge3g6IDIsIHk6IDF9LCB7eDogNywgeTogNH0sIHt4OiAyLCB5OiA3fV0sXHJcbiAgICBzdGFydFBvejoge3g6IDcsIHk6IDd9LFxyXG4gICAgZW5kUG96OiB7eDogMTEsIHk6IDJ9LFxyXG4gIH0seyBcclxuICAgIG1hcDogW1xyXG4gICAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sIFxyXG4gICAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sIFxyXG4gICAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sIFxyXG4gICAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMywgMSwgMSwgMV0sIFxyXG4gICAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMywgMSwgMCwgMCwgMCwgMV0sIFxyXG4gICAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMywgMSwgMCwgMCwgMCwgMCwgMCwgMV0sIFxyXG4gICAgICBbMSwgMCwgMCwgMiwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sIFxyXG4gICAgICBbMSwgMCwgMCwgMiwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sIFxyXG4gICAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sIFxyXG4gICAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcbiAgICBdLFxyXG4gICAgZGlhbW9uZHM6IFtcclxuICAgIHt4OiAxMCwgeTogNn1dLFxyXG4gICAgc3RhcnRQb3o6IHt4OiAyLCB5OiA3fSxcclxuICAgIGVuZFBvejoge3g6IDEzLCB5OiAyfSxcclxuICB9LFxyXG4gIFxyXG5dXHJcblxyXG5leHBvcnQgY2xhc3MgTGV2ZWx7XHJcbiAgY29uc3RydWN0b3IobnIsIG1hcCwgYXNzZXRzKXtcclxuICAgIHRoaXMuc2l6ZVkgPSBtYXAubGVuZ3RoO1xyXG4gICAgdGhpcy5zaXplWCA9IG1hcFswXS5sZW5ndGg7XHJcbiAgICB0aGlzLm1hcCA9IG1hcDtcclxuICAgIHRoaXMuYm94U2l6ZVggPSBjYW52YXMud2lkdGggLyB0aGlzLnNpemVYOyBcclxuICAgIHRoaXMuYm94U2l6ZVkgPSBjYW52YXMuaGVpZ2h0IC8gdGhpcy5zaXplWSwgXHJcbiAgICB0aGlzLmFzc2V0cyA9IGFzc2V0cztcclxuICAgIHRoaXMubnIgPSBucjtcclxuICB9XHJcbiAgXHJcbiAgZHJhd0JhY2tncm91bmQoKXtcclxuICAgIGxldCBjYW52YXNTaXplWCA9IGNhbnZhcy53aWR0aDtcclxuICAgIGxldCBjYW52YXNTaXplWSA9IGNhbnZhcy5oZWlnaHQ7XHJcbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuYXNzZXRzW2Bsdmwke3RoaXMubnJ9QmFja2dyb3VuZGBdLCAwLCAwLCBjYW52YXNTaXplWCwgY2FudmFzU2l6ZVkpO1xyXG4gIH1cclxuICBkcmF3Rm9yZWdyb3VuZCgpe1xyXG4gICAgbGV0IGNhbnZhc1NpemVYID0gY2FudmFzLndpZHRoO1xyXG4gICAgbGV0IGNhbnZhc1NpemVZID0gY2FudmFzLmhlaWdodDtcclxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5hc3NldHNbYGx2bCR7dGhpcy5ucn1Gb3JlZ3JvdW5kYF0sIDAsIDAsIGNhbnZhc1NpemVYLCBjYW52YXNTaXplWSk7XHJcbiAgfVxyXG59XHJcblxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNhbnZhcywgY3R4LCBibGFja291dCwgZHJhd1RleHQgfSBmcm9tIFwiLi9jYW52YXMuanNcIlxyXG5pbXBvcnQgZ2V0QXNzZXRzIGZyb20gXCIuL2Fzc2V0cy5qc1wiXHJcbmltcG9ydCB7IERpYW1vbmQsIFBsYXllciwgRG9vciB9IGZyb20gXCIuL2NsYXNzZXMuanNcIlxyXG5pbXBvcnQgeyBMZXZlbCwgbGV2ZWxzUHJvcGVydGllcyB9IGZyb20gXCIuL2xldmVscy5qc1wiXHJcbmltcG9ydCB7IGNvbXBpbGUgfSBmcm9tIFwiLi9jb21waWxlci5qc1wiXHJcblxyXG5cclxuXHJcbmNvbnN0IGxldmVscyA9IFtudWxsXTtcclxuXHJcbmxldCBsZXZlbCA9IHt9O1xyXG5sZXQgcGxheWVyID0ge307XHJcblxyXG5sZXQgY29sbGVjdGFibGVzID0gW107XHJcbmxldCBhY3Rpb25RdWV1ZSA9IFtcclxuICAvLyAvL2x2bDFcclxuICAvLyB7XHJcbiAgLy8gICBjb21tYW5kOiBcIm1vdmVMZWZ0XCIsXHJcbiAgLy8gICBtb3ZlQnk6IDEsXHJcbiAgLy8gfSxcclxuICAvLyB7XHJcbiAgLy8gICBjb21tYW5kOiBcIm1vdmVSaWdodFwiLFxyXG4gIC8vICAgbW92ZUJ5OiAxMCxcclxuICAvLyB9LFxyXG4gIC8vIHtcclxuICAvLyAgIGNvbW1hbmQ6IFwibW92ZUxlZnRcIixcclxuICAvLyAgIG1vdmVCeTogMSxcclxuICAvLyB9LFxyXG4gIC8vIHtcclxuICAvLyAgIGNvbW1hbmQ6IFwiZW50ZXJcIlxyXG4gIC8vIH0sXHJcblxyXG4gIC8vIC8vIGx2bCAyXHJcbiAgLy8ge1xyXG4gIC8vICAgY29tbWFuZDogXCJtb3ZlUmlnaHRcIixcclxuICAvLyAgIG1vdmVCeTogNCxcclxuICAvLyB9LFxyXG4gIC8vIHtcclxuICAvLyAgIGNvbW1hbmQ6IFwianVtcFwiLFxyXG4gIC8vICAgZGlyZWN0aW9uOiBcInVwXCJcclxuICAvLyB9LFxyXG4gIC8vIHtcclxuICAvLyAgIGNvbW1hbmQ6IFwianVtcFwiLFxyXG4gIC8vICAgZGlyZWN0aW9uOiBcImxlZnRcIlxyXG4gIC8vIH0sXHJcbiAgLy8ge1xyXG4gIC8vICAgY29tbWFuZDogXCJqdW1wXCIsXHJcbiAgLy8gICBkaXJlY3Rpb246IFwicmlnaHRcIlxyXG4gIC8vIH0sXHJcbiAgLy8ge1xyXG4gIC8vICAgY29tbWFuZDogXCJqdW1wXCIsXHJcbiAgLy8gICBkaXJlY3Rpb246IFwicmlnaHRcIlxyXG4gIC8vIH0sXHJcbiAgLy8ge1xyXG4gIC8vICAgY29tbWFuZDogXCJtb3ZlUmlnaHRcIixcclxuICAvLyAgIG1vdmVCeTogNFxyXG4gIC8vIH0sXHJcbl07XHJcbndpbmRvdy5zZXR0aW5ncyA9IHtcclxuICBnYW1lU3BlZWQ6IDcwLFxyXG4gIGFuaW1hdGlvblNwZWVkOiA2MCxcclxuXHJcbiAgY3VycmVudExldmVsOiAwLFxyXG4gIGJsYWNrb3V0TGV2ZWw6IDEsXHJcbiAgZ2FtZUludGVydmFsOiBudWxsLFxyXG4gIGFjdGlvblF1ZXVlOiBhY3Rpb25RdWV1ZSxcclxuXHJcbiAgZ2FtZVJ1bm5pbmc6IGZhbHNlLFxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cEdhbWUoKXtcclxuICBmb3IobGV0IGkgPSAxOyBpIDwgbGV2ZWxzUHJvcGVydGllcy5sZW5ndGg7IGkrKyl7XHJcbiAgICBjb25zdCB7IG1hcCwgZGlhbW9uZHMsIHN0YXJ0UG96LCBlbmRQb3ogfSA9IGxldmVsc1Byb3BlcnRpZXNbaV07IFxyXG4gICAgbGV2ZWxzLnB1c2gobmV3IExldmVsKGksIGxldmVsc1Byb3BlcnRpZXNbaV0ubWFwLCBhc3NldHMubWFwcykpO1xyXG4gICAgbGV2ZWxzW2ldLm1hcCA9IG1hcC5tYXAoYXJyID0+IFsuLi5hcnJdKTtcclxuICAgIGxldmVsc1tpXS5kaWFtb25kcyA9IGRpYW1vbmRzLm1hcChwb3ogPT4gKHsuLi5wb3p9KSk7XHJcbiAgICBsZXZlbHNbaV0uc3RhcnRQb3ogPSB7Li4uc3RhcnRQb3p9XHJcbiAgICBsZXZlbHNbaV0uZW5kUG96ID0gey4uLmVuZFBven1cclxuICB9O1xyXG4gIGFkdmFuY2Uoc2V0dGluZ3MuY3VycmVudExldmVsKTtcclxufVxyXG5mdW5jdGlvbiBhZHZhbmNlKCl7XHJcbiAgaWYoc2V0dGluZ3MuY3VycmVudExldmVsICE9PSAwKSBlbmRHYW1lKCk7XHJcbiAgc2V0dGluZ3MuY3VycmVudExldmVsKys7XHJcbiAgYnVpbGRMZXZlbCgpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYnVpbGRMZXZlbCgpe1xyXG4gIGxldmVsID0gbGV2ZWxzW3NldHRpbmdzLmN1cnJlbnRMZXZlbF07XHJcbiAgbGV2ZWwuZmluaXNoZWQgPSBmYWxzZTtcclxuXHJcbiAgbGV2ZWwuc3RhcnREb29yID0gbmV3IERvb3IoYXNzZXRzLmRvb3IsIGxldmVsLCBcInN0YXJ0XCIpO1xyXG4gIGxldmVsLmVuZERvb3IgPSBuZXcgRG9vcihhc3NldHMuZG9vciwgbGV2ZWwsIFwiZW5kXCIpO1xyXG5cclxuICBsZXZlbC5kaWFtb25kcy5mb3JFYWNoKGRpYW1vbmQgPT4ge1xyXG4gICAgY29sbGVjdGFibGVzLnB1c2gobmV3IERpYW1vbmQoZGlhbW9uZC54LCBkaWFtb25kLnksIGFzc2V0cy5kaWFtb25kLCBsZXZlbCkpO1xyXG4gIH0pO1xyXG4gIGxldmVsLmNvbGxlY3RhYmxlcyA9IGNvbGxlY3RhYmxlcztcclxuICBwbGF5ZXIgPSBuZXcgUGxheWVyKGxldmVsLnN0YXJ0UG96LngsIGxldmVsLnN0YXJ0UG96LnksIGFzc2V0cy5wbGF5ZXIsIGxldmVsKTtcclxuICBsZXZlbC5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgc2V0dGluZ3MuYmxhY2tvdXRMZXZlbCA9IDA7XHJcbiAgZ2FtZUxvb3AoKTtcclxufVxyXG5mdW5jdGlvbiBzdGFydEdhbWUoKXtcclxuICBjb25zdCBjb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWNvZGVcIikudmFsdWU7XHJcbiAgc2V0dGluZ3MuZ2FtZVJ1bm5pbmcgPSB0cnVlO1xyXG4gIGFjdGlvblF1ZXVlID0gY29tcGlsZShjb2RlKTtcclxuXHJcbiAgLy8gc2V0dGluZ3MuYmxhY2tvdXRMZXZlbCA9IDE7XHJcbiAgc2V0dGluZ3MuZ2FtZUludGVydmFsID0gc2V0SW50ZXJ2YWwoZ2FtZUxvb3AsIHNldHRpbmdzLmFuaW1hdGlvblNwZWVkKTtcclxufVxyXG5mdW5jdGlvbiBlbmRHYW1lKCl7XHJcbiAgc2V0dGluZ3MuZ2FtZVJ1bm5pbmcgPSBmYWxzZTtcclxuICBjbGVhckludGVydmFsKHNldHRpbmdzLmdhbWVJbnRlcnZhbCk7XHJcbiAgYnVpbGRMZXZlbCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnYW1lTG9vcCgpe1xyXG4gIGRyYXdQYWxldHRlKCk7XHJcbiAgaWYoc2V0dGluZ3MuZ2FtZVJ1bm5pbmcpe1xyXG4gICAgdXBkYXRlQW5pbWF0aW9ucygpO1xyXG4gICAgY2hlY2tzKCk7XHJcbiAgICBpZihwbGF5ZXIuYWN0aW9ucyA9PT0gMCAmJiAhcGxheWVyLmJ1bXBlZClcclxuICAgICAgdXBkYXRlUXVldWUoKTtcclxuICB9XHJcbiAgaWYobGV2ZWwuZmluaXNoZWQpe1xyXG4gICAgYWR2YW5jZSgpO1xyXG4gIH1cclxuXHJcbiAgaWYoc2V0dGluZ3MuZ2FtZVJ1bm5pbmcpe1xyXG4gICAgaWYoYmxhY2tvdXQoZmFsc2UpKSBsZXZlbC5zdGFydGluZyA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGlmKGxldmVsLmZpbmlzaGVkKXtcclxuICAvLyAgIGlmKGJsYWNrb3V0KHRydWUpKSBhZHZhbmNlKCk7XHJcbiAgLy8gICByZXR1cm47XHJcbiAgLy8gfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3UGFsZXR0ZSgpe1xyXG4gIC8vIHRlbXBsYXRlXHJcbiAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKDYzLCA1NiwgODEpXCI7XHJcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgXHJcbiAgLy8gYmFja2dyb3VuZFxyXG4gIGxldmVsLmRyYXdCYWNrZ3JvdW5kKCk7XHJcbiAgbGV2ZWwuZW5kRG9vci5kcmF3KCk7XHJcbiAgbGV2ZWwuc3RhcnREb29yLmRyYXcoKTtcclxuICBcclxuICAvLyBmb3JlZ3JvdW5kICBcclxuICBsZXZlbC5kcmF3Rm9yZWdyb3VuZCgpO1xyXG4gIFxyXG4gIC8vIG9iamVjdHNcclxuICBjb2xsZWN0YWJsZXMuZm9yRWFjaChjb2xsZWN0YWJsZSA9PiBjb2xsZWN0YWJsZS5kcmF3KCkpO1xyXG4gIHBsYXllci5kcmF3KCk7XHJcblxyXG4gIC8vIEhVRFxyXG4gIGRyYXdUZXh0KGxldmVsKTtcclxuICAvLyBleGl0XHJcbiAgY3R4LmZpbGxTdHlsZSA9IGByZ2JhKDYzLCA1NiwgODEsICR7c2V0dGluZ3MuYmxhY2tvdXRMZXZlbH0pYDtcclxuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxufVxyXG5mdW5jdGlvbiBjaGVja3MoKXtcclxuICBjb2xsZWN0YWJsZXMuZm9yRWFjaChjb2xsZWN0YWJsZSA9PiB7Y29sbGVjdGFibGUuY2hlY2tDb2xsZWN0KCl9KTtcclxuICBpZighbGV2ZWwuZW5kRG9vci5pc09wZW4gJiYgY29sbGVjdGFibGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBsZXZlbC5lbmREb29yLm9wZW4oKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQW5pbWF0aW9ucygpe1xyXG4gIHBsYXllci51cGRhdGUoKTtcclxuICBsZXZlbC5zdGFydERvb3IudXBkYXRlKCk7XHJcbiAgbGV2ZWwuZW5kRG9vci51cGRhdGUoKTtcclxuICBjb2xsZWN0YWJsZXMuZm9yRWFjaCgoY29sbGVjdGFibGUpID0+IGNvbGxlY3RhYmxlLnVwZGF0ZSgpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUXVldWUoKXtcclxuICBpZihhY3Rpb25RdWV1ZSA9PT0gbnVsbCl7XHJcbiAgICBlbmRHYW1lKCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlmKGFjdGlvblF1ZXVlLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gIGNvbnN0IGFjdGlvbiA9IGFjdGlvblF1ZXVlLnNoaWZ0KCk7XHJcbiAgc3dpdGNoKGFjdGlvbi5jb21tYW5kKXtcclxuICAgIGNhc2UgXCJtb3ZlUmlnaHRcIjoge1xyXG4gICAgICBsZXQgbW92ZUJ5ID0gYWN0aW9uLm1vdmVCeTtcclxuXHJcbiAgICAgIHBsYXllci5tb3ZlUmlnaHQobW92ZUJ5KTtcclxuICAgICAgYnJlYWsgfVxyXG4gICAgY2FzZSBcIm1vdmVMZWZ0XCI6IHtcclxuICAgICAgbGV0IG1vdmVCeSA9IGFjdGlvbi5tb3ZlQnk7XHJcblxyXG4gICAgICBwbGF5ZXIubW92ZUxlZnQobW92ZUJ5KTtcclxuICAgICAgYnJlYWsgfVxyXG4gICAgY2FzZSBcImp1bXBcIjoge1xyXG4gICAgICBsZXQgZGlyZWN0aW9uID0gYWN0aW9uLmRpcmVjdGlvbjtcclxuICAgICAgXHJcbiAgICAgIHBsYXllci5qdW1wKGRpcmVjdGlvbik7XHJcbiAgICAgIGJyZWFrIH1cclxuICAgIGNhc2UgXCJhdHRhY2tcIjoge1xyXG5cclxuICAgICAgcGxheWVyLmF0dGFjaygpO1xyXG4gICAgICBicmVhayB9XHJcbiAgICBjYXNlIFwic3RhcnRcIjp7XHJcblxyXG4gICAgICBwbGF5ZXIuZW50ZXIoKVxyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGNhc2UgXCJlbmRcIjp7XHJcblxyXG4gICAgICBsZXQgc3VjY2VzcyA9IHBsYXllci5leGl0KCk7XHJcbiAgICAgIGlmKHN1Y2Nlc3MgPT09IG51bGwpXHJcbiAgICAgICAgZW5kR2FtZSgpO1xyXG4gICAgICBicmVhaztcclxuICAgIH0gXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIChlKSA9PiB7XHJcbiAgXHJcbiAgaWYoZS5rZXkgPT09IFwiO1wiKXtcclxuICAgIHN0YXJ0R2FtZSgpO1xyXG4gIH1cclxuICAvLyBpZihlLmtleSA9PT0gJ2QnKXtcclxuICAvLyAgIGFjdGlvblF1ZXVlLnB1c2goe1xyXG4gIC8vICAgICBjb21tYW5kOiBcIm1vdmVSaWdodFwiLFxyXG4gIC8vICAgICBtb3ZlQnk6IDEsXHJcbiAgLy8gICB9KTtcclxuICAvLyB9XHJcbiAgLy8gZWxzZSBpZihlLmtleSA9PT0gJ2EnKXtcclxuICAvLyAgIGFjdGlvblF1ZXVlLnB1c2goe1xyXG4gIC8vICAgICBjb21tYW5kOiBcIm1vdmVMZWZ0XCIsXHJcbiAgLy8gICAgIG1vdmVCeTogMSxcclxuICAvLyAgIH0pO1xyXG4gIC8vIH1cclxuICAvLyBlbHNlIGlmKGUua2V5ID09PSAndycpe1xyXG4gIC8vICAgYWN0aW9uUXVldWUucHVzaCh7XHJcbiAgLy8gICAgIGNvbW1hbmQ6IFwianVtcFwiLFxyXG4gIC8vICAgICBkaXJlY3Rpb246IFwidXBcIixcclxuICAvLyAgIH0pXHJcbiAgLy8gfVxyXG4gIC8vIGVsc2UgaWYoZS5rZXkgPT09ICdlJyl7XHJcbiAgLy8gICBhY3Rpb25RdWV1ZS5wdXNoKHtcclxuICAvLyAgICAgY29tbWFuZDogXCJqdW1wXCIsXHJcbiAgLy8gICAgIGRpcmVjdGlvbjogXCJyaWdodFwiLFxyXG4gIC8vICAgfSlcclxuICAvLyB9XHJcbiAgLy8gZWxzZSBpZihlLmtleSA9PT0gJ3EnKXtcclxuICAvLyAgIGFjdGlvblF1ZXVlLnB1c2goe1xyXG4gIC8vICAgICBjb21tYW5kOiBcImp1bXBcIixcclxuICAvLyAgICAgZGlyZWN0aW9uOiBcImxlZnRcIixcclxuICAvLyAgIH0pXHJcbiAgLy8gfVxyXG4gIC8vIGVsc2UgaWYoZS5rZXkgPT09ICdjJyl7XHJcbiAgLy8gICBhY3Rpb25RdWV1ZS5wdXNoKHtcclxuICAvLyAgICAgY29tbWFuZDogXCJhdHRhY2tcIixcclxuICAvLyAgIH0pXHJcbiAgLy8gfVxyXG4gIC8vIGVsc2UgaWYoZS5rZXkgPT09IFwiIFwiKXtcclxuICAvLyAgIGFjdGlvblF1ZXVlLnB1c2goe1xyXG4gIC8vICAgICBjb21tYW5kOiBcImVudGVyXCJcclxuICAvLyAgIH0pXHJcbiAgLy8gfVxyXG59KTtcclxuXHJcbmNvbnN0IGFzc2V0cyA9IHt9O1xyXG5nZXRBc3NldHMoKVxyXG4udGhlbigobG9hZGVkQXNzZXRzKSA9PiB7XHJcbiAgT2JqZWN0LmFzc2lnbihhc3NldHMsIGxvYWRlZEFzc2V0cyk7XHJcbiAgc2V0dXBHYW1lKCk7XHJcbn0pO1xyXG5cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9