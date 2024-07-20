import {castDraft} from 'immer';
import {HistoryItem} from '../history-item.interface';
import type {StoreSlice} from '../../../state/store';

export interface HistorySlice {
  history: {
    items: HistoryItem[];
    pointer: number;
    canUndo: boolean;
    canRedo: boolean;
    updatePointerById: (id: string) => void;
    update: (pointer: number, items?: HistoryItem[]) => void;
    reset: (newState?: HistorySlice['history']) => void;
  };
}

export const createHistorySlice: StoreSlice<HistorySlice> = (set, get) => ({
  history: {
    ...historySliceDefaults,
    updatePointerById: id => {
      const index = get().history.items.findIndex(i => i.id === id);
      get().history.update(index);
    },
    update: (pointer, items) => {
      set(state => {
        state.history.pointer = pointer;
        if (items) {
          state.history.items = castDraft(items);
        }
        state.history.canUndo = state.history.pointer > 0;
        state.history.canRedo =
          state.history.items.length > state.history.pointer + 1;
      });
    },
    reset: newState => {
      set({history: {...get().history, ...(newState ?? historySliceDefaults)}});
    },
  },
});

const historySliceDefaults = {
  items: [],
  pointer: 0,
  canUndo: false,
  canRedo: false,
};
