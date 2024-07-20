import {ZonedDateTime} from '@internationalized/date';

export function adjustSegment(
  value: ZonedDateTime,
  part: string,
  amount: number,
  options: Intl.ResolvedDateTimeFormatOptions
) {
  switch (part) {
    case 'era':
    case 'year':
    case 'month':
    case 'day':
      return value.cycle(part, amount, {round: part === 'year'});
  }

  if ('hour' in value) {
    switch (part) {
      case 'dayPeriod': {
        const hours = value.hour;
        const isPM = hours >= 12;
        return value.set({hour: isPM ? hours - 12 : hours + 12});
      }
      case 'hour':
      case 'minute':
      case 'second':
        return value.cycle(part, amount, {
          round: part !== 'hour',
          hourCycle: options.hour12 ? 12 : 24,
        });
    }
  }

  return value;
}
