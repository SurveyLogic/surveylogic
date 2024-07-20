import {DateValue, parseAbsoluteToLocal} from '@internationalized/date';
import {Fragment, memo, useMemo} from 'react';
import {shallowEqual} from '@common/utils/shallow-equal';
import {useSelectedLocale} from '@common/i18n/selected-locale';
import {useUserTimezone} from '@common/i18n/use-user-timezone';
import {Trans} from '@common/i18n/trans';

const DIVISIONS: {amount: number; name: Intl.RelativeTimeFormatUnit}[] = [
  {amount: 60, name: 'seconds'},
  {amount: 60, name: 'minutes'},
  {amount: 24, name: 'hours'},
  {amount: 7, name: 'days'},
  {amount: 4.34524, name: 'weeks'},
  {amount: 12, name: 'months'},
  {amount: Number.POSITIVE_INFINITY, name: 'years'},
];

interface FormattedDateProps {
  date?: string | DateValue | Date;
  style?: Intl.RelativeTimeFormatStyle;
}
export const FormattedRelativeTime = memo(
  ({date, style}: FormattedDateProps) => {
    const {localeCode} = useSelectedLocale();
    const timezone = useUserTimezone();

    const formatter = useMemo(
      () =>
        new Intl.RelativeTimeFormat(localeCode, {
          numeric: 'auto',
          style,
        }),
      [localeCode, style]
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

    let duration = (date.getTime() - Date.now()) / 1000;

    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
        if (division.name === 'seconds') {
          return <Trans message="a few seconds ago" />;
        }
        return (
          <Fragment>
            {formatter.format(Math.round(duration), division.name)}
          </Fragment>
        );
      }
      duration /= division.amount;
    }

    return <Fragment>{formatter.format(Math.round(duration), 'day')}</Fragment>;
  },
  shallowEqual
);
