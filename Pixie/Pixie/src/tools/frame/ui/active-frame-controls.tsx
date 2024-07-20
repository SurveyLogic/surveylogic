import {useStore} from '../../../state/store';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {ToolControlsOverlayWrapper} from '../../../ui/navbar/tool-controls-overlay-wrapper';
import {tools} from '../../../state/utils';
import {Slider} from '@common/ui/forms/slider/slider';
import {Trans} from '@common/i18n/trans';
import {useCallback} from 'react';

export function ActiveFrameControls() {
  const activeFrame = useStore(s => s.frame.active);

  const showColorPicker = activeFrame?.mode === 'basic';

  const getValueLabel = useCallback((value: number) => {
    return `${value}%`;
  }, []);

  return (
    <ToolControlsOverlayWrapper className="pb-18 pt-6">
      <div className="max-w-288 m-auto">
        {showColorPicker && (
          <ColorPickerButton
            className="mb-20"
            width="w-full"
            size="sm"
            label={<Trans message="Color" />}
            value={tools().frame.builder.defaultColor}
            onChange={newColor => {
              tools().frame.active.changeColor(newColor);
            }}
          />
        )}
        <Slider
          size="sm"
          label={<Trans message="Size" />}
          step={1}
          minValue={tools().frame.active.getMinSize()}
          maxValue={tools().frame.active.getMaxSize()}
          defaultValue={tools().frame.active.currentSizeInPercent}
          getValueLabel={getValueLabel}
          onChange={value => {
            tools().frame.resize(value);
          }}
        />
      </div>
    </ToolControlsOverlayWrapper>
  );
}
