import React from 'react'

const Game = () => {
  return (
    <div id="game">
      <canvas id="game-canvas" width="800" height="533"></canvas>
      <div class="code-area">
        <textarea id="game-code">start&NewLine;&NewLine;end</textarea>

      </div>
    </div>
  )
}

export default Game