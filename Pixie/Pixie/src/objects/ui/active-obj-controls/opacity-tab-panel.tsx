import {useStore} from '../../../state/store';
import {state, tools} from '../../../state/utils';
import {Slider} from '@common/ui/forms/slider/slider';

export function OpacityTabPanel() {
  const opacity = useStore(s => s.objects.active.editableProps.opacity);

  return (
    <Slider
      className="max-w-240 w-full mx-auto"
      aria-label="Opacity"
      value={opacity}
      minValue={0.1}
      step={0.1}
      maxValue={1}
      onChange={newOpacity => {
        tools().objects.setValues({opacity: newOpacity});
        state().setDirty(true);
      }}
    />
  );
}
