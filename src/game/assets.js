async function getAssets(){
  const assets = {
    player: {
      attack: new Image(),
      doorIn: new Image(),
      doorOut: new Image(),
      ground: new Image(),
      idle: new Image(),
      die: new Image(),
      run: new Image(),
      jump: new Image(),
      fall: new Image(),
      hit: new Image(),
    },
    box: {
      boxPiece1: new Image(),
      boxPiece2: new Image(),
      boxPiece3: new Image(),
      boxPiece4: new Image(),
      hit: new Image(),
      idle: new Image(),
    },
    door: {
      closing: new Image(),
      opening: new Image(),
      idle: new Image(),
    },
    diamond:{
      idle: new Image(),
      disappear: new Image(),
    },
    maps: {
      lvl1Foreground: new Image(),
      lvl1Background: new Image(),
      lvl2Foreground: new Image(),
      lvl2Background: new Image(),
      lvl3Background: new Image(),
      lvl3Foreground: new Image(),
      lvl4Background: new Image(),
      lvl4Foreground: new Image(),
      lvl5Background: new Image(),
      lvl5Foreground: new Image(),
      lvl6Background: new Image(),
      lvl6Foreground: new Image(),
      lvl7Background: new Image(),
      lvl7Foreground: new Image(),
      lvl8Background: new Image(),
      lvl8Foreground: new Image(),
      lvl9Background: new Image(),
      lvl9Foreground: new Image(),
      lvl10Background: new Image(),
      lvl10Foreground: new Image(),
    }
  };

  let promises = [];
  for(let folder in assets){
    for(let file in assets[folder]){
      let image = assets[folder][file];
      image.src = `./src/game/sprites/${folder}/${file}.png`;

      let promise = new Promise((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = (event) => {
          console.error(`Error loading image ${image.src}:`, event);
          reject(event);
        };
      });

      promises.push(promise);
    }
  }

  return Promise.all(promises).then(() => assets);
}