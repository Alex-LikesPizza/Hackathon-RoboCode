export default async function(){
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
    }
  };

  let promises = [];
  for(let folder in assets){
    for(let file in assets[folder]){
      let image = assets[folder][file];
      image.src = `./game/sprites/${folder}/${file}.png`;

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