import {FormSelect} from '../../../ui/forms/select/select';
import {Item} from '../../../ui/forms/listbox/item';
import {Trans} from '../../../i18n/trans';
import {FilterPanelProps} from './filter-panel-props';

export function SelectFilterPanel({filter}: FilterPanelProps) {
  return (
    <FormSelect
      size="sm"
      autoFocus
      name={`${filter.key}.value`}
      selectionMode="single"
    >
      {filter.options.map(option => (
        <Item key={option.key} value={option.key}>
          <Trans {...option.label} />
        </Item>
      ))}
    </FormSelect>
  );
}
