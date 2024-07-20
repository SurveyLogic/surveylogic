import {fabric} from 'fabric';

export const VLineBrush = (canvas: fabric.Canvas) => {
  const vLinePatternBrush = new (fabric.PatternBrush as any)(canvas);
  vLinePatternBrush.getPatternSrc = function VLineBrushSrc() {
    const patternCanvas = (fabric as any).document.createElement('canvas');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    const ctx = patternCanvas.getContext('2d');

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.stroke();

    return patternCanvas;
  };
  return vLinePatternBrush;
};
