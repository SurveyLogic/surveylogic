import {ZonedDateTime} from '@internationalized/date';

export type DateRangeValue = {
  start: ZonedDateTime;
  end: ZonedDateTime;
  preset?: number;
};
