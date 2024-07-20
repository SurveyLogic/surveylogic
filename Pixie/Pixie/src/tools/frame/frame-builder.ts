import {fabric} from 'fabric';
import {ActiveFrame, ActiveFrameParts} from './active-frame';
import {FramePatterns} from './frame-patterns';
import {Frame} from './frame';
import {staticObjectConfig} from '../../objects/static-object-config';
import {fabricCanvas, state, tools} from '../../state/utils';

export class FrameBuilder {
  get defaultColor(): string | undefined {
    return state().config.objectDefaults?.global?.fill;
  }

  constructor(
    private activeFrame: ActiveFrame,
    private patterns: FramePatterns
  ) {}

  /**
   * Build a new canvas frame group.
   */
  build(frame: Frame, size: number): void {
    this.createParts(frame);
    this.resize(size);
    this.activeFrame.config = frame;

    // basic frame has no pattern fill
    if (frame.mode === 'basic') {
      tools().canvas.render();
      return;
    }

    this.patterns.load(frame).then(() => {
      this.patterns.scale(size);
      tools().canvas.render();
    });
  }

  /**
   * Create rect object for each frame part.
   */
  private createParts(frame: Frame) {
    const parts: ActiveFrameParts = {} as ActiveFrameParts;
    this.activeFrame.getPartNames().forEach(partName => {
      const fill = frame.mode === 'basic' ? this.defaultColor : undefined;
      parts[partName] = new fabric.Rect({
        ...staticObjectConfig,
        fill,
        originX: 'left',
        originY: 'top',
        name: `frame.rect.${partName}`,
        objectCaching: false, // patterns are not redrawn correctly when resizing frame without this
        data: {pixieInternal: true},
      });
      fabricCanvas().add(parts[partName]);
    });
    this.activeFrame.parts = parts;
  }

  /**
   * Position and resize all frame parts.
   */
  resize(value: number) {
    const fullWidth = state().original.width;
    const fullHeight = state().original.height;
    const frame = this.activeFrame;
    const cornerSize = value;

    if (!frame.parts) return;

    frame.parts.topLeft.set({
      width: cornerSize,
      height: cornerSize,
    });

    frame.parts.topRight.set({
      left: fullWidth - frame.parts.topLeft.getScaledWidth(),
      width: cornerSize,
      height: cornerSize,
    });

    frame.parts.top.set({
      left: frame.parts.topLeft.getScaledWidth() - 1,
      width:
        fullWidth -
        frame.parts.topLeft.getScaledWidth() -
        frame.parts.topRight.getScaledWidth() +
        3,
      height: cornerSize,
    });

    frame.parts.bottomLeft.set({
      top: fullHeight - frame.parts.topLeft.getScaledHeight(),
      width: cornerSize,
      height: cornerSize,
    });

    frame.parts.left.set({
      top: frame.parts.topLeft.getScaledHeight() - 1,
      width: cornerSize,
      height:
        fullHeight -
        frame.parts.topLeft.getScaledHeight() -
        frame.parts.bottomLeft.getScaledHeight() +
        3,
    });

    frame.parts.bottomRight.set({
      left: fullWidth - frame.parts.bottomLeft.getScaledWidth(),
      top: fullHeight - frame.parts.topRight.getScaledWidth(),
      width: cornerSize,
      height: cornerSize,
    });

    frame.parts.bottom.set({
      left: frame.parts.top.left,
      top: fullHeight - frame.parts.top.getScaledHeight(),
      width: frame.parts.top.getScaledWidth(),
      height: cornerSize,
    });

    frame.parts.right.set({
      left: fullWidth - frame.parts.left.getScaledWidth(),
      top: frame.parts.left.top,
      width: frame.parts.left.width,
      height: frame.parts.left.getScaledHeight(),
    });
  }
}
