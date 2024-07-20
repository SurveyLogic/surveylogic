import React from 'react';
import clsx from 'clsx';
import {
  CalendarDate,
  DateValue,
  getDayOfWeek,
  isSameMonth,
  isToday,
} from '@internationalized/date';
import {useSelectedLocale} from '../../../../../i18n/selected-locale';
import {DatePickerState} from '../date-picker/use-date-picker-state';
import {dateIsInvalid} from '../utils';
import {DateRangePickerState} from '../date-range-picker/use-date-range-picker-state';

interface CalendarCellProps {
  date: CalendarDate;
  currentMonth: DateValue;
  state: DatePickerState | DateRangePickerState;
}
export function CalendarCell({
  date,
  currentMonth,
  state: {
    dayIsActive,
    dayIsHighlighted,
    dayIsRangeStart,
    dayIsRangeEnd,
    getCellProps,
    timezone,
    min,
    max,
  },
}: CalendarCellProps) {
  const {localeCode} = useSelectedLocale();
  const dayOfWeek = getDayOfWeek(date, localeCode);
  const isActive = dayIsActive(date);
  const isHighlighted = dayIsHighlighted(date);
  const isRangeStart = dayIsRangeStart(date);
  const isRangeEnd = dayIsRangeEnd(date);
  const dayIsToday = isToday(date, timezone);
  const sameMonth = isSameMonth(date, currentMonth);
  const isDisabled = dateIsInvalid(date, min, max);

  return (
    <div
      role="button"
      aria-disabled={isDisabled}
      className={clsx(
        'w-40 h-40 text-sm relative isolate flex-shrink-0',
        isDisabled && 'text-disabled pointer-events-none',
        !sameMonth && 'invisible pointer-events-none'
      )}
      {...getCellProps(date, sameMonth)}
    >
      <span
        className={clsx(
          'absolute inset-0 flex items-center justify-center rounded-full w-full h-full select-none z-10 cursor-pointer',
          !isActive && !dayIsToday && 'hover:bg-hover',
          isActive && 'bg-primary text-on-primary font-semibold',
          dayIsToday && !isActive && 'bg-chip'
        )}
      >
        {date.day}
      </span>
      {isHighlighted && sameMonth && (
        <span
          className={clsx(
            'absolute w-full h-full inset-0 bg-primary/focus',
            (isRangeStart || dayOfWeek === 0 || date.day === 1) &&
              'rounded-l-full',
            (isRangeEnd ||
              dayOfWeek === 6 ||
              date.day ===
                currentMonth.calendar.getDaysInMonth(currentMonth)) &&
              'rounded-r-full'
          )}
        />
      )}
    </div>
  );
}
