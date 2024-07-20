import {
  DateValue,
  getMinimumDayInMonth,
  getMinimumMonthInYear,
} from '@internationalized/date';

export function getSegmentLimits(
  date: DateValue,
  type: string,
  options: Intl.ResolvedDateTimeFormatOptions
) {
  switch (type) {
    case 'year':
      return {
        value: date.year,
        placeholder: 'yyyy',
        minValue: 1,
        maxValue: date.calendar.getYearsInEra(date),
      };
    case 'month':
      return {
        value: date.month,
        placeholder: 'mm',
        minValue: getMinimumMonthInYear(date),
        maxValue: date.calendar.getMonthsInYear(date),
      };
    case 'day':
      return {
        value: date.day,
        minValue: getMinimumDayInMonth(date),
        maxValue: date.calendar.getDaysInMonth(date),
        placeholder: 'dd',
      };
  }

  if ('hour' in date) {
    switch (type) {
      case 'dayPeriod':
        return {
          value: date.hour >= 12 ? 12 : 0,
          minValue: 0,
          maxValue: 12,
          placeholder: '--',
        };
      case 'hour':
        if (options.hour12) {
          const isPM = date.hour >= 12;
          return {
            value: date.hour,
            minValue: isPM ? 12 : 0,
            maxValue: isPM ? 23 : 11,
            placeholder: '--',
          };
        }

        return {
          value: date.hour,
          minValue: 0,
          maxValue: 23,
          placeholder: '--',
        };
      case 'minute':
        return {
          value: date.minute,
          minValue: 0,
          maxValue: 59,
          placeholder: '--',
        };
    }
  }

  return {};
}
