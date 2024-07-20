import React from 'react';
import IconPicker from './icon-picker';
import {useDialogContext} from '../overlays/dialog/dialog-context';
import {Dialog} from '../overlays/dialog/dialog';
import {DialogHeader} from '../overlays/dialog/dialog-header';
import {DialogBody} from '../overlays/dialog/dialog-body';
import {Trans} from '../../i18n/trans';

export function IconPickerDialog() {
  return (
    <Dialog size="w-850" className="min-h-dialog">
      <DialogHeader>
        <Trans message="Select icon" />
      </DialogHeader>
      <DialogBody>
        <IconPickerWrapper />
      </DialogBody>
    </Dialog>
  );
}

function IconPickerWrapper() {
  const {close} = useDialogContext();
  return (
    <IconPicker
      onIconSelected={value => {
        close(value);
      }}
    />
  );
}
