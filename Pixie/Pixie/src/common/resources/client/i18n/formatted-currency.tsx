import {Fragment, memo} from 'react';
import {useNumberFormatter} from './use-number-formatter';

interface FormattedCurrencyProps {
  value: number;
  currency: string;
}
export const FormattedCurrency = memo(
  ({value, currency}: FormattedCurrencyProps) => {
    const formatter = useNumberFormatter({
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    });

    if (isNaN(value)) {
      value = 0;
    }

    return <Fragment>{formatter.format(value)}</Fragment>;
  }
);
