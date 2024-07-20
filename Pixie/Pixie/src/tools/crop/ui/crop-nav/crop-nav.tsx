import React, {useEffect} from 'react';
import {CropPresetBtns} from './crop-preset-btns';
import {TransformWidget} from '../../../transform/ui/transform-widget';
import {state, tools} from '@app/state/utils';

export function CropNav() {
  useEffect(() => {
    state().setDirty(true);
    tools().frame.active.hide();
    return () => {
      tools().frame.active.show();
    };
  }, []);

  return (
    <div className="pb-16">
      <div className="mb-10">
        <TransformWidget />
      </div>
      <CropPresetBtns />
    </div>
  );
}
