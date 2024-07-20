import {useIsSSR} from '@react-aria/ssr';

const MOBILE_SCREEN_WIDTH = 768;

export function useIsMobileDevice(): boolean {
  const isSSR = useIsSSR();
  if (isSSR || typeof window === 'undefined') {
    return false;
  }

  return window.screen.width <= MOBILE_SCREEN_WIDTH;
}
