import {Group} from 'fabric/fabric-impl';
import {fabric} from 'fabric';
import {staticObjectConfig} from '../../objects/static-object-config';
import {fabricCanvas, state, tools} from '../../state/utils';

export class WatermarkTool {
  private watermark: Group | null = null;

  private lineStyle = {
    stroke: 'rgba(255,255,255,0.3)',
    strokeWidth: 5,
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
  };

  /**
   * Add a watermark to canvas.
   */
  add(watermarkText: string) {
    this.createGroup();
    this.addText(watermarkText);
    this.addLines();

    fabricCanvas().add(this.watermark!);
    tools().canvas.render();
  }

  /**
   * Remove watermark from canvas.
   */
  remove() {
    if (!this.watermark) return;
    fabricCanvas().remove(this.watermark);
    this.watermark = null;
    tools().canvas.render();
  }

  private createGroup() {
    this.watermark = new fabric.Group(undefined, {
      ...staticObjectConfig,
      width: state().original.width,
      height: state().original.height,
      excludeFromExport: true,
      top: 0,
      left: 0,
      originX: 'left',
      originY: 'top',
    });
  }

  private addText(watermarkText: string) {
    const text = new fabric.Text(watermarkText, {
      fill: 'rgba(255,255,255,0.3)',
      strokeWidth: 2,
      stroke: 'rgba(255,255,255,0.4)',
      originX: 'center',
      originY: 'center',
      fontWeight: 600,
      fontSize: 150,
      fontFamily: 'Courier New',
    });

    text.scaleToWidth(state().original.width / 2);
    this.watermark?.add(text);
  }

  private addLines() {
    if (!this.watermark) return;
    const text = this.watermark?.getObjects('text')[0];

    // original canvas size
    const halfWidth = state().original.width / 2;
    const halfHeight = state().original.height / 2;

    // offset from text for watermark lines
    const offsetY = 100;
    const offsetX = text.width! / 4;

    const line1 = new fabric.Line(undefined, this.lineStyle);
    const line2 = new fabric.Line(undefined, this.lineStyle);
    const line3 = new fabric.Line(undefined, this.lineStyle);
    const line4 = new fabric.Line(undefined, this.lineStyle);

    this.watermark.add(line1, line2, line3, line4);

    line1.set({
      x1: offsetX,
      y1: -offsetY,
      x2: halfWidth,
      y2: -halfHeight,
    });

    line2.set({
      x1: offsetX,
      y1: offsetY,
      x2: halfWidth,
      y2: halfHeight,
    });

    line3.set({
      x1: -offsetX,
      y1: -offsetY,
      x2: -halfWidth,
      y2: -halfHeight,
    });

    line4.set({
      x1: -offsetX,
      y1: offsetY,
      x2: -halfWidth,
      y2: halfHeight,
    });
  }
}
