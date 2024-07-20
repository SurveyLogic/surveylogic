import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../../ui/buttons/icon-button';
import {FormatListBulletedIcon} from '../../icons/material/FormatListBulleted';
import {FormatListNumberedIcon} from '../../icons/material/FormatListNumbered';
import {MenubarButtonProps} from './menubar-button-props';

export function ListButtons({editor, size}: MenubarButtonProps) {
  const bulletActive = editor.isActive('bulletList');
  const orderedActive = editor.isActive('orderedList');
  return (
    <span className={clsx('flex-shrink-0', 'whitespace-nowrap')}>
      <IconButton
        size={size}
        radius="rounded"
        color={bulletActive ? 'primary' : null}
        onClick={() => {
          editor.commands.focus();
          editor.commands.toggleBulletList();
        }}
      >
        <FormatListBulletedIcon />
      </IconButton>
      <IconButton
        size={size}
        radius="rounded"
        color={orderedActive ? 'primary' : null}
        onClick={() => {
          editor.commands.focus();
          editor.commands.toggleOrderedList();
        }}
      >
        <FormatListNumberedIcon />
      </IconButton>
    </span>
  );
}
