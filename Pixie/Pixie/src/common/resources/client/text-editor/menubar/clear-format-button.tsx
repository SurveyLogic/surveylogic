import React from 'react';
import clsx from 'clsx';
import {FormatClearIcon} from '../../icons/material/FormatClear';
import {IconButton} from '../../ui/buttons/icon-button';
import {MenubarButtonProps} from './menubar-button-props';

export function ClearFormatButton({editor, size}: MenubarButtonProps) {
  return (
    <IconButton
      className={clsx('flex-shrink-0')}
      size={size}
      radius="rounded"
      onClick={() => {
        editor.chain().focus().clearNodes().unsetAllMarks().run();
      }}
    >
      <FormatClearIcon />
    </IconButton>
  );
}
