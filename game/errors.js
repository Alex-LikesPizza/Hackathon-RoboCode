function invalid_UINT(x){
  console.error(x + " is not a valid positive integer");
};
function invalid_direction(direction, walking = false){
  console.error(`"${direction}" is not a valid ${walking? "walkable " : ""}direction`);
}
function invalid_doorAccessPosition(){
  console.error("You did not reach the end door");
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
function invalid_ifStatement(){
  console.error(`Invalid if statement`);
}
function invalid_closedBrackets(){
  console.error(`Closed brackets without opening`);
}
function invalid_openBrackets(){
  console.error(`Not all brackets are closed`);
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
export function is_validBrackets(openBrackets, final = false){
  if(openBrackets < 0) invalid_closedBrackets();
  if(final && openBrackets !== 0) invalid_openBrackets();
}
export function is_ifStatementCorrect(args){
  if(args.length === 0) {
    invalid_argumentNumber(false);
  }
  let actionList = [
    "facing_left", "facing_right", "facing_diamond", "facing_wall", 
    "on_platform", "on_floor",
    "can_jump_up", "can_jump_left", "can_jump_right"
  ];

  let prevType = "combine";
  let isValid = true;
  for(let arg of args){
    let isAction = actionList.includes(arg)
    if(prevType === "negate"){
      prevType = "action";
      if(isAction) continue;
      else isValid = false;
    }
    if(prevType === "combine"){

      if(isAction){
        prevType = "action";
        continue;
      }
      else if(arg === "not"){
        prevType = "negate"
        continue;
      }
      else isValid = false;
    }
    if(prevType === "action"){
      if(arg === "not") prevType = "negate";
      else if(arg === "and" || arg === "or") prevType = "combine";
      else isValid = false;
    }

    if(isValid === false) {
      invalid_ifStatement(); 
      break;
    }
  }
  return isValid;
}
export function isCommand(command){
  const commands = ["{", "}", "walk", "jump", "attack", "", "if", "while"];
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
    case "{": {
      if(!is_argumentNumberCorrect(0, argsLen)) return false;
      return true;
    }
    case "}": {
      if(!is_argumentNumberCorrect(0, argsLen)) return false;
      return true;
    }
    case "if": {
      if(!is_ifStatementCorrect(args)) return false;
      return true
    }
    case "while":{
      if(!is_ifStatementCorrect(args)) return false
      return true;
    }
    case "": return true;
    default: {
      return false;
    }
  }
}