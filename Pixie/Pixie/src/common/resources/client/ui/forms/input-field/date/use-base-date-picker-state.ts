import {useState} from 'react';
import {DateValue, toZoned, ZonedDateTime} from '@internationalized/date';
import {getDefaultGranularity} from './utils';
import type {DatePickerValueProps} from './date-picker/use-date-picker-state';
import {DateRangeValue} from './date-range-picker/date-range-value';
import {useUserTimezone} from '@common/i18n/use-user-timezone';

export function useBaseDatePickerState(
  selectedDate: DateValue,
  props:
    | DatePickerValueProps<ZonedDateTime>
    | DatePickerValueProps<Partial<DateRangeValue>, DateRangeValue>
) {
  const timezone = useUserTimezone();
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const closeDialogOnSelection = props.closeDialogOnSelection ?? true;

  const granularity = props.granularity || getDefaultGranularity(selectedDate);
  const min = props.min ? toZoned(props.min, timezone) : undefined;
  const max = props.max ? toZoned(props.max, timezone) : undefined;

  return {
    timezone,
    granularity,
    min,
    max,
    calendarIsOpen,
    setCalendarIsOpen,
    closeDialogOnSelection,
  };
}
