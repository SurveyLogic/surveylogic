import {clampResizePayload} from './clamp-resize-payload';
import {fabricCanvas, state, tools} from '../../state/utils';

export class ResizeTool {
  /**
   * Resize image and other canvas objects.
   * If "usePercentages" is false, width/height should be pixels.
   */
  apply(payload: ResizePayload) {
    const {width, height, usePercentages} = clampResizePayload(payload);
    const currentWidth = Math.ceil(state().original.width);
    const currentHeight = Math.ceil(state().original.height);
    const newWidth = Math.ceil(width);
    const newHeight = Math.ceil(height);
    let widthScale;
    let heightScale;

    if (usePercentages) {
      widthScale = width / 100;
      heightScale = height / 100;
    } else {
      widthScale = width / state().original.width;
      heightScale = height / state().original.height;
    }

    if (currentWidth === newWidth && currentHeight === newHeight) return;

    this.resize(widthScale, heightScale);
  }

  /**
   * Resize canvas and all objects to specified scale.
   */
  private resize(widthScale: number, heightScale: number) {
    tools().zoom.set(1, false);

    const newHeight = Math.round(state().original.height * heightScale);
    const newWidth = Math.round(state().original.width * widthScale);

    tools().canvas.resize(newWidth, newHeight, {
      applyZoom: false,
      resizeHelper: true,
    });

    tools()
      .objects.getAll()
      .forEach(object => {
        const scaleX = object.scaleX || 1;
        const scaleY = object.scaleY || 1;
        const left = object.left || 0;
        const top = object.top || 0;

        const tempScaleX = scaleX * widthScale;
        const tempScaleY = scaleY * heightScale;
        const tempLeft = left * widthScale;
        const tempTop = top * heightScale;

        object.scaleX = tempScaleX;
        object.scaleY = tempScaleY;
        object.left = tempLeft;
        object.top = tempTop;

        object.setCoords();
      });

    tools().zoom.fitToScreen();
    fabricCanvas().requestRenderAll();
  }
}

export interface ResizePayload {
  width: number;
  height: number;
  maintainAspect: boolean;
  usePercentages: boolean;
}
