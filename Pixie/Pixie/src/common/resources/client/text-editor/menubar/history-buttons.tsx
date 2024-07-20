import React from 'react';
import {IconButton} from '../../ui/buttons/icon-button';
import {UndoIcon} from '../../icons/material/Undo';
import {RedoIcon} from '../../icons/material/Redo';
import {MenubarButtonProps} from './menubar-button-props';

export function HistoryButtons({editor}: MenubarButtonProps) {
  return (
    <span>
      <IconButton
        size="md"
        radius="rounded"
        disabled={!editor.can().undo()}
        onClick={() => {
          editor.commands.focus();
          editor.commands.undo();
        }}
      >
        <UndoIcon />
      </IconButton>
      <IconButton
        size="md"
        radius="rounded"
        disabled={!editor.can().redo()}
        onClick={() => {
          editor.commands.focus();
          editor.commands.redo();
        }}
      >
        <RedoIcon />
      </IconButton>
    </span>
  );
}
