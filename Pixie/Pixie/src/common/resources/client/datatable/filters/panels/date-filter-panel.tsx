import {FormDateRangePicker} from '../../../ui/forms/input-field/date/date-range-picker/form-date-range-picker';
import {FilterPanelProps} from './filter-panel-props';

export function DateFilterPanel({filter}: FilterPanelProps) {
  return (
    <FormDateRangePicker
      size="sm"
      name={`${filter.key}.value`}
      autoFocus
      granularity="day"
      closeDialogOnSelection={true}
    />
  );
}
