import {useSelectedLocale} from '@common/i18n/selected-locale';
import {Fragment, memo} from 'react';

interface Props {
  code: string;
}
export const FormattedCountryName = memo(({code: countryCode}: Props) => {
  const {localeCode} = useSelectedLocale();
  const regionNames = new Intl.DisplayNames([localeCode], {type: 'region'});
  let formattedName: string | undefined;

  try {
    formattedName = regionNames.of(countryCode.toUpperCase());
  } catch (e) {}

  return <Fragment>{formattedName}</Fragment>;
});
