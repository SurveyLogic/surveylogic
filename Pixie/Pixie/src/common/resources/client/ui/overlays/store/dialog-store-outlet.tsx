import {
  closeDialog,
  useDialogStore,
} from '@common/ui/overlays/store/dialog-store';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import React from 'react';

export function DialogStoreOutlet() {
  const {dialog: DialogElement, data} = useDialogStore();
  return (
    <DialogTrigger
      type="modal"
      isOpen={DialogElement != null}
      onClose={value => {
        closeDialog(value);
      }}
    >
      {DialogElement ? <DialogElement {...data} /> : null}
    </DialogTrigger>
  );
}
