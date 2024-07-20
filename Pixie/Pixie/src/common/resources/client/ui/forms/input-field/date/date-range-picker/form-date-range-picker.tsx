import {parseAbsoluteToLocal, ZonedDateTime} from '@internationalized/date';
import {DateRangeValue} from './date-range-value';
import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import React from 'react';
import {DateRangePicker, DateRangePickerProps} from './date-range-picker';

export interface AbsoluteDateRange {
  start?: string;
  end?: string;
  preset?: number;
}

interface FormDateRange {
  start?: string | ZonedDateTime;
  end?: string | ZonedDateTime;
  preset?: number;
}

interface FormDateRangePickerProps extends DateRangePickerProps {
  name: string;
}
export function FormDateRangePicker(props: FormDateRangePickerProps) {
  const {
    field: {onChange, onBlur, value, ref},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<DateRangePickerProps> = {
    onChange: e => {
      onChange(e ? dateRangeToAbsoluteRange(e) : null);
    },
    onBlur,
    value: absoluteRangeToDateRange(value),
    invalid,
    errorMessage: error?.message,
    inputRef: ref,
  };

  return <DateRangePicker {...mergeProps(formProps, props)} />;
}

export function absoluteRangeToDateRange(props: FormDateRange | null) {
  const {start, end, preset} = props || {};
  const dateRange: Partial<DateRangeValue> = {preset};
  if (start) {
    dateRange.start =
      typeof start === 'string' ? parseAbsoluteToLocal(start) : start;
  }
  if (end) {
    dateRange.end = typeof end === 'string' ? parseAbsoluteToLocal(end) : end;
  }
  return dateRange;
}

export function dateRangeToAbsoluteRange({
  start,
  end,
  preset,
}: Partial<DateRangeValue> = {}) {
  const absoluteRange: AbsoluteDateRange = {
    preset,
  };
  if (start) {
    absoluteRange.start = start.toAbsoluteString();
  }
  if (end) {
    absoluteRange.end = end.toAbsoluteString();
  }
  return absoluteRange;
}
