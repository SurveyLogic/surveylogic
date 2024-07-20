import {CalendarDate, DateValue} from '@internationalized/date';

export function getDefaultGranularity(date: DateValue) {
  if (date instanceof CalendarDate) {
    return 'day';
  }
  return 'minute';
}

export function dateIsInvalid(
  date: CalendarDate,
  min?: DateValue,
  max?: DateValue
) {
  return (
    (min != null && date.compare(min) < 0) ||
    (max != null && date.compare(max) > 0)
  );
}
