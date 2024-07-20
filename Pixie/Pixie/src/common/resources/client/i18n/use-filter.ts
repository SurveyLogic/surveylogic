import {useCollator} from './use-collator';

interface Filter {
  /** Returns whether a string starts with a given substring. */
  startsWith(string: string, substring: string): boolean;
  /** Returns whether a string ends with a given substring. */
  endsWith(string: string, substring: string): boolean;
  /** Returns whether a string contains a given substring. */
  contains(string: string, substring: string): boolean;
}

export function useFilter(options?: Intl.CollatorOptions): Filter {
  const collator = useCollator({
    usage: 'search',
    ...options,
  });

  return {
    startsWith(string, substring) {
      if (substring.length === 0) {
        return true;
      }

      string = string.normalize('NFC');
      substring = substring.normalize('NFC');
      return (
        collator.compare(string.slice(0, substring.length), substring) === 0
      );
    },
    endsWith(string, substring) {
      if (substring.length === 0) {
        return true;
      }

      string = string.normalize('NFC');
      substring = substring.normalize('NFC');
      return collator.compare(string.slice(-substring.length), substring) === 0;
    },
    contains(string, substring) {
      if (substring.length === 0) {
        return true;
      }

      string = string.normalize('NFC');
      substring = substring.normalize('NFC');

      let scan = 0;
      const sliceLen = substring.length;
      for (; scan + sliceLen <= string.length; scan++) {
        const slice = string.slice(scan, scan + sliceLen);
        if (collator.compare(substring, slice) === 0) {
          return true;
        }
      }

      return false;
    },
  };
}
