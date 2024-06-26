const levelsProperties = [
  null, // empty
  { map: [ //1
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
  { map: [ //2
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
    map: [ //3
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
  },
  { 
    map: [ //4
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
  { map: [ //5
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  diamonds: [
  {x: 3, y: 8}],
  startPoz: {x: 2, y: 2},
  endPoz: {x: 2, y: 8},
},
{ map: [ //6
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  diamonds: [
  {x: 2, y: 4}, {x: 13, y: 1}],
  startPoz: {x: 2, y: 2},
  endPoz: {x: 2, y: 8},
},
{ map: [ //7
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 2, 2, 1, 2, 0, 1, 2, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 1, 0, 0, 1, 0, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 1, 0, 0, 1, 0, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 1, 0, 0, 1, 0, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  diamonds: [
  {x: 8, y: 2}],
  startPoz: {x: 2, y: 8},
  endPoz: {x: 12, y: 2},
},
{ map: [ //8
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  diamonds: [
    {x: 1, y: 2}, {x: 1, y: 4}, {x: 1, y: 6}, {x: 1, y: 8}, {x: 13, y: 8}, {x: 13, y: 6}, {x: 13, y: 4}, {x: 13, y: 2}],
  startPoz: {x: 2, y: 8},
  endPoz: {x: 12, y: 2},
},
{ map: [ //9
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 0, 2, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 2, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  diamonds: [
  {x: 6, y: 5}, {x: 8, y: 7}, {x: 10, y: 7}, {x: 12, y: 4}],
  startPoz: {x: 1, y: 8},
  endPoz: {x: 1, y: 2},
},
{ map: [ //10
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  diamonds: [
  {x: 12, y: 8}],
  startPoz: {x: 1, y: 2},
  endPoz: {x: 8, y: 7},
},
  
]

class Level{
  constructor(nr, map, assets){
    this.sizeY = map.length;
    this.sizeX = map[0].length;
    this.map = map;
    this.boxSizeX = canvas.width / this.sizeX; 
    this.boxSizeY = canvas.height / this.sizeY, 
    this.assets = assets;
    this.nr = nr;
  }
  
  drawBackground(){
    let canvasSizeX = canvas.width;
    let canvasSizeY = canvas.height;
    ctx.drawImage(this.assets[`lvl${this.nr}Background`], 0, 0, canvasSizeX, canvasSizeY);
  }
  drawForeground(){
    let canvasSizeX = canvas.width;
    let canvasSizeY = canvas.height;
    ctx.drawImage(this.assets[`lvl${this.nr}Foreground`], 0, 0, canvasSizeX, canvasSizeY);
  }
}

