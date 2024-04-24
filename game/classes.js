import { ctx } from "./canvas.js";
import { bumped, is_UINT, is_direction, is_validExit } from "./errors.js";
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
export class Door extends GameObject {
  constructor(assets, level, type){
    super(level[`${type}Poz`].x, level[`${type}Poz`].y, assets, level, 1);
    this.type = type;
    this.animationStasis = false;
  }

  draw() {
    ctx.drawImage(
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
export class Diamond extends GameObject {
  constructor(pozX, pozY, asset, level) {
    super(pozX, pozY, asset, level, 10);
  }
  
  draw() {
      ctx.drawImage(
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
export class Player extends GameObject {
  constructor(pozX, pozY, asset, level) {
    super(pozX, pozY, asset, level, 11);
    this.facing = "right";
    this.bumped = false;
    this.actions = 0;
  }

  draw() {
  if(this.facing === "right"){
      ctx.drawImage(
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
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
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
      ctx.restore();
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
  idle(){
    if(this.x % 1 || this.y % 1)
      console.error("Decimal pozition detected in idle state: ",{x: this.x, y: this.y});
    this.falling = false;
    this.idleAnimation();
  }
  fall(jump = false) {
    this.actions++;
    let gravity = jump ? 0.1 : 0.01;
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
    if(!is_direction(direction) ){
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
        return
      }
      this.y -= velocity;
      velocity -= gravity;
    }, speed);
  }
  moveRight(x, jump = false){
    if(!is_UINT(x)){
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
      if(!jump && !this.checkBottomCollision()){
        this.fall();
      }
      i++;
    }, speed);
  }
  moveLeft(x, jump = false){
    if(!is_UINT(x)){
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
        if(!jump && !this.falling)this.idle();
        this.actions--;
      }
      else if(!jump && this.checkLeftCollision()){
        clearInterval(moving);
        this.die();
        return;
      };
      if(!jump && !this.checkBottomCollision()){
        this.fall();
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
    bumped();
    this.bumped = true;
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.dieAnimation();
    this.update = () => {
      if(this.currentFrame === this.totalFrames - 1) return;
      this.currentFrame = (this.currentFrame + 1);
    }
  }
  enter(){
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
    if(!is_validExit(this)){
      return;
    }
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