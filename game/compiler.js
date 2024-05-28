function tokenizeCode(code){
  let codeRows = code.split('\n');
  codeRows = codeRows.map(row => row.split('#')[0].replace(/\s+/g, ' ').trim());
  return codeRows;
}
function compileCode(tokenizedCode){
  let actions = [];
  let actionStacks = [];
  let openBrackets = 0;
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
      case "{": {
        actionStacks.push([]);
        openBrackets++;
        continue;
      }
      case "}": {
        openBrackets--;
        is_validBrackets(openBrackets);
        if(openBrackets < 0) return null;
        
        let compoundActions = actionStacks.pop();
        action = {command: "compound", actions: compoundActions}
        break;
      }
      case "if": {
        action = {command: "if", args: args};
        break;
      }
      case "while": {
        action = {command: "while", args: args};
      }
    }
    if(openBrackets) actionStacks.at(-1).push(action);
    else actions.push(action);
  }
  is_validBrackets(openBrackets, true);
  if(openBrackets !== 0) return null;

  actions.push({command: "end"});
  return actions;
}

function evaluateLogicalExpression(args, level){
  args = JSON.parse(JSON.stringify(args));
  let i = 0;
  for(let arg of args){
    if(arg === "facing_left"){
      if(level.player.facing === "left") 
        args[i] = true;
      else args[i] = false;
    }
    else if(arg === "facing_right"){
      if(level.player.facing === "right") 
        args[i] = true;
      else args[i] = false;
    }
    else if(arg === "facing_wall"){ 
      let x = level.player.x + (level.player.facing === "left"? -1 : 1);
      let y = level.player.y;
      if(level.map[y][x] === 1) 
        args[i] = true;
      else args[i] = false;
    }
    else if(arg === "facing_diamond"){ 
      let x = level.player.x + (level.player.facing === "left"? -1 : 1);
      let y = level.player.y;
      let diamonds = level.diamonds;
      if(diamonds.some(obj => obj.x === x && obj.y === y))
        args[i] = true;
      else args[i] = false;
    }

    else if(arg === "on_platform"){
      let x = level.player.x;
      let y = level.player.y + 1;
      if(level.map[y][x] === 2) 
        args[i] = true;
      else args[i] = false;
    }
    else if(arg === "on_floor"){
      let x = level.player.x;
      let y = level.player.y + 1;
      if(level.map[y][x] === 1) 
        args[i] = true;
      else args[i] = false;
    }

    else if(arg === "can_jump_up"){
      let x = level.player.x;
      let y = level.player.y - 1;
      if(level.map[y][x] === 0) 
        args[i] = true;
      else args[i] = false;
    }
    else if(arg === "can_jump_right"){
      let x = level.player.x + 1;
      let y = level.player.y - 1;
      if(level.map[y][x] === 0) 
        args[i] = true;
      else args[i] = false;
    }
    else if(arg === "can_jump_left"){
      let x = level.player.x - 1;
      let y = level.player.y - 1;
      if(level.map[y][x] === 0) 
        args[i] = true;
      else args[i] = false;
    }


    i++;
  }
  return args;
}
function getIfStatementValue(args, level){
  args = evaluateLogicalExpression(args, level);
  let filter = [];
  let notNext = false;
  args.forEach(value => {
    if(notNext){
      filter.push(!value);
      notNext = false;
    }
    else if(value === "not"){
      notNext = true;
    }
    else filter.push(value);
  });

  let ands = [];
  filter.forEach((value, i) => {if(value === "and") ands.push(i)});
  for(let i of ands){
    let leftVal = filter[i - 1];
    let rightVal = filter[i + 1];
    let evaluatedValue = leftVal && rightVal;
    filter.splice(i - 1, 3, evaluatedValue);
  }

  let ors = [];
  filter.forEach((value, i) => {if(value === "or") ors.push(i)});
  for(let i of ors){
    let leftVal = filter[i - 1];
    let rightVal = filter[i + 1];
    let evaluatedValue = leftVal || rightVal;
    filter.splice(i - 1, 3, evaluatedValue);
  }

  return filter[0];
}


function compile(code){
  const tokenizedCode = tokenizeCode(code);
  const compiledCode = compileCode(tokenizedCode);

  return compiledCode;
}