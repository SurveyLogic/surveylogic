import {Frame} from './frame';
import {FramePatterns} from './frame-patterns';
import {FrameBuilder} from './frame-builder';
import {ActiveFrame} from './active-frame';
import {fabricCanvas, state, tools} from '../../state/utils';

export class FrameTool {
  private readonly patterns: FramePatterns;
  builder: FrameBuilder;
  active: ActiveFrame;

  constructor() {
    this.active = new ActiveFrame();
    this.patterns = new FramePatterns(this.active);
    this.builder = new FrameBuilder(this.active, this.patterns);
    fabricCanvas().on('object:added', () => {
      Object.values(this.active.parts || []).forEach(part => part.moveTo(98));
    });
  }

  /**
   * Add a new frame to canvas.
   */
  add(frameName: string, sizePercent?: number) {
    const frame = this.getByName(frameName);
    if (!frame || this.active.is(frame)) return;

    this.active.remove();

    this.active.currentSizeInPercent = sizePercent ?? frame.size.default;
    const size = this.calcFrameSizeInPixels(this.active.currentSizeInPercent);
    this.builder.build(frame, size);
    state().frame.select(frame);
  }

  /**
   * Resize active frame to specified percentage relative to canvas size.
   */
  resize(percentage?: number) {
    if (!this.active.parts || !this.active.config) return;
    if (!percentage) {
      percentage = this.active.currentSizeInPercent;
    } else {
      this.active.currentSizeInPercent = percentage;
    }
    const size = this.calcFrameSizeInPixels(percentage);
    this.builder.resize(size);
    this.patterns.scale(size);
    tools().canvas.render();
  }

  /**
   * Change color of currently active frame. Only works for "basic" frame.
   */
  changeColor(value: string) {
    this.active.changeColor(value);
  }

  /**
   * Remove currently active frame.
   */
  remove() {
    this.active.remove();
    state().frame.deselect();
  }

  /**
   * Get frame by specified name.
   */
  getByName(frameName: string): Frame | undefined {
    const items = state().config.tools?.frame?.items;
    if (items) {
      return items.find(frame => frame.name === frameName);
    }
  }

  /**
   * @hidden
   */
  getActiveFrameConfig(): Frame | null {
    return this.active.config;
  }

  /**
   * Calculate frame size in pixels based on specified percentage relative to canvas size.
   */
  private calcFrameSizeInPixels(percentage: number) {
    const min = Math.min(state().original.width, state().original.height);
    return Math.ceil((percentage / 100) * min);
  }
}
