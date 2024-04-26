import { isStatement } from "./errors.js";

export function tokenizeCode(code){
  let codeRows = code.split('\n');
  codeRows = codeRows.map(row => row.split('#')[0].replace(/\s+/g, ' '));
  return codeRows;
}

export function compileCode(tokenizedCode){
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
        if(actions[actions.length - 1].command === command) {
          actions[actions.length - 1].moveBy++;
          continue;
        }
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
    }
    actions.push(action);
  }

  return actions;
}


export function compile(code){
  const tokenizedCode = tokenizeCode(code);
  const compiledCode = compileCode(tokenizedCode);

  return compiledCode;
}