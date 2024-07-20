import type {StoreSlice} from '../../state/store';
import {ToolSlice} from '../../state/tool-slice';
import {ActiveToolOverlay} from '../../state/editor-state';

export interface FilterSlice {
  filter: ToolSlice & {
    selected: string | null;
    applied: string[];
    select: (selected: string, hasOptions?: boolean) => void;
    deselect: (filterName: string) => void;
  };
}

export const createFilterSlice: StoreSlice<FilterSlice> = (set, get) => ({
  filter: {
    ...filterSliceDefaults,
    select(filterName, hasOptions = false) {
      set(state => {
        state.filter.selected = filterName;
        state.activeToolOverlay = hasOptions ? ActiveToolOverlay.Filter : null;
        state.dirty = true;
      });
    },
    deselect(filterName: string) {
      if (get().filter.selected === filterName) {
        set(state => {
          state.filter.selected = null;
          state.activeToolOverlay = null;
          state.dirty = true;
        });
      }
    },
    reset() {
      set({filter: {...get().filter, ...filterSliceDefaults}});
    },
  },
});

const filterSliceDefaults = {
  selected: null,
  applied: [],
};
