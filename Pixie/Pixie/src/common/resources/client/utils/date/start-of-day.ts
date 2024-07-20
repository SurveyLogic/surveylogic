import {ZonedDateTime} from '@internationalized/date';

export function startOfDay(date: ZonedDateTime): ZonedDateTime {
  return date.set({hour: 0, minute: 0, second: 0, millisecond: 0});
}
