import {state, tools} from '../state/utils';
import {PixieConfig} from '../config/default-config';

export function resetEditor(config?: Partial<PixieConfig>): Promise<void> {
  // reset UI
  tools().canvas.clear();
  tools().frame.remove();

  const wasClosed = !state().config.ui?.visible;

  // remove previous image and canvas size
  state().setConfig({image: undefined, blankCanvasSize: undefined, ...config});

  state().reset();

  if (state().config.ui?.defaultTool) {
    state().setActiveTool(state().config.ui?.defaultTool!, null);
  }

  if (wasClosed) {
    state().config.onOpen?.();
  }

  return new Promise<void>(resolve => setTimeout(resolve));
}
