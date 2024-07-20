import {Rect} from 'fabric/fabric-impl';
import {Frame} from './frame';
import {fabricCanvas, tools} from '../../state/utils';

export interface ActiveFrameParts {
  topLeft: Rect;
  top: Rect;
  topRight: Rect;
  right: Rect;
  bottomRight: Rect;
  bottom: Rect;
  bottomLeft: Rect;
  left: Rect;
}

export class ActiveFrame {
  /**
   * List of frame corner names.
   */
  readonly corners = [
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
  ] as const;

  /**
   * List of frame side names.
   */
  readonly sides = ['top', 'right', 'bottom', 'left'] as const;

  parts: ActiveFrameParts | null = null;

  /**
   * Configuration for currently active frame.
   */
  config: Frame | null = null;

  /**
   * Current size of frame in percents relative to canvas size.
   */
  currentSizeInPercent: number = 100;

  getPartNames() {
    return [...this.corners, ...this.sides];
  }

  hide() {
    if (!this.parts) return;
    Object.values(this.parts).forEach(part => part.set({visible: false}));
    tools().canvas.render();
  }

  show() {
    if (!this.parts) return;
    Object.values(this.parts).forEach(part => part.set({visible: true}));
    tools().canvas.render();
  }

  /**
   * Remove currently active frame.
   */
  remove() {
    if (!this.parts) return;

    // delete all fabric object references
    this.config = null;
    Object.values(this.parts).forEach(part => {
      fabricCanvas().remove(part);
    });
    this.parts = null;
    tools().canvas.render();
  }

  /**
   * Check if specified frame is active.
   */
  is(frame: Frame): boolean {
    if (!this.config) return false;
    return this.config.name === frame.name;
  }

  /**
   * Change color of basic frame.
   */
  changeColor(value: string) {
    if (this.config?.mode !== 'basic' || !this.parts) return;

    Object.values(this.parts).forEach(part => {
      part.set('fill', value);
    });

    tools().canvas.render();
  }

  getMinSize(): number {
    return this.config?.size.min ?? 1;
  }

  getMaxSize(): number {
    return this.config?.size.max ?? 35;
  }
}
