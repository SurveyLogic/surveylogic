import {useStore} from '../../../state/store';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {state, tools} from '../../../state/utils';
import {Slider} from '@common/ui/forms/slider/slider';
import {useTrans} from '@common/i18n/use-trans';

export function OutlineTabPanel() {
  const {trans} = useTrans();
  const outlineColor = useStore(s => s.objects.active.editableProps.stroke);
  const outlineWidth = useStore(
    s => s.objects.active.editableProps.strokeWidth
  );

  return (
    <div className="flex items-center gap-40">
      <ColorPickerButton
        className="ml-auto flex-shrink-0"
        size="xs"
        value={outlineColor}
        aria-label={trans({message: 'Outline Color'})}
        onChange={newColor => {
          tools().objects.setValues({stroke: newColor});
          state().setDirty(true);
        }}
      />
      <Slider
        aria-label="Outline Width"
        className="max-w-240 mr-auto flex-shrink-0"
        value={outlineWidth}
        onChange={newWidth => {
          tools().objects.setValues({strokeWidth: newWidth});
          state().setDirty(true);
        }}
      />
    </div>
  );
}
