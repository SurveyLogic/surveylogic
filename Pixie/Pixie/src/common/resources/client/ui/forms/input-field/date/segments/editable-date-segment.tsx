import {useFocusManager} from '@react-aria/focus';
import React, {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  KeyboardEventHandler,
  useMemo,
  useRef,
} from 'react';
import {NumberParser} from '@internationalized/number';
import {mergeProps} from '@react-aria/utils';
import {today, ZonedDateTime} from '@internationalized/date';
import {useSelectedLocale} from '../../../../../i18n/selected-locale';
import {useDateFormatter} from '../../../../../i18n/use-date-formatter';
import {DatePickerState} from '../date-picker/use-date-picker-state';
import {adjustSegment} from './utils/adjust-segment';
import {setSegment} from './utils/set-segment';
import {PAGE_STEP} from './utils/page-step';
import {DateRangePickerState} from '../date-range-picker/use-date-range-picker-state';
import {useIsMobileMediaQuery} from '../../../../../utils/hooks/is-mobile-media-query';

export interface EditableSegment {
  type: 'day' | 'dayPeriod' | 'hour' | 'minute' | 'month' | 'second' | 'year';
  text: string;
  value: number;
  minValue: number;
  maxValue: number;
  minLength: number;
}

interface DatePickerSegmentProps {
  segment: EditableSegment;
  domProps?: ComponentPropsWithoutRef<'div'>;
  state: DatePickerState | DateRangePickerState;
  value: ZonedDateTime;
  onChange: (newValue: ZonedDateTime) => void;
  isPlaceholder?: boolean;
}
export function EditableDateSegment({
  segment,
  domProps,
  value,
  onChange,
  isPlaceholder,
  state: {timezone, calendarIsOpen, setCalendarIsOpen},
}: DatePickerSegmentProps) {
  const isMobile = useIsMobileMediaQuery();
  const enteredKeys = useRef('');
  const {localeCode} = useSelectedLocale();
  const focusManager = useFocusManager();
  const formatter = useDateFormatter({timeZone: timezone});
  const parser = useMemo(
    () => new NumberParser(localeCode, {maximumFractionDigits: 0}),
    [localeCode]
  );

  const setSegmentValue = (newValue: number) => {
    onChange(
      setSegment(value, segment.type, newValue, formatter.resolvedOptions())
    );
  };

  const adjustSegmentValue = (amount: number) => {
    onChange(
      adjustSegment(value, segment.type, amount, formatter.resolvedOptions())
    );
  };

  const backspace = () => {
    if (parser.isValidPartialNumber(segment.text)) {
      const newValue = segment.text.slice(0, -1);
      const parsed = parser.parse(newValue);
      if (newValue.length === 0 || parsed === 0) {
        const now = today(timezone);
        if (segment.type in now) {
          // @ts-ignore
          setSegmentValue(now[segment.type]);
        }
      } else {
        setSegmentValue(parsed);
      }
      enteredKeys.current = newValue;
    } else if (segment.type === 'dayPeriod') {
      adjustSegmentValue(-1);
    }
  };

  const onKeyDown: KeyboardEventHandler = e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return;
    }

    // Navigation between date segments and deletion
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        e.stopPropagation();
        focusManager.focusPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        e.stopPropagation();
        focusManager.focusNext();
        break;
      case 'Enter':
        (e.target as HTMLElement).closest('form')?.requestSubmit();
        setCalendarIsOpen(!calendarIsOpen);
        break;
      case 'Tab':
        break;
      case 'Backspace':
      case 'Delete': {
        e.preventDefault();
        e.stopPropagation();
        backspace();
        break;
      }

      // Spinbutton incrementing/decrementing
      case 'ArrowUp':
        e.preventDefault();
        enteredKeys.current = '';
        adjustSegmentValue(1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        enteredKeys.current = '';
        adjustSegmentValue(-1);
        break;
      case 'PageUp':
        e.preventDefault();
        enteredKeys.current = '';
        adjustSegmentValue(PAGE_STEP[segment.type] || 1);
        break;
      case 'PageDown':
        e.preventDefault();
        enteredKeys.current = '';
        adjustSegmentValue(-(PAGE_STEP[segment.type] || 1));
        break;
      case 'Home':
        e.preventDefault();
        enteredKeys.current = '';
        setSegmentValue(segment.maxValue);
        break;
      case 'End':
        e.preventDefault();
        enteredKeys.current = '';
        setSegmentValue(segment.minValue);
        break;
    }

    onInput(e.key);
  };

  const amPmFormatter = useDateFormatter({hour: 'numeric', hour12: true});
  const am = useMemo(() => {
    const amDate = new Date();
    amDate.setHours(0);
    return amPmFormatter
      .formatToParts(amDate)
      .find(part => part.type === 'dayPeriod')!.value;
  }, [amPmFormatter]);
  const pm = useMemo(() => {
    const pmDate = new Date();
    pmDate.setHours(12);
    return amPmFormatter
      .formatToParts(pmDate)
      .find(part => part.type === 'dayPeriod')!.value;
  }, [amPmFormatter]);

  // Update date values on user keyboard input
  const onInput = (key: string) => {
    const newValue = enteredKeys.current + key;

    switch (segment.type) {
      case 'dayPeriod':
        if (am.toLowerCase().startsWith(key)) {
          setSegmentValue(0);
        } else if (pm.toLowerCase().startsWith(key)) {
          setSegmentValue(12);
        } else {
          break;
        }
        focusManager.focusNext();
        break;
      case 'day':
      case 'hour':
      case 'minute':
      case 'second':
      case 'month':
      case 'year': {
        if (!parser.isValidPartialNumber(newValue)) {
          return;
        }

        let numberValue = parser.parse(newValue);
        let segmentValue = numberValue;
        let allowsZero = segment.minValue === 0;
        if (segment.type === 'hour' && formatter.resolvedOptions().hour12) {
          switch (formatter.resolvedOptions().hourCycle) {
            case 'h11':
              if (numberValue > 11) {
                segmentValue = parser.parse(key);
              }
              break;
            case 'h12':
              allowsZero = false;
              if (numberValue > 12) {
                segmentValue = parser.parse(key);
              }
              break;
          }

          if (segment.value >= 12 && numberValue > 1) {
            numberValue += 12;
          }
        } else if (numberValue > segment.maxValue) {
          segmentValue = parser.parse(key);
        }

        if (Number.isNaN(numberValue)) {
          return;
        }

        const shouldSetValue = segmentValue !== 0 || allowsZero;
        if (shouldSetValue) {
          setSegmentValue(segmentValue);
        }

        if (
          Number(`${numberValue}0`) > segment.maxValue ||
          newValue.length >= String(segment.maxValue).length
        ) {
          enteredKeys.current = '';
          if (shouldSetValue) {
            focusManager.focusNext();
          }
        } else {
          enteredKeys.current = newValue;
        }
        break;
      }
    }
  };

  const spinButtonProps: HTMLAttributes<HTMLDivElement> = isMobile
    ? {}
    : {
        'aria-label': segment.type,
        'aria-valuetext': isPlaceholder ? undefined : `${segment.value}`,
        'aria-valuemin': segment.minValue,
        'aria-valuemax': segment.maxValue,
        'aria-valuenow': isPlaceholder ? undefined : segment.value,
        tabIndex: 0,
        onKeyDown,
      };

  return (
    <div
      {...mergeProps(domProps!, {
        ...spinButtonProps,
        onFocus: e => {
          enteredKeys.current = '';
          e.target.scrollIntoView({block: 'nearest'});
        },
        onClick: e => {
          e.preventDefault();
          e.stopPropagation();
        },
      } as HTMLAttributes<HTMLDivElement>)}
      className="p-2 outline-none caret-transparent cursor-default rounded focus:bg-primary focus:text-on-primary select-none whitespace-nowrap box-content tabular-nums text-center"
    >
      {segment.text.padStart(segment.minLength, '0')}
    </div>
  );
}
