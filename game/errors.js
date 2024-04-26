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

export function is_validExit(player){
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
export function is_UINT(x){
  if(!Number.isInteger(x) || x < 0){
    invalid_UINT(x);
    return false;
  }
  return true;
}
export function is_direction(direction, walking = false){
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
export function is_argumentNumberCorrect(n, argLen){
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
export function bumped(){
  console.error("You bumped into a wall");
}
export function isCommand(command){
  const commands = ["start", "end", "walk", "jump", "attack", ""];
  if(!commands.includes(command)){
    invalid_command(command);
    return false;
  }

  return true;
}
export function isStatement(statement){
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