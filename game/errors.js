function invalid_UINT(x){
  console.error(x + " is not a valid value");
};
function invalid_direction(direction){
  console.error(direction + " is not a valid direction");
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