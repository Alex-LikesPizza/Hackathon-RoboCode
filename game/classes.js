import { canvas, ctx } from "./setup.js";
import { bumped, is_UINT, is_direction } from "./errors.js";
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
    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
  }
}
export class Door extends GameObject {
  constructor(assets, level, type){
    super(level[`${type}Poz`].x, level[`${type}Poz`].y, assets, level, 1);
    this.stasis = false;
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
  update() {
    if(this.stasis && this.currentFrame === this.totalFrames - 1) return;
    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
  }
  access() {
    this.openingAnimation();
    this.stasis = true;
    setTimeout(() => {
      this.stasis = false;
      this.closingAnimation()
      setTimeout(() => this.idleAnimation(), this.totalFrames * settings.animationSpeed);

    }, (this.totalFrames + 8) * settings.animationSpeed);
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
  
  collect(){
    delete this;
  }
}

export class Player extends GameObject {
  constructor(pozX, pozY, asset, level) {
    super(pozX, pozY, asset, level, 11);
    this.facing = "right";
    this.bumped = false;
    this.actions = 0;
    this.currentAction = "idle";
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
    let row = Math.floor(this.y + 1);
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
  align(){
    
  }
  idle(){
    this.idleAnimation();
  }
  fall(jump = false) {
    this.actions++;
    this.currentAction = "fall";
    let gravity = jump ? 0.1 : 0.01;
    let velocity = 0;
    let speed = settings.gameSpeed;
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
    }, settings.gameSpeed * 1.5)

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
    if(!jump)this.runAnimation();
    let speed = settings.gameSpeed * 0.5;
    let step = 0.1;
    let i = 0;
    
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
        if(!jump)this.idle();
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
    if(!jump)this.runAnimation();
    let speed = settings.gameSpeed * 0.5;
    let step = 0.1;
    let i = 0;

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
        if(!jump)this.idle();
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
    setTimeout(() => {
      this.idle()
      this.actions--;
    }, settings.animationSpeed * this.totalFrames);
  }
  die(){
    bumped();
    this.bumped = true;
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
      this.doorOutAnimation()
      
      setTimeout(() => {
        this.idle();
        this.actions--;
      }, this.totalFrames * settings.animationSpeed)
    }, 5 * settings.animationSpeed);
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

