import React from 'react';
import {useStore} from '../../../state/store';
import {ButtonGroup} from '@common/ui/buttons/button-group';
import {IconButton} from '@common/ui/buttons/icon-button';
import {tools} from '../../../state/utils';
import {UndoIcon} from '@common/icons/material/Undo';
import {RedoIcon} from '@common/icons/material/Redo';

export function UndoRedoBtns() {
  const canUndo = useStore(s => s.history.canUndo);
  const canRedo = useStore(s => s.history.canRedo);

  return (
    <ButtonGroup variant="outline">
      <IconButton
        equalWidth={false}
        size="xs"
        padding="pl-12 pr-10"
        radius="rounded-full"
        disabled={!canUndo}
        onClick={() => {
          tools().history.undo();
        }}
      >
        <UndoIcon />
      </IconButton>
      <IconButton
        equalWidth={false}
        padding="pl-10 pr-12"
        size="xs"
        radius="rounded-full"
        disabled={!canRedo}
        onClick={() => {
          tools().history.redo();
        }}
      >
        <RedoIcon />
      </IconButton>
    </ButtonGroup>
  );
}
