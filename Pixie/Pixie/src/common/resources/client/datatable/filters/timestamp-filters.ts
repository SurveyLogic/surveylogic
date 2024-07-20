import {
  BackendFilter,
  BackendFilterOptions,
  FilterControlType,
  FilterOperator,
} from './backend-filter';
import {
  DateRangePreset,
  DateRangePresets,
} from '../../ui/forms/input-field/date/date-range-picker/dialog/date-range-presets';
import {message} from '../../i18n/message';
import {dateRangeToAbsoluteRange} from '../../ui/forms/input-field/date/date-range-picker/form-date-range-picker';

export class TimestampFilter extends BackendFilter {
  type = FilterControlType.DatePicker;
  defaultOperator = FilterOperator.between;
  constructor(options: Partial<BackendFilterOptions>) {
    if (!options.defaultValue) {
      options.defaultValue = dateRangeToAbsoluteRange(
        (DateRangePresets[3] as Required<DateRangePreset>).getRangeValue()
      );
    }
    super(options);
  }
}

export class CreatedAtFilter extends TimestampFilter {
  key = 'created_at';
  label = message('Date created');
}

export class UpdatedAtFilter extends TimestampFilter {
  key = 'updated_at';
  label = message('Last updated');
}
