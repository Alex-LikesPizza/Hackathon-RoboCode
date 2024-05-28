// const canvas = document.getElementById("game-canvas");
// const ctx = canvas.getContext("2d");

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