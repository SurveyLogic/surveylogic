import {useControlledState} from '@react-stately/utils';
import {HTMLAttributes, useCallback, useState} from 'react';
import {
  CalendarDate,
  DateValue,
  isSameDay,
  toCalendarDate,
  toZoned,
  ZonedDateTime,
} from '@internationalized/date';
import {useBaseDatePickerState} from '../use-base-date-picker-state';
import {useCurrentDateTime} from '@common/i18n/use-current-date-time';

export type Granularity = 'day' | 'minute';

export type DatePickerState = BaseDatePickerState;

export interface BaseDatePickerState<T = ZonedDateTime, P = boolean> {
  timezone: string;
  granularity: Granularity;
  selectedValue: T;
  setSelectedValue: (value: T) => void;
  calendarIsOpen: boolean;
  setCalendarIsOpen: (isOpen: boolean) => void;
  calendarDates: CalendarDate[];
  setCalendarDates: (dates: CalendarDate[]) => void;
  dayIsActive: (day: CalendarDate) => boolean;
  dayIsHighlighted: (day: CalendarDate) => boolean;
  dayIsRangeStart: (day: CalendarDate) => boolean;
  dayIsRangeEnd: (day: CalendarDate) => boolean;
  isPlaceholder: P;
  setIsPlaceholder: (value: P) => void;
  clear: () => void;
  min?: ZonedDateTime;
  max?: ZonedDateTime;
  closeDialogOnSelection: boolean;
  getCellProps: (
    date: CalendarDate,
    isSameMonth: boolean
  ) => HTMLAttributes<HTMLElement>;
}

export interface DatePickerValueProps<V, CV = V> {
  value?: V | null | '';
  defaultValue?: V | null;
  onChange?: (value: CV | null) => void;
  min?: DateValue;
  max?: DateValue;
  granularity?: Granularity;
  closeDialogOnSelection?: boolean;
}
export function useDatePickerState(
  props: DatePickerValueProps<ZonedDateTime>
): BaseDatePickerState {
  const now = useCurrentDateTime();
  const [isPlaceholder, setIsPlaceholder] = useState(
    !props.value && !props.defaultValue
  );

  // if user clears the date, we will want to still keep an
  // instance internally, but return null via "onChange" callback
  const setStateValue = props.onChange;
  const [internalValue, setInternalValue] = useControlledState(
    props.value || now,
    props.defaultValue || now,
    setStateValue
  );

  const {
    min,
    max,
    granularity,
    timezone,
    calendarIsOpen,
    setCalendarIsOpen,
    closeDialogOnSelection,
  } = useBaseDatePickerState(internalValue, props);

  const clear = useCallback(() => {
    setIsPlaceholder(true);
    setInternalValue(now);
    setStateValue?.(null);
    setCalendarIsOpen(false);
  }, [now, setInternalValue, setStateValue, setCalendarIsOpen]);

  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>(() => {
    return [toCalendarDate(internalValue)];
  });

  const setSelectedValue = useCallback(
    (newValue: DateValue) => {
      if (min && newValue.compare(min) < 0) {
        newValue = min;
      } else if (max && newValue.compare(max) > 0) {
        newValue = max;
      }

      // preserve time
      const value = internalValue
        ? internalValue.set(newValue)
        : toZoned(newValue, timezone);
      setInternalValue(value);
      setCalendarDates([toCalendarDate(value)]);
      setIsPlaceholder(false);
    },
    [setInternalValue, min, max, internalValue, timezone]
  );

  const dayIsActive = useCallback(
    (day: DateValue) => !isPlaceholder && isSameDay(internalValue, day),
    [internalValue, isPlaceholder]
  );

  const getCellProps = useCallback(
    (date: DateValue): HTMLAttributes<HTMLElement> => {
      return {
        onClick: () => {
          setSelectedValue?.(date);
          if (closeDialogOnSelection) {
            setCalendarIsOpen?.(false);
          }
        },
      };
    },
    [setSelectedValue, setCalendarIsOpen, closeDialogOnSelection]
  );

  return {
    selectedValue: internalValue,
    setSelectedValue: setInternalValue,
    calendarIsOpen,
    setCalendarIsOpen,
    dayIsActive,
    dayIsHighlighted: () => false,
    dayIsRangeStart: () => false,
    dayIsRangeEnd: () => false,
    getCellProps,
    calendarDates,
    setCalendarDates,
    isPlaceholder,
    clear,
    setIsPlaceholder,
    min,
    max,
    granularity,
    timezone,
    closeDialogOnSelection,
  };
}
