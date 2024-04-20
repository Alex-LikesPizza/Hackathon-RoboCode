import { canvas, ctx } from "./setup.js";
import { bumped, is_UINT } from "./errors.js";
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
    let col = Math.floor(this.x);
    return this.level.map[row] && this.level.map[row][col] !== 0;
  }
  checkLeftCollision(jump = false) {
    let row = Math.floor(this.y - jump);
    let col = Math.floor(this.x +0.001);
    return this.level.map[row][col] === 1
  }
  checkRightCollision(jump = false){
    let row = Math.floor(this.y - jump);
    let col = Math.ceil(this.x);
    return this.level.map[row][col] === 1
  }
  fall(jump = false) {
    let gravity = jump ? 0.1 : 0.04;
    let velocityY = jump ? 0 : -0.04;
    let speed = window.gameSpeed;
    this.fallAnimation();
  
    const moving = setInterval(() => {
      this.y += velocityY;
      velocityY += gravity;
      if (this.checkBottomCollision()) {
        this.y = Math.floor(this.y);
        clearInterval(moving);
        this.idleAnimation();
        return;
      }
    }, speed);
  }
  jump(direction) {
    let maxHeight = 1;
    let gravity = 0.15;
    let velocityY = Math.sqrt(maxHeight * gravity * 2);
    let speed = window.gameSpeed;
  
    if(direction === "left") this.moveLeft(1, true);
    if(direction === "right") this.moveRight(1, true);

    this.jumpAnimation();
    const moving = setInterval(() => {
      if (velocityY <= 0) {
        clearInterval(moving)
        this.fall(true);
        return
      }
      this.y -= velocityY;
      velocityY -= gravity;
    }, speed);
  }

  moveRight(x, jump = false){
    if(!is_UINT(x)){
      return;
    }
    this.facing = "right";
    this.runAnimation();
    let speed = window.gameSpeed * 0.5;
    let step = 0.1;
    let i = 0;
    
    
    const moving = setInterval(() => {
      this.x += step;
      if(i >= x / step){
        this.x = Math.floor(this.x);
        clearInterval(moving);
        if(!jump)this.idleAnimation();
      }
      if(!jump && this.checkRightCollision()){
        clearInterval(moving);
        this.die();
        return
      };
      if(jump && this.checkRightCollision(true)){
        clearInterval(moving);
        this.die();
        return
      };
      if(!jump){
        if(!this.checkBottomCollision()){
          this.fall();
        };
      }
      i++;
    }, speed);
  }
  moveLeft(x, jump = false){
    if(!is_UINT(x)){
      return;
    }
    this.facing = "left";
    this.runAnimation();
    let speed = window.gameSpeed * 0.5;
    let step = 0.1;
    let i = 0;
    

    const moving = setInterval(() => {
      this.x -= step;
      if(i >= x / step){
        this.x = Math.ceil(this.x);
        clearInterval(moving);
        if(!jump)this.idleAnimation();
      }
      if(!jump && this.checkLeftCollision()){
        clearInterval(moving);
        this.die();
        return
      };
      
      if(jump && this.checkLeftCollision()){
        clearInterval(moving);
        this.die();
        return
      };
      if(!jump){
        if(!this.checkBottomCollision()){
          this.fall();
        };
      }
      i++;
    }, speed);
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
    this.currentFrame = 3;
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
  dieAnimation(){
    this.asset = this.assets.die;
    this.currentFrame = 0;
    this.totalFrames = 4;
  }
}

