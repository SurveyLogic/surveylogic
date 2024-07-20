import React from 'react';
import {IconButton} from '@common/ui/buttons/icon-button';
import {state, tools} from '../../../state/utils';
import {FlipIcon} from '@common/icons/material/Flip';

export function FlipBtns() {
  return (
    <div>
      <IconButton
        size="sm"
        onClick={() => {
          tools().transform.flip('vertical');
          state().setDirty(true);
        }}
      >
        <FlipIcon />
      </IconButton>
      <IconButton
        size="sm"
        onClick={() => {
          tools().transform.flip('horizontal');
          state().setDirty(true);
        }}
      >
        <FlipIcon className="rotate-90" />
      </IconButton>
    </div>
  );
}
