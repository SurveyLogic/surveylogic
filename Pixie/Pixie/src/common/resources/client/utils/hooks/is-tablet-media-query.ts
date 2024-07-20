import {useMediaQuery, UseMediaQueryOptions} from './use-media-query';

export function useIsTabletMediaQuery(options?: UseMediaQueryOptions) {
  return useMediaQuery('(max-width: 1024px)', options);
}
