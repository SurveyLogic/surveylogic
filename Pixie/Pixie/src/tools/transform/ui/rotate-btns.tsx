import React from 'react';
import {IconButton} from '@common/ui/buttons/icon-button';
import {state, tools} from '../../../state/utils';
import {RotateLeftIcon} from '@common/icons/material/RotateLeft';
import {RotateRightIcon} from '@common/icons/material/RotateRight';

export function RotateBtns() {
  return (
    <div>
      <IconButton
        size="sm"
        onClick={() => {
          tools().transform.rotateLeft();
          state().setDirty(true);
        }}
      >
        <RotateLeftIcon />
      </IconButton>
      <IconButton
        size="sm"
        onClick={() => {
          tools().transform.rotateRight();
          state().setDirty(true);
        }}
      >
        <RotateRightIcon />
      </IconButton>
    </div>
  );
}
