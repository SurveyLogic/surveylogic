import type {StoreSlice} from '../../state/store';
import {Frame} from './frame';
import {ToolSlice} from '../../state/tool-slice';
import {ToolName} from '../tool-name';
import {ActiveToolOverlay} from '../../state/editor-state';

export interface FrameSlice {
  frame: ToolSlice & {
    active: Frame | null;
    select: (frame: Frame) => void;
    deselect: () => void;
    showOptionsPanel: () => void;
  };
}

export const createFrameSlice: StoreSlice<FrameSlice> = (set, get) => ({
  frame: {
    ...frameSliceDefaults,
    select: frame => {
      set(state => {
        state.frame.active = frame;
      });
      get().frame.showOptionsPanel();
    },
    deselect: () => {
      set(state => {
        state.frame.active = null;
        state.activeToolOverlay = null;
      });
    },
    showOptionsPanel: () => {
      if (get().activeTool === ToolName.FRAME) {
        set(state => {
          state.activeToolOverlay = ActiveToolOverlay.Frame;
        });
      }
    },
    reset() {
      set({frame: {...get().frame, ...frameSliceDefaults}});
    },
  },
});

const frameSliceDefaults = {
  active: null,
};
