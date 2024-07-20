import React, {useRef} from 'react';
import {AnimatePresence, m} from 'framer-motion';
import {DatePickerField} from '../date-picker-field';
import {DateRangePickerState} from '../use-date-range-picker-state';
import {Calendar} from '../../calendar/calendar';
import {DialogFooter} from '../../../../../overlays/dialog/dialog-footer';
import {Button} from '../../../../../buttons/button';
import {useDialogContext} from '../../../../../overlays/dialog/dialog-context';
import {Dialog} from '../../../../../overlays/dialog/dialog';
import {DialogBody} from '../../../../../overlays/dialog/dialog-body';
import {ArrowRightAltIcon} from '../../../../../../icons/material/ArrowRightAlt';
import {DateSegmentList} from '../../segments/date-segment-list';
import {Trans} from '../../../../../../i18n/trans';
import {FormattedDateTimeRange} from '../../../../../../i18n/formatted-date-time-range';
import {DatePresetList} from './date-preset-list';
import {useIsTabletMediaQuery} from '@common/utils/hooks/is-tablet-media-query';

interface DateRangeDialogProps {
  state: DateRangePickerState;
  showInlineDatePickerField?: boolean;
}
export function DateRangeDialog({
  state,
  showInlineDatePickerField = false,
}: DateRangeDialogProps) {
  const isTablet = useIsTabletMediaQuery();
  const {close} = useDialogContext();
  const initialStateRef = useRef<DateRangePickerState>(state);

  const hasPlaceholder = state.isPlaceholder.start || state.isPlaceholder.end;

  const footer = (
    <DialogFooter
      dividerTop
      startAction={
        !hasPlaceholder && !isTablet ? (
          <div className="text-xs">
            <FormattedDateTimeRange
              start={state.selectedValue.start.toDate()}
              end={state.selectedValue.end.toDate()}
              options={{dateStyle: 'medium'}}
            />
          </div>
        ) : undefined
      }
    >
      <Button
        variant="text"
        size="xs"
        onClick={() => {
          state.setSelectedValue(initialStateRef.current.selectedValue);
          state.setIsPlaceholder(initialStateRef.current.isPlaceholder);
          close();
        }}
      >
        <Trans message="Cancel" />
      </Button>
      <Button
        variant="flat"
        color="primary"
        size="xs"
        onClick={() => {
          close(state.selectedValue);
        }}
      >
        <Trans message="Select" />
      </Button>
    </DialogFooter>
  );

  return (
    <Dialog size="auto">
      <DialogBody className="flex" padding="p-0">
        {!isTablet && (
          <DatePresetList
            selectedValue={state.selectedValue}
            onPresetSelected={preset => {
              state.setSelectedValue(preset);
              if (state.closeDialogOnSelection) {
                close(preset);
              }
            }}
          />
        )}
        <AnimatePresence initial={false}>
          <Calendars
            state={state}
            showInlineDatePickerField={showInlineDatePickerField}
          />
        </AnimatePresence>
      </DialogBody>
      {!state.closeDialogOnSelection && footer}
    </Dialog>
  );
}

interface CustomRangePanelProps {
  state: DateRangePickerState;
  showInlineDatePickerField?: boolean;
}
function Calendars({state, showInlineDatePickerField}: CustomRangePanelProps) {
  return (
    <m.div
      initial={{width: 0, overflow: 'hidden'}}
      animate={{width: 'auto'}}
      exit={{width: 0, overflow: 'hidden'}}
      transition={{type: 'tween', duration: 0.125}}
      className="border-l px-20 pt-10 pb-20"
    >
      {showInlineDatePickerField && <InlineDatePickerField state={state} />}
      <div className="flex items-start gap-36">
        <Calendar state={state} visibleMonths={2} />
      </div>
    </m.div>
  );
}

interface InlineDatePickerFieldProps {
  state: DateRangePickerState;
}
function InlineDatePickerField({state}: InlineDatePickerFieldProps) {
  const {selectedValue, setSelectedValue} = state;
  return (
    <DatePickerField className="mb-20 mt-10">
      <DateSegmentList
        state={state}
        value={selectedValue.start}
        onChange={newValue => {
          setSelectedValue({...selectedValue, start: newValue});
        }}
      />
      <ArrowRightAltIcon className="block flex-shrink-0 text-muted" size="md" />
      <DateSegmentList
        state={state}
        value={selectedValue.end}
        onChange={newValue => {
          setSelectedValue({...selectedValue, end: newValue});
        }}
      />
    </DatePickerField>
  );
}
