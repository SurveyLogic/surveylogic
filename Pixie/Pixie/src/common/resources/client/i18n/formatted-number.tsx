import {Fragment, memo} from 'react';
import {useNumberFormatter} from './use-number-formatter';
import {NumberFormatOptions} from '@internationalized/number';
import {shallowEqual} from '../utils/shallow-equal';

interface FormattedNumberProps extends NumberFormatOptions {
  value: number;
}
export const FormattedNumber = memo(
  ({value, ...options}: FormattedNumberProps) => {
    const formatter = useNumberFormatter(options);

    if (isNaN(value)) {
      value = 0;
    }

    return <Fragment>{formatter.format(value)}</Fragment>;
  },
  shallowEqual
);
