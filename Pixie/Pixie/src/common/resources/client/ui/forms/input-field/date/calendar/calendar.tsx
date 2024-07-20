import React from 'react';
import {startOfMonth, toCalendarDate} from '@internationalized/date';
import {useIsMobileMediaQuery} from '../../../../../utils/hooks/is-mobile-media-query';
import {CalendarMonth} from './calendar-month';
import {DatePickerState} from '../date-picker/use-date-picker-state';
import {DateRangePickerState} from '../date-range-picker/use-date-range-picker-state';

interface CalendarProps {
  state: DatePickerState | DateRangePickerState;
  visibleMonths?: 1 | 2;
}
export function Calendar({state, visibleMonths = 1}: CalendarProps) {
  const isMobile = useIsMobileMediaQuery();

  if (isMobile) {
    visibleMonths = 1;
  }

  return (
    <>
      {[...new Array(visibleMonths).keys()].map(index => {
        const startDate = toCalendarDate(
          startOfMonth(state.calendarDates[index])
        );
        const isFirst = index === 0;
        const isLast = index === visibleMonths - 1;
        return (
          <CalendarMonth
            key={index}
            state={state}
            startDate={startDate}
            isFirst={isFirst}
            isLast={isLast}
          />
        );
      })}
    </>
  );
}
