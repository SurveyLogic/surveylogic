import {ZonedDateTime} from '@internationalized/date';

export function endOfDay(date: ZonedDateTime): ZonedDateTime {
  return date.set({
    hour: 24 - 1,
    minute: 60 - 1,
    second: 60 - 1,
    millisecond: 1000 - 1,
  });
}
