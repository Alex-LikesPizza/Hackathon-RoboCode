import React from 'react'

const Game = () => {
  const [ openCodeSection, setOpenCodeSection ] = React.useState("code");
  const canvasRef = React.useRef();
  const codeRef = React.useRef();
  const consoleRef = React.useRef();
  
  

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
        <canvas ref={canvasRef} className="game__canvas" width="1600" height="1066"></canvas>

        <div className="game__code-container">
          <div className="game__code-header">
            <div onClick={() => setOpenCodeSection("code")}  className={"game__code-heading " + (openCodeSection === "code"? "game__code-heading--selected" : "")}>Code</div>
            <div onClick={() => setOpenCodeSection("console")}  className={"game__code-heading " + (openCodeSection === "console"? "game__code-heading--selected" : "")}>Console</div>
          </div>
            <textarea style={openCodeSection === "console"? {display: "none"} : {}} ref={codeRef} className='game__code-section game__code'></textarea>
            <textarea style={openCodeSection === "code"   ? {display: "none"} : {}} ref={consoleRef} className='game__code-section game__console' readOnly></textarea>

          <div className="game__controls">
            <div className="game__control">
              <i className="bi bi-play"></i> Run
            </div>
            <div className="game__control">
              <i className="bi bi-gear"></i> Compile
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Game