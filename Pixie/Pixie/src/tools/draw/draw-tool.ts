import {fabric} from 'fabric';
import {Path} from 'fabric/fabric-impl';
import {VLineBrush} from './brushes/v-line-brush';
import {HLineBrush} from './brushes/h-line-brush';
import {DiamondBrush} from './brushes/diamond-brush';
import {SquareBrush} from './brushes/square-brush';
import {BrushSizes} from './draw-defaults';
import {ObjectName} from '@app/objects/object-name';
import {staticObjectConfig} from '@app/objects/static-object-config';
import {fabricCanvas, state} from '@app/state/utils';

export class DrawTool {
  private customBrushes = {
    VLineBrush,
    HLineBrush,
    DiamondBrush,
    SquareBrush,
  } as const;
  currentBrush = {
    type: 'PencilBrush',
    color: state().config.objectDefaults?.global?.fill,
    width: BrushSizes[1],
  };

  onPathCreated = (e: {path: Path}) => {
    e.path.name = ObjectName.Drawing;
    e.path.set(getPathConfig());
    state().setDirty(true);
  };

  /**
   * Enable drawing mode on canvas.
   */
  enable() {
    fabricCanvas().on('path:created', this.onPathCreated as any);
    fabricCanvas().isDrawingMode = true;
    this.setBrushType(this.currentBrush.type);
    this.setBrushSize(this.currentBrush.width);
  }

  /**
   * Disable drawing mode on canvas.
   */
  disable() {
    fabricCanvas().off('path:created', this.onPathCreated as any);
    fabricCanvas().isDrawingMode = false;
  }

  getBrushType(): string {
    return this.currentBrush.type;
  }

  setBrushType(type: string) {
    this.currentBrush.type = type;
    fabricCanvas().freeDrawingBrush =
      type in fabric
        ? // @ts-ignore
          new fabric[type](fabricCanvas())
        : // @ts-ignore
          this.customBrushes[type](fabricCanvas());
    this.applyBrushStyles();
  }

  /**
   * Apply current brush styles to fabric.js FreeDrawingBrush instance.
   */
  private applyBrushStyles() {
    Object.keys(this.currentBrush).forEach(key => {
      // @ts-ignore
      fabricCanvas().freeDrawingBrush[key] = this.currentBrush[key];
    });
    const brush = fabricCanvas().freeDrawingBrush as any;
    if (brush.getPatternSrc) {
      brush.source = brush.getPatternSrc.call(brush);
    }
  }

  setBrushSize(size: number) {
    this.currentBrush.width = size;
    this.applyBrushStyles();
  }

  getBrushSize(): number {
    return this.currentBrush.width;
  }

  /**
   * Change color of drawing brush.
   */
  setBrushColor(color: string) {
    this.currentBrush.color = color;
    this.applyBrushStyles();
  }

  /**
   * Get color of drawing brush.
   */
  getBrushColor(): string | undefined {
    return this.currentBrush.color;
  }
}

function getPathConfig() {
  const staticObjConfig = {...staticObjectConfig};
  delete staticObjConfig.strokeWidth;
  return staticObjConfig;
}
