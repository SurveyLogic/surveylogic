import {ZonedDateTime} from '@internationalized/date';

export function setSegment(
  value: ZonedDateTime,
  part: string,
  segmentValue: number,
  options: Intl.ResolvedDateTimeFormatOptions
) {
  switch (part) {
    case 'day':
    case 'month':
    case 'year':
      return value.set({[part]: segmentValue});
  }

  if ('hour' in value) {
    switch (part) {
      case 'dayPeriod': {
        const hours = value.hour;
        const wasPM = hours >= 12;
        const isPM = segmentValue >= 12;
        if (isPM === wasPM) {
          return value;
        }
        return value.set({hour: wasPM ? hours - 12 : hours + 12});
      }
      case 'hour':
        // In 12 hour time, ensure that AM/PM does not change
        if (options.hour12) {
          const hours = value.hour;
          const wasPM = hours >= 12;
          if (!wasPM && segmentValue === 12) {
            segmentValue = 0;
          }
          if (wasPM && segmentValue < 12) {
            segmentValue += 12;
          }
        }
      // fallthrough
      case 'minute':
      case 'second':
        return value.set({[part]: segmentValue});
    }
  }

  return value;
}
