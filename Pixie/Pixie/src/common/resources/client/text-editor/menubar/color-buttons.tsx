import React, {Fragment, useState} from 'react';
import clsx from 'clsx';
import {FormatColorTextIcon} from '../../icons/material/FormatColorText';
import {ColorPickerDialog} from '../../ui/color-picker/color-picker-dialog';
import {MenubarButtonProps} from './menubar-button-props';
import {IconButton} from '../../ui/buttons/icon-button';
import {FormatColorFillIcon} from '../../icons/material/FormatColorFill';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';

export function ColorButtons({editor, size}: MenubarButtonProps) {
  const [dialog, setDialog] = useState<'text' | 'bg' | false>(false);
  const textActive = editor.getAttributes('textStyle').color;
  const backgroundActive = editor.getAttributes('textStyle').backgroundColor;
  return (
    <Fragment>
      <span className={clsx('flex-shrink-0 whitespace-nowrap')}>
        <IconButton
          size={size}
          radius="rounded"
          color={textActive ? 'primary' : null}
          onClick={() => {
            setDialog('text');
          }}
        >
          <FormatColorTextIcon />
        </IconButton>
        <IconButton
          size={size}
          radius="rounded"
          color={backgroundActive ? 'primary' : null}
          onClick={() => {
            setDialog('bg');
          }}
        >
          <FormatColorFillIcon />
        </IconButton>
      </span>
      <DialogTrigger
        currentValue={dialog === 'text' ? '#000000' : '#FFFFFF'}
        type="modal"
        isOpen={!!dialog}
        onClose={newValue => {
          if (newValue) {
            if (dialog === 'text') {
              editor.commands.setColor(newValue);
            } else {
              editor.commands.setBackgroundColor(newValue);
            }
          }
          setDialog(false);
        }}
      >
        <ColorPickerDialog
          defaultValue={dialog === 'text' ? '#000000' : '#FFFFFF'}
        />
      </DialogTrigger>
    </Fragment>
  );
}
