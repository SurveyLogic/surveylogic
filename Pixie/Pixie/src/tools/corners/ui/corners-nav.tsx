import {useEffect} from 'react';
import {useStore} from '@app/state/store';
import {state, tools} from '@app/state/utils';
import {Slider} from '@common/ui/forms/slider/slider';
import {useTrans} from '@common/i18n/use-trans';

export function CornersNav() {
  const {trans} = useTrans();
  const radius = useStore(s => s.corners.radius);

  useEffect(() => {
    state().setDirty(true);
    tools().corners.showPreview();
    return () => tools().corners.hidePreview();
  }, []);

  return (
    <div className="max-w-320 mx-auto">
      <Slider
        minValue={1}
        maxValue={300}
        label={trans({message: 'Radius'})}
        getValueLabel={value => {
          return `${value}px`;
        }}
        onChange={val => {
          tools().corners.updatePreview(val);
          state().corners.setRadius(val);
        }}
        value={radius}
      />
    </div>
  );
}
