import {ToolSlice} from '../../state/tool-slice';
import type {StoreSlice} from '../../state/store';

export interface CornersSlice {
  corners: ToolSlice & {
    radius: number;
    setRadius: (radius: number) => void;
  };
}

export const createCornersSlice: StoreSlice<CornersSlice> = (set, get) => ({
  corners: {
    ...cornerSliceDefaults,
    setRadius: newRadius => {
      set(s => {
        s.corners.radius = newRadius;
      });
    },
    apply() {
      return get().editor.tools.corners.apply(get().corners.radius);
    },
    reset() {
      set({corners: {...get().corners, ...cornerSliceDefaults}});
    },
  },
});

const cornerSliceDefaults = {
  radius: 50,
};
