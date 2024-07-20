import type {StoreSlice} from '../../../state/store';
import {ToolSlice} from '../../../state/tool-slice';

interface ResizeFormValue {
  width: number;
  height: number;
  maintainAspect: boolean;
  usePercentages: boolean;
}

export interface ResizeSlice {
  resize: ToolSlice & {
    formValue: ResizeFormValue;
    setFormValue: (val: Partial<ResizeFormValue>) => void;
    reset: () => void;
  };
}

export const createResizeSlice: StoreSlice<ResizeSlice> = (set, get) => ({
  resize: {
    ...resizeSliceDefaults,
    setFormValue: value => {
      set(state => {
        Object.entries(value).forEach(([k, v]) => {
          // @ts-ignore
          state.resize.formValue[k] = v;
        });
      });
    },
    apply() {
      const newSize = get().resize.formValue;
      const oldSize = get().original;
      // no need to add history item if we did not apply resize
      if (
        newSize.width === oldSize.width &&
        newSize.height === oldSize.height
      ) {
        return false;
      }
      get().editor.tools.resize.apply(newSize);
    },
    reset() {
      set({resize: {...get().resize, ...resizeSliceDefaults}});
    },
  },
});

const resizeSliceDefaults = {
  formValue: {
    width: 1,
    height: 1,
    maintainAspect: true,
    usePercentages: false,
  },
};
