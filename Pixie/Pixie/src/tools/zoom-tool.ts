import NP from 'number-precision';
import {useStore} from '../state/store';
import {fabricCanvas, state} from '../state/utils';
import {activeInteraction} from '@common/ui/interactions/active-interaction';

export class ZoomTool {
  protected readonly maxZoom = 2;
  protected minZoom = 1;
  readonly step = 0.05;

  get allowUserZoom() {
    return state().config?.tools?.zoom?.allowUserZoom ?? true;
  }

  get currentZoom(): number {
    return state().zoom;
  }

  constructor() {
    if (this.allowUserZoom) {
      this.bindMouseWheel();
    }

    useStore.subscribe(
      s => s.stageSize,
      () => {
        setTimeout(() => {
          this.fitToScreen();
        }, 1);
      }
    );
  }

  zoomIn(amount = this.step) {
    this.set(this.currentZoom + amount);
  }

  canZoomIn(amount = this.step): boolean {
    return this.currentZoom + amount <= this.maxZoom;
  }

  canZoomOut(amount = this.step): boolean {
    return this.currentZoom - amount >= this.minZoom;
  }

  zoomOut(amount = this.step) {
    this.set(this.currentZoom - amount);
  }

  /**
   * Zoom canvas to specified scale.
   */
  set(newZoom: number, resize: boolean = true) {
    if (newZoom < this.minZoom || newZoom > this.maxZoom) return;

    const width = NP.round(state().original.width * newZoom, 0);
    const height = NP.round(state().original.height * newZoom, 0);

    fabricCanvas().setZoom(newZoom);

    if (resize) {
      fabricCanvas().setDimensions({width, height});
    }

    state().setZoom(newZoom);
  }

  /**
   * Resize canvas to fit available screen space.
   */
  fitToScreen() {
    if (!state().config.tools?.zoom?.fitImageToScreen) {
      return;
    }
    const {width, height} = state().stageSize;
    const stageHeight = Math.max(height, 1);
    const stageWidth = Math.max(width, 1);

    // image won't fit into current space available to canvas
    if (
      state().original.height > stageHeight ||
      state().original.width > stageWidth
    ) {
      const scale = Math.min(
        stageHeight / state().original.height,
        stageWidth / state().original.width
      );
      // no need to allow zooming out beyond maximum size that fits into canvas
      this.minZoom = Math.min(scale, 1);
      // image will fit, so we can just load it in original size
    } else {
      this.minZoom = 1;
    }

    this.set(this.minZoom);
  }

  private bindMouseWheel() {
    fabricCanvas().on('mouse:wheel', opt => {
      opt.e.preventDefault();
      opt.e.stopPropagation();

      // disable zoom via mouse wheel if moving, rotating or resizing a shape.
      if (activeInteraction != null) {
        return;
      }

      if ((opt.e as WheelEvent).deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    });
  }
}
