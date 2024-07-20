import React, {ComponentPropsWithoutRef, useMemo} from 'react';
import {ZonedDateTime} from '@internationalized/date';
import {EditableDateSegment, EditableSegment} from './editable-date-segment';
import {LiteralDateSegment, LiteralSegment} from './literal-segment';
import {useDateFormatter} from '@common/i18n/use-date-formatter';
import {DatePickerState} from '../date-picker/use-date-picker-state';
import {getSegmentLimits} from './utils/get-segment-limits';
import {DateRangePickerState} from '../date-range-picker/use-date-range-picker-state';

interface DateSegmentListProps {
  segmentProps?: ComponentPropsWithoutRef<'div'>;
  state: DatePickerState | DateRangePickerState;
  value: ZonedDateTime;
  onChange: (newValue: ZonedDateTime) => void;
  isPlaceholder?: boolean;
}
export function DateSegmentList({
  segmentProps,
  state,
  value,
  onChange,
  isPlaceholder,
}: DateSegmentListProps) {
  const {granularity} = state;
  const options = useMemo(() => {
    const memoOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    if (granularity === 'minute') {
      memoOptions.hour = 'numeric';
      memoOptions.minute = 'numeric';
    }
    return memoOptions;
  }, [granularity]);

  const formatter = useDateFormatter(options);

  const dateValue = useMemo(() => value.toDate(), [value]);
  const segments = useMemo(() => {
    return formatter.formatToParts(dateValue).map(segment => {
      const limits = getSegmentLimits(
        value,
        segment.type,
        formatter.resolvedOptions()
      );
      const textValue =
        isPlaceholder && segment.type !== 'literal'
          ? limits.placeholder
          : segment.value;
      return {
        type: segment.type,
        text: segment.value === ', ' ? ' ' : textValue,
        ...limits,
        minLength:
          segment.type !== 'literal' ? String(limits.maxValue).length : 1,
      } as LiteralSegment | EditableSegment;
    });
  }, [dateValue, formatter, isPlaceholder, value]);

  return (
    <div className="flex items-center">
      {segments.map((segment, index) => {
        if (segment.type === 'literal') {
          return (
            <LiteralDateSegment
              domProps={segmentProps}
              key={index}
              segment={segment}
            />
          );
        }
        return (
          <EditableDateSegment
            isPlaceholder={isPlaceholder}
            domProps={segmentProps}
            state={state}
            value={value}
            onChange={onChange}
            segment={segment}
            key={index}
          />
        );
      })}
    </div>
  );
}
