import React, {
  ComponentPropsWithoutRef,
  Fragment,
  MouseEvent,
  useRef,
} from 'react';
import {DateRangeIcon} from '../../../../../icons/material/DateRange';
import {DialogTrigger} from '../../../../overlays/dialog/dialog-trigger';
import {DatePickerField, DatePickerFieldProps} from './date-picker-field';
import {useDateRangePickerState} from './use-date-range-picker-state';
import {ArrowRightAltIcon} from '../../../../../icons/material/ArrowRightAlt';
import {DatePickerValueProps} from '../date-picker/use-date-picker-state';
import {DateRangeValue} from './date-range-value';
import {DateSegmentList} from '../segments/date-segment-list';
import {DateRangeDialog} from './dialog/date-range-dialog';
import {useIsMobileMediaQuery} from '../../../../../utils/hooks/is-mobile-media-query';

export interface DateRangePickerProps
  extends DatePickerValueProps<Partial<DateRangeValue>>,
    Omit<DatePickerFieldProps, 'children'> {}
export function DateRangePicker(props: DateRangePickerProps) {
  const {granularity, closeDialogOnSelection, ...fieldProps} = props;
  const state = useDateRangePickerState(props);
  const inputRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileMediaQuery();
  const hideCalendarIcon = isMobile && granularity !== 'day';

  const dialog = (
    <DialogTrigger
      offset={8}
      placement="bottom-start"
      isOpen={state.calendarIsOpen}
      onOpenChange={state.setCalendarIsOpen}
      type="popover"
      triggerRef={inputRef}
      returnFocusToTrigger={false}
      moveFocusToDialog={false}
    >
      <DateRangeDialog state={state} />
    </DialogTrigger>
  );

  const openOnClick: ComponentPropsWithoutRef<'div'> = {
    onClick: e => {
      e.stopPropagation();
      e.preventDefault();
      if (!isHourSegment(e)) {
        state.setCalendarIsOpen(true);
      } else {
        state.setCalendarIsOpen(false);
      }
    },
  };

  const value = state.selectedValue;
  const onChange = state.setSelectedValue;

  return (
    <Fragment>
      <DatePickerField
        ref={inputRef}
        wrapperProps={openOnClick}
        endAdornment={!hideCalendarIcon ? <DateRangeIcon /> : undefined}
        {...fieldProps}
      >
        <DateSegmentList
          isPlaceholder={state.isPlaceholder?.start}
          state={state}
          segmentProps={openOnClick}
          value={value.start}
          onChange={newValue => {
            onChange({...value, start: newValue});
          }}
        />
        <ArrowRightAltIcon
          className="block flex-shrink-0 text-muted"
          size="md"
        />
        <DateSegmentList
          isPlaceholder={state.isPlaceholder?.end}
          state={state}
          segmentProps={openOnClick}
          value={value.end}
          onChange={newValue => {
            onChange({...value, end: newValue});
          }}
        />
      </DatePickerField>
      {dialog}
    </Fragment>
  );
}

function isHourSegment(e: MouseEvent<HTMLDivElement>): boolean {
  return ['hour', 'minute', 'dayPeriod'].includes(
    (e.currentTarget as HTMLElement).ariaLabel || ''
  );
}
