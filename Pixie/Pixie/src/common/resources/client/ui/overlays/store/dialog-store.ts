import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import React, {JSXElementConstructor} from 'react';

interface DialogStore<
  C extends JSXElementConstructor<unknown> = JSXElementConstructor<any>,
  D = React.ComponentProps<C>
> {
  dialog: C | null;
  data: D;
  openDialog: (dialog: C, data?: D) => Promise<any>;
  closeActiveDialog: (value: any) => void;
  resolveClosePromise: null | ((value: any) => void);
}

export const useDialogStore = create<DialogStore>()(
  immer((set, get) => ({
    dialog: null,
    data: undefined,
    resolveClosePromise: null,
    openDialog: (dialog, data) => {
      return new Promise(resolve => {
        set(state => {
          state.dialog = dialog;
          state.data = data;
          state.resolveClosePromise = resolve;
        });
      });
    },
    closeActiveDialog: value => {
      get().resolveClosePromise?.(value);
      set(state => {
        state.dialog = null;
        state.data = undefined;
        state.resolveClosePromise = null;
      });
    },
  }))
);

export const openDialog = useDialogStore.getState().openDialog;
export const closeDialog = (value: any) => {
  useDialogStore.getState().closeActiveDialog(value);
};
