import { canvas, ctx } from "./setup.js";

export const levelsProperties = [
  null,
  { map: [
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    ],
    diamonds: [
    {x: 10, y: 6}, {x: 5, y: 8}],
    startPoz: {x: 3, y: 8}
  }
]

export class Level{
  constructor(nr, map, image){
    this.sizeY = map.length;
    this.sizeX = map[0].length;
    this.map = map;
    this.boxSizeX = canvas.width / this.sizeX; 
    this.boxSizeY = canvas.height / this.sizeY, 
    this.image = image
    this.nr = nr;
  }
  
  draw(){
    let canvasSizeX = canvas.width;
    let canvasSizeY = canvas.height;
    ctx.drawImage(this.image, 0, 0, canvasSizeX, canvasSizeY);
  }
}
