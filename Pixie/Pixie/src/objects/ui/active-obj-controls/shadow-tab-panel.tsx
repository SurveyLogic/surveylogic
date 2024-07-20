import {fabric} from 'fabric';
import React from 'react';
import {IShadowOptions, Shadow} from 'fabric/fabric-impl';
import {useStore} from '../../../state/store';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {state, tools} from '../../../state/utils';
import {Slider} from '@common/ui/forms/slider/slider';
import {useTrans} from '@common/i18n/use-trans';

const shadowDefaults = {
  color: 'rgba(0, 0, 0, 0.6)',
  blur: 3,
  offsetX: -1,
  offsetY: 0,
};

export function ShadowTabPanel() {
  const {trans} = useTrans();
  const shadow =
    useStore(s => s.objects.active.editableProps.shadow) || shadowDefaults;

  return (
    <div className="flex items-center gap-40">
      <ColorPickerButton
        className="ml-auto flex-shrink-0"
        value={shadow.color}
        size="xs"
        aria-label={trans({message: 'Shadow Color'})}
        onChange={color => {
          tools().objects.setValues({shadow: modifiedShadow({color})});
          state().setDirty(true);
        }}
      />
      <Slider
        aria-label="Shadow Blur"
        className="max-w-240 mr-auto flex-shrink-0"
        defaultValue={shadow.blur}
        onChange={blur => {
          tools().objects.setValues({
            shadow: modifiedShadow({blur}),
          });
          state().setDirty(true);
        }}
      />
    </div>
  );
}

function modifiedShadow(options: IShadowOptions) {
  const current = tools().objects.getActive()?.shadow as Shadow | null;
  if (current) {
    Object.entries(options).forEach(([key, val]) => {
      current[key as keyof IShadowOptions] = val;
    });
    return current;
  }
  return new fabric.Shadow({
    ...shadowDefaults,
    ...options,
  });
}
