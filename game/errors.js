function invalid_UINT(x){
  console.error(x + " is not a valid value");
};
function invalid_direction(direction){
  console.error(direction + " is not a valid direction");
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
export function is_direction(direction){
  switch(direction){
    case "up":
    case "left":
    case "right": 
      return true;
    default:
      invalid_direction(direction);
      return false;
  }
}
export function bumped(){
  console.error("You bumped into a wall");
}