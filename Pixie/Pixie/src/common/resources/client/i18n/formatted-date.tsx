import {DateValue, parseAbsoluteToLocal} from '@internationalized/date';
import {Fragment, memo} from 'react';
import {useDateFormatter} from './use-date-formatter';
import {shallowEqual} from '../utils/shallow-equal';
import {useSettings} from '../core/settings/use-settings';
import {useUserTimezone} from './use-user-timezone';

export const DateFormatPresets: Record<
  'numeric' | 'short' | 'long',
  Intl.DateTimeFormatOptions
> = {
  numeric: {year: 'numeric', month: '2-digit', day: '2-digit'},
  short: {year: 'numeric', month: 'short', day: '2-digit'},
  long: {month: 'long', day: '2-digit', year: 'numeric'},
};

interface FormattedDateProps {
  date?: string | DateValue | Date;
  options?: Intl.DateTimeFormatOptions;
  preset?: keyof typeof DateFormatPresets;
}
export const FormattedDate = memo(
  ({date, options, preset}: FormattedDateProps) => {
    const {dates} = useSettings();
    const timezone = useUserTimezone();
    const formatter = useDateFormatter(
      options ||
        (DateFormatPresets as Record<string, Intl.DateTimeFormatOptions>)[
          preset || dates?.format
        ]
    );

    if (!date) {
      return null;
    }

    // make sure date with invalid format does not blow up the app
    try {
      if (typeof date === 'string') {
        date = parseAbsoluteToLocal(date).toDate();
      } else if ('toDate' in date) {
        date = date.toDate(timezone);
      }
    } catch (e) {
      return null;
    }

    return <Fragment>{formatter.format(date as Date)}</Fragment>;
  },
  shallowEqual
);
