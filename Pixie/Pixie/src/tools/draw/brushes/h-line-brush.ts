import {fabric} from 'fabric';

export const HLineBrush = (canvas: fabric.Canvas) => {
  const hLinePatternBrush = new (fabric.PatternBrush as any)(canvas);
  hLinePatternBrush.getPatternSrc = function HLineBrushSrc() {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    const ctx = patternCanvas.getContext('2d')!;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.stroke();

    return patternCanvas;
  };

  return hLinePatternBrush;
};
