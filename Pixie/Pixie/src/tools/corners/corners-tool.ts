import {Rect} from 'fabric/fabric-impl';
import {fabric} from 'fabric';
import {fabricCanvas, state, tools} from '../../state/utils';

export class CornersTool {
  private previewRect: Rect | null = null;

  async apply(radius: number) {
    if (!this.previewRect) {
      this.showPreview();
    }
    this.updatePreview(radius);

    fabricCanvas().remove(this.previewRect!);
    fabricCanvas().clipPath = this.previewRect!;

    // get data and clear canvas
    const data = tools().export.getDataUrl();
    if (data) {
      tools().canvas.clear();
    }

    // hide preview
    this.hidePreview();

    // add new rounded image
    if (data) {
      await tools().canvas.addMainImage(data);
    }

    fabricCanvas().clipPath = undefined;
  }

  getPreviewRadius(): number {
    return this.previewRect?.rx || 0;
  }

  updatePreview(radius: number) {
    if (!this.previewRect) return;
    this.previewRect.set({
      rx: radius,
      ry: radius,
    });
    tools().canvas.render();
  }

  showPreview() {
    const radius = state().original.width * 0.04;
    this.previewRect = new fabric.Rect({
      width: state().original.width,
      height: state().original.height,
      rx: radius,
      ry: radius,
      objectCaching: false,
      fill: 'transparent',
      name: 'round.rect',
      data: {pixieInternal: true},
      stroke: 'rgba(255,255,255,0.8)',
      strokeWidth: 3,
      strokeDashArray: [4, 4],
      selectable: false,
      evented: false,
    });

    fabricCanvas().add(this.previewRect);
    this.previewRect.moveTo(99);
    this.previewRect.viewportCenter();
    tools().canvas.render();
  }

  hidePreview() {
    if (!this.previewRect) return;
    fabricCanvas().remove(this.previewRect);
    tools().canvas.render();
    this.previewRect = null;
  }
}
