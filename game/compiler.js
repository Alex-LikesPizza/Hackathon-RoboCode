import { isStatement } from "./errors.js";

function tokenizeCode(code){
  let codeRows = code.split('\n');
  codeRows = codeRows.map(row => row.split('#')[0].replace(/\s+/g, ' ').trim());
  return codeRows;
}

function compileCode(tokenizedCode){
  let actions = [];
  for (let tokenizedRow of tokenizedCode) {
    if(!isStatement(tokenizedRow)) return null;
    if(tokenizedRow === "") continue;
    const tokens = tokenizedRow.split(" ");
    let command = tokens.shift();
    let args = [...tokens];
    let action = {};
    switch(command){
      case "walk": {
        let command = args[0] === "right"? "moveRight" : "moveLeft";
        // if(actions[actions.length - 1].command === command) {
        //   actions[actions.length - 1].moveBy++;
        //   continue;
        // }
        action = {command, moveBy: 1};
        break;
      }
      case "jump": {
        let direction = args[0];
        action = {command: "jump", direction};
        break;
      }
      case "attack": {
        action = {command: "attack"};
        break;
      }
      case "start": {
        action = {command: "start"};
        break;
      }
      case "end": {
        action = {command: "end"};
        break;
      }
      case "if": {
        action = compileIfStatement(args);
        break;
      }
    }
    actions.push(action);
  }

  return actions;
}

function compileIfStatement(tokens){
  let negate = false;
  /*
    if facing door/wall/diamond...
    if not facing door/wall/diamond...
    if on floor/platform...
    if on floor or facing door
    if on floor and facing wall or facing door
    if on door or facing door and on platform


  */
  for(let token of tokens){

  }
}


export function compile(code){
  const tokenizedCode = tokenizeCode(code);
  const compiledCode = compileCode(tokenizedCode);

  return compiledCode;
}