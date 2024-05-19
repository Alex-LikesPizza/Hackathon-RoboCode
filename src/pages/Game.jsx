import React from 'react'

import initGame from "../game/game"

const Game = () => {
  const canvasRef = React.useRef();
  const codeRef = React.useRef();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const code = codeRef.current;
    initGame(canvas, code);
  }, []);

  return (
    <section className='game'>
      <canvas ref={canvasRef} className="game__canvas" width="800" height="533"></canvas>
      <div className="game__code-container">
        <textarea ref={codeRef} className="game__code"></textarea>
      </div>
    </section>
  )
}

export default Game