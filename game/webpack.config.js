const path = require('path');

module.exports = {
  mode: "development",
  entry: './game.js',
  output: {
    path: path.resolve(__dirname, "..", 'src', "game"),
    filename: 'game.js'
  },
  devtool: 'inline-source-map' 
};