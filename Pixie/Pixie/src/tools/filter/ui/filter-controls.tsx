import {useStore} from '@app/state/store';
import {ToolControlsOverlayWrapper} from '@app/ui/navbar/tool-controls-overlay-wrapper';
import {ColorPickerButton} from '@app/ui/color-picker-button';
import {FabricFilter} from '@app/tools/filter/filter-tool';
import {filterOptionMessages} from '@app/tools/filter/filter-list';
import {state, tools} from '@app/state/utils';
import {Slider} from '@common/ui/forms/slider/slider';
import {Trans} from '@common/i18n/trans';
import {Select} from '@common/ui/forms/select/select';
import {Item} from '@common/ui/forms/listbox/item';

export function FilterControls() {
  const selectedFilter = useStore(s => s.filter.selected);
  if (!selectedFilter) return null;
  const options = tools().filter.getByName(selectedFilter).options;

  const applyValue = (optionName: string, value: string | number) => {
    tools().filter?.applyValue(selectedFilter, optionName, value);
    state().setDirty(true);
  };

  const activeFilters = tools().canvas.getMainImage().filters as FabricFilter[];
  const i = tools().filter.findFilterIndex(selectedFilter, activeFilters);
  const fabricFilter = activeFilters?.[i];

  if (options) {
    const controls = Object.entries(options).map(([optionName, config]) => {
      let component;
      const value = fabricFilter ? fabricFilter[optionName] : config.current;
      if (config.type === 'slider') {
        component = (
          <Slider
            label={
              <span className="capitalize">
                <Trans {...filterOptionMessages[optionName]} />
              </span>
            }
            minValue={config.min}
            maxValue={config.max}
            step={config.step}
            defaultValue={value}
            formatOptions={{style: 'percent'}}
            size="sm"
            onChange={newValue => {
              applyValue(optionName, newValue);
            }}
          />
        );
      } else if (config.type === 'colorPicker') {
        component = (
          <ColorPickerButton
            label={<Trans {...filterOptionMessages[optionName]} />}
            size="sm"
            width="w-full"
            value={value}
            onChange={newValue => {
              applyValue(optionName, newValue);
            }}
          />
        );
      } else if (config.type === 'select') {
        component = (
          <Select
            selectionMode="single"
            size="sm"
            label={<Trans {...filterOptionMessages[optionName]} />}
            defaultValue={value}
            onSelectionChange={newValue => {
              applyValue(optionName, newValue);
            }}
          >
            {config.available.map(item => (
              <Item key={item.key} value={item.key}>
                <span className="capitalize">
                  <Trans message={item.key} />
                </span>
              </Item>
            ))}
          </Select>
        );
      }

      return (
        <div className="pb-10" key={optionName}>
          {component}
        </div>
      );
    });
    return (
      <ToolControlsOverlayWrapper>
        <div className="max-w-240 pt-10 mx-auto">{controls}</div>
      </ToolControlsOverlayWrapper>
    );
  }

  return null;
}
