import type {StoreSlice} from '../../state/store';
import {ToolSlice} from '../../state/tool-slice';
import {InteractableRect} from '@common/ui/interactions/interactable-event';

export interface CropSlice {
  crop: ToolSlice & {
    zoneRect: InteractableRect | null;
    selectedAspectRatio: string | null;
    straightenAngle: number;

    setCropzoneRect: (rect: InteractableRect) => void;
    setAspectRatio: (ratio: string | null) => void;
    setTransformAngle: (angle: number) => void;
  };
}
export const createCropSlice: StoreSlice<CropSlice> = (set, get) => ({
  crop: {
    ...cropSliceDefaults,
    setCropzoneRect: rect => {
      set(state => {
        state.crop.zoneRect = rect;
      });
    },
    setAspectRatio: ratio => {
      set(state => {
        state.crop.selectedAspectRatio = ratio;
      });
    },
    setTransformAngle: angle => {
      set(state => {
        state.crop.straightenAngle = angle;
      });
    },
    apply: async () => {
      const rect = get().crop.zoneRect;
      if (rect) {
        const scaledRect = {
          width: Math.ceil(rect.width / get().zoom),
          height: Math.ceil(rect.height / get().zoom),
          left: Math.ceil(rect.left / get().zoom),
          top: Math.ceil(rect.top / get().zoom),
        };
        await get().editor.tools.crop.apply(scaledRect);
      }
    },
    reset: () => {
      set({crop: {...get().crop, ...cropSliceDefaults}});
    },
  },
});

const cropSliceDefaults = {
  zoneRect: null,
  selectedAspectRatio: null,
  straightenAngle: 0,
};
