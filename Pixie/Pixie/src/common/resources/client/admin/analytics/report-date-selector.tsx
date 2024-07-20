import {useDateRangePickerState} from '@common/ui/forms/input-field/date/date-range-picker/use-date-range-picker-state';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {Button} from '@common/ui/buttons/button';
import {DateRangeIcon} from '@common/icons/material/DateRange';
import {FormattedDateTimeRange} from '@common/i18n/formatted-date-time-range';
import {DateRangeDialog} from '@common/ui/forms/input-field/date/date-range-picker/dialog/date-range-dialog';
import React from 'react';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {DateFormatPresets} from '@common/i18n/formatted-date';

const monthDayFormat: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: '2-digit',
};

interface ReportDataSelectorProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  compactOnMobile?: boolean;
}
export function ReportDateSelector({
  value,
  onChange,
  compactOnMobile = true,
}: ReportDataSelectorProps) {
  const isMobile = useIsMobileMediaQuery();
  return (
    <DialogTrigger
      type="popover"
      onClose={value => {
        if (value) {
          onChange(value);
        }
      }}
    >
      <Button variant="outline" color="chip" endIcon={<DateRangeIcon />}>
        <FormattedDateTimeRange
          start={value.start}
          end={value.end}
          options={
            isMobile && compactOnMobile
              ? monthDayFormat
              : DateFormatPresets.short
          }
        />
      </Button>
      <DateSelectorDialog value={value} />
    </DialogTrigger>
  );
}

interface DateSelectorDialogProps {
  value: DateRangeValue;
}
function DateSelectorDialog({value}: DateSelectorDialogProps) {
  const isMobile = useIsMobileMediaQuery();
  const state = useDateRangePickerState({
    defaultValue: value,
    closeDialogOnSelection: false,
  });
  return (
    <DateRangeDialog state={state} showInlineDatePickerField={!isMobile} />
  );
}
