let canvasRef = null;
let ctxRef = null;

export function setCanvasRef(ref) {
  canvasRef = ref;
  ctxRef = ref.getContext("2d");
}
export function getCanvasRef() {
  return canvasRef;
}

export function getCtxRef() {
  return ctxRef;
}
