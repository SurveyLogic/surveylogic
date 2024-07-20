import {NumberFormatOptions, NumberFormatter} from '@internationalized/number';
import {useMemo} from 'react';
import {useSelectedLocale} from './selected-locale';

export function useNumberFormatter(
  options: NumberFormatOptions = {}
): Intl.NumberFormat {
  const {localeCode} = useSelectedLocale();
  return useMemo(
    () => new NumberFormatter(localeCode, options),
    [localeCode, options]
  );
}
