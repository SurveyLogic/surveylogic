import {useSelectedLocale} from './selected-locale';

const cache = new Map<string, Intl.Collator>();

export function useCollator(options?: Intl.CollatorOptions): Intl.Collator {
  const {localeCode} = useSelectedLocale();

  const cacheKey =
    localeCode +
    (options
      ? Object.entries(options)
          .sort((a, b) => (a[0] < b[0] ? -1 : 1))
          .join()
      : '');

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const formatter = new Intl.Collator(localeCode, options);
  cache.set(cacheKey, formatter);
  return formatter;
}
