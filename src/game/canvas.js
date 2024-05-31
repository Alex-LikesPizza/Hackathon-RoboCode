const blackout = {
  opacity: 0,
  isIncreasing: true,
  isActive: false,
};

function setBlackout(time){
  let opacityBit = 0.05

  let blackoutInterval = setInterval(() => {
    if(blackout.isIncreasing){
      blackout.opacity = Math.trunc((blackout.opacity + opacityBit) * 100)/100;
  
      if(blackout.opacity >= 0.99){
        blackout.opacity = 1;
        blackout.isIncreasing = false;
      }
    }
    else{
      blackout.opacity = Math.floor((blackout.opacity - opacityBit) * 100)/100;
  
      if(blackout.opacity <= 0.01){
        blackout.opacity = 0;
        blackout.isIncreasing = true;
        blackout.isActive = false;
        clearInterval(blackoutInterval);
      }
    }
  }, );
}

function drawText(level) {
  const levelId = String(level.nr).padStart(2, '0');
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.strokeStyle = "rgb(110, 110, 110)";
  ctx.lineWidth = 8;
  ctx.font = `32px "Press Start 2P", monospace`;

  const x = 20;
  const y = canvas.height - 40;
  ctx.strokeText(`Level ${levelId}`, x, y);
  ctx.fillText(`Level ${levelId}`, x, y);
}