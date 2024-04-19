export const map = {
    sizeX: 10,
    sizeY: 10,
    walls: [
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    ]
}

export function drawMap(ctx, map){
    let canvasSizeX = ctx.canvas.width;
    let canvasSizeY = ctx.canvas.height;
    let ratio = Math.min(canvasSizeX / map.sizeX, canvasSizeY / map.sizeY);
    let boxSize;

    for(let y = 0; y < map.sizeY; y++){
        for(let x = 0; x < map.sizeX; x++){
            if(map.walls[y][x] === 1){
                ctx.fillRect(x * ratio, y * ratio,);
            }
        }
    }
}