import {useMediaQuery} from './use-media-query';

export function useIsTouchDevice() {
  return useMediaQuery('((pointer: coarse))');
}
