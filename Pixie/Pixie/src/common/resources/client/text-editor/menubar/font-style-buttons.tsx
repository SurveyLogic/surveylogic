import React from 'react';
import clsx from 'clsx';
import {IconButton} from '../../ui/buttons/icon-button';
import {FormatBoldIcon} from '../../icons/material/FormatBold';
import {FormatItalicIcon} from '../../icons/material/FormatItalic';
import {FormatUnderlinedIcon} from '../../icons/material/FormatUnderlined';
import {MenubarButtonProps} from './menubar-button-props';

export function FontStyleButtons({editor, size}: MenubarButtonProps) {
  return (
    <span className={clsx('flex-shrink-0 whitespace-nowrap')}>
      <IconButton
        size={size}
        radius="rounded"
        color={editor.isActive('bold') ? 'primary' : null}
        onClick={() => {
          editor.commands.focus();
          editor.commands.toggleBold();
        }}
      >
        <FormatBoldIcon />
      </IconButton>
      <IconButton
        size={size}
        radius="rounded"
        color={editor.isActive('italic') ? 'primary' : null}
        onClick={() => {
          editor.commands.focus();
          editor.commands.toggleItalic();
        }}
      >
        <FormatItalicIcon />
      </IconButton>
      <IconButton
        size={size}
        radius="rounded"
        color={editor.isActive('underline') ? 'primary' : null}
        onClick={() => {
          editor.commands.focus();
          editor.commands.toggleUnderline();
        }}
      >
        <FormatUnderlinedIcon />
      </IconButton>
    </span>
  );
}
