import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../../ui/buttons/icon-button';
import {FormatIndentDecreaseIcon} from '../../icons/material/FormatIndentDecrease';
import {FormatIndentIncreaseIcon} from '../../icons/material/FormatIndentIncrease';
import {MenubarButtonProps} from './menubar-button-props';

export function IndentButtons({editor, size}: MenubarButtonProps) {
  return (
    <span className={clsx('flex-shrink-0', 'whitespace-nowrap')}>
      <IconButton
        size={size}
        radius="rounded"
        onClick={() => {
          editor.commands.focus();
          editor.commands.outdent();
        }}
      >
        <FormatIndentDecreaseIcon />
      </IconButton>
      <IconButton
        size={size}
        radius="rounded"
        onClick={() => {
          editor.commands.focus();
          editor.commands.indent();
        }}
      >
        <FormatIndentIncreaseIcon />
      </IconButton>
    </span>
  );
}
