import {useControlledState} from '@react-stately/utils';
import {HTMLAttributes, useCallback, useState} from 'react';
import {
  CalendarDate,
  DateValue,
  endOfMonth,
  isSameDay,
  isSameMonth,
  maxDate,
  minDate,
  startOfMonth,
  toCalendarDate,
  toZoned,
  ZonedDateTime,
} from '@internationalized/date';
import {
  BaseDatePickerState,
  DatePickerValueProps,
} from '../date-picker/use-date-picker-state';
import {DateRangeValue} from './date-range-value';
import {useBaseDatePickerState} from '../use-base-date-picker-state';
import {startOfDay} from '@common/utils/date/start-of-day';
import {endOfDay} from '@common/utils/date/end-of-day';
import {useCurrentDateTime} from '@common/i18n/use-current-date-time';

export interface IsPlaceholderValue {
  start: boolean;
  end: boolean;
}

export type DateRangePickerState = BaseDatePickerState<
  DateRangeValue,
  IsPlaceholderValue
>;

export function useDateRangePickerState(
  props: DatePickerValueProps<Partial<DateRangeValue>, DateRangeValue>
): DateRangePickerState {
  const now = useCurrentDateTime();
  const [isPlaceholder, setIsPlaceholder] = useState<IsPlaceholderValue>({
    start: (!props.value || !props.value.start) && !props.defaultValue?.start,
    end: (!props.value || !props.value.end) && !props.defaultValue?.end,
  });

  // if user clears the date, we will want to still keep an
  // instance internally, but return null via "onChange" callback
  const setStateValue = props.onChange;
  const [internalValue, setInternalValue] = useControlledState(
    props.value ? completeRange(props.value, now) : undefined,
    !props.value ? completeRange(props.defaultValue, now) : undefined,
    props.onChange
  );

  const {
    min,
    max,
    granularity,
    timezone,
    calendarIsOpen,
    setCalendarIsOpen,
    closeDialogOnSelection,
  } = useBaseDatePickerState(internalValue.start, props);

  const clear = useCallback(() => {
    setIsPlaceholder({start: true, end: true});
    setInternalValue(completeRange(null, now));
    setStateValue?.(null);
    setCalendarIsOpen(false);
  }, [now, setInternalValue, setStateValue, setCalendarIsOpen]);

  const [anchorDate, setAnchorDate] = useState<CalendarDate | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlightedRange, setHighlightedRange] =
    useState<DateRangeValue>(internalValue);
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>(() => {
    return rangeToCalendarDates(internalValue, max);
  });

  const constrainRange = useCallback(
    (range: DateRangeValue): DateRangeValue => {
      let start = range.start;
      let end = range.end;

      // make sure start date is after min date and before max date/range end
      if (min) {
        start = maxDate(start, min);
      }
      const startMax = max ? minDate(max, end) : end;
      start = minDate(start, startMax);

      // make sure end date is after min date/range start and before max date
      const endMin = min ? maxDate(min, start) : start;
      end = maxDate(end, endMin);

      if (max) {
        end = minDate(end, max);
      }

      return {start: toZoned(start, timezone), end: toZoned(end, timezone)};
    },
    [min, max, timezone]
  );

  const setSelectedValue = useCallback(
    (newRange: DateRangeValue) => {
      const value = {
        ...constrainRange(newRange),
        preset: newRange.preset,
      };
      setInternalValue(value);
      setHighlightedRange(value);
      setCalendarDates(rangeToCalendarDates(value, max));
      setIsPlaceholder({start: false, end: false});
    },
    [setInternalValue, constrainRange, max]
  );

  const dayIsActive = useCallback(
    (day: CalendarDate) => {
      return (
        (!isPlaceholder.start && isSameDay(day, highlightedRange.start)) ||
        (!isPlaceholder.end && isSameDay(day, highlightedRange.end))
      );
    },
    [highlightedRange, isPlaceholder]
  );

  const dayIsHighlighted = useCallback(
    (day: CalendarDate) => {
      return (
        (isHighlighting || (!isPlaceholder.start && !isPlaceholder.end)) &&
        day.compare(highlightedRange.start) >= 0 &&
        day.compare(highlightedRange.end) <= 0
      );
    },
    [highlightedRange, isPlaceholder, isHighlighting]
  );

  const dayIsRangeStart = useCallback(
    (day: CalendarDate) => isSameDay(day, highlightedRange.start),
    [highlightedRange]
  );

  const dayIsRangeEnd = useCallback(
    (day: CalendarDate) => isSameDay(day, highlightedRange.end),
    [highlightedRange]
  );

  const getCellProps = useCallback(
    (date: CalendarDate, isSameMonth: boolean): HTMLAttributes<HTMLElement> => {
      return {
        onPointerEnter: () => {
          if (isHighlighting && isSameMonth) {
            setHighlightedRange(
              makeRange({start: anchorDate!, end: date, timezone})
            );
          }
        },
        onClick: () => {
          if (!isHighlighting) {
            setIsHighlighting(true);
            setAnchorDate(date);
            setHighlightedRange(makeRange({start: date, end: date, timezone}));
          } else {
            const finalRange = makeRange({
              start: startOfDay(toZoned(anchorDate!, timezone)),
              end: endOfDay(toZoned(date, timezone)),
              timezone,
            });
            setIsHighlighting(false);
            setAnchorDate(null);
            setSelectedValue?.(finalRange);
            if (closeDialogOnSelection) {
              setCalendarIsOpen?.(false);
            }
          }
        },
      };
    },
    [
      anchorDate,
      isHighlighting,
      setSelectedValue,
      setCalendarIsOpen,
      closeDialogOnSelection,
      timezone,
    ]
  );

  return {
    selectedValue: internalValue,
    setSelectedValue,
    calendarIsOpen,
    setCalendarIsOpen,
    dayIsActive,
    dayIsHighlighted,
    dayIsRangeStart,
    dayIsRangeEnd,
    getCellProps,
    calendarDates,
    setIsPlaceholder,
    isPlaceholder,
    clear,
    setCalendarDates,
    min,
    max,
    granularity,
    timezone,
    closeDialogOnSelection,
  };
}

function rangeToCalendarDates(
  range: DateRangeValue,
  max?: DateValue
): CalendarDate[] {
  let start = toCalendarDate(startOfMonth(range.start));
  let end = toCalendarDate(endOfMonth(range.end));

  // make sure we don't show the same month twice
  if (isSameMonth(start, end)) {
    end = endOfMonth(end.add({months: 1}));
  }

  // if next month is disabled, show previous instead
  if (max && end.compare(max) > 0) {
    end = start;
    start = startOfMonth(start.subtract({months: 1}));
  }
  return [start, end];
}

interface MakeRangeProps {
  start: DateValue;
  end: DateValue;
  timezone: string;
}
function makeRange(props: MakeRangeProps): DateRangeValue {
  const start = toZoned(props.start, props.timezone);
  const end = toZoned(props.end, props.timezone);
  if (start.compare(end) > 0) {
    return {start: end, end: start};
  }
  return {start, end};
}

function completeRange(
  range: Partial<DateRangeValue> | null | undefined,
  now: ZonedDateTime
): DateRangeValue {
  if (range?.start && range?.end) {
    return range as DateRangeValue;
  } else if (!range?.start && range?.end) {
    range.start = range.end.subtract({months: 1});
    return range as DateRangeValue;
  } else if (!range?.end && range?.start) {
    range.end = range.start.add({months: 1});
    return range as DateRangeValue;
  }
  return {start: now, end: now.add({months: 1})};
}
