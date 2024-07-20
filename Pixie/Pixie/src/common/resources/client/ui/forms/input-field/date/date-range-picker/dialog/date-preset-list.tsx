import {List, ListItem} from '../../../../../list/list';
import {DateRangePresets} from './date-range-presets';
import {Trans} from '../../../../../../i18n/trans';
import {DateRangeValue} from '../date-range-value';

interface DatePresetList {
  onPresetSelected: (value: DateRangeValue) => void;
  selectedValue?: DateRangeValue | null;
}
export function DatePresetList({
  onPresetSelected,
  selectedValue,
}: DatePresetList) {
  return (
    <List
      className="min-w-192"
      padding="py-14"
      dataTestId="date-range-preset-list"
    >
      {DateRangePresets.map(preset => (
        <ListItem
          borderRadius="rounded-none"
          capitalizeFirst
          key={preset.key}
          isSelected={selectedValue?.preset === preset.key}
          onSelected={() => {
            const newValue = preset.getRangeValue();
            onPresetSelected(newValue);
          }}
        >
          <Trans {...preset.label} />
        </ListItem>
      ))}
    </List>
  );
}
