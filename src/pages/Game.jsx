import React from 'react'
import Slider from "../components/Slider";

const Game = () => {
  const [ openCodeSection, setOpenCodeSection ] = React.useState("code");
  const canvasRef = React.useRef();
  const codeRef = React.useRef();
  const consoleRef = React.useRef();
  
  function getCompiledCode(){
    consoleDOM.innerText = "";
    compiledCode();
  }
  function run(){
    startGame();
  }
  React.useEffect(() => {
    window.canvas = canvasRef.current;
    window.ctx = window.canvas.getContext("2d");
    window.codeDOM = codeRef.current;
    window.consoleDOM = consoleRef.current;

    window.settings.DOMLoaded = true;
  }, []);

  return (
    <div className='game'>
      <section className='game__container'>
        <div className="game__canvas-wrapper">
        <canvas ref={canvasRef} className="game__canvas" width="1600" height="1066"></canvas>

        </div>

        <div className="game__code-container">
          <div className="game__code-header">
            <div onClick={() => setOpenCodeSection("code")}  className={"game__code-heading " + (openCodeSection === "code"? "game__code-heading--selected" : "")}>Code</div>
            <div onClick={() => setOpenCodeSection("console")}  className={"game__code-heading " + (openCodeSection === "console"? "game__code-heading--selected" : "")}>Console</div>
          </div>
            <textarea style={openCodeSection === "console"? {display: "none"} : {}} ref={codeRef} className='game__code-section game__code'></textarea>
            <textarea style={openCodeSection === "code"   ? {display: "none"} : {}} ref={consoleRef} className='game__code-section game__console' readOnly></textarea>
          <div className="game__controls">
            <div  onClick={run} className="game__control">
              <i className="bi bi-play"></i> Run
            </div>
            <div onClick={getCompiledCode} className="game__control">
              <i className="bi bi-gear"></i> Compile
            </div>
          </div>
        </div>
      </section>

      <section className='tutorial'>
        <Slider></Slider>
      </section>
    </div>
  )
}

export default Game