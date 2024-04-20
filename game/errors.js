export function invalidValue(x){
  console.error(x + " is not a valid value");
};
export function is_UINT(x){
  if(!Number.isInteger(x) || x < 0){
    invalidValue(x);
    return false;
  }
  return true;
}
export function bumped(){
  console.error("You bumped into a wall");
}