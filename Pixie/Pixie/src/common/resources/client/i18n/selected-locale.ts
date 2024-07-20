import {useBootstrapData} from '../core/bootstrap-data/bootstrap-data-context';

export function useSelectedLocale() {
  const {
    data: {i18n},
  } = useBootstrapData();
  return {
    locale: i18n,
    localeCode: i18n?.language || 'en',
    lines: i18n?.lines,
  };
}
