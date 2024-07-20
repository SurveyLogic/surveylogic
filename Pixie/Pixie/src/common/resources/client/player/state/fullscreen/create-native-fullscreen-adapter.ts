import {FullscreenAdapter} from '@common/player/state/fullscreen/fullscreen-adapter';
import fscreen from 'fscreen';

export function createNativeFullscreenAdapter(
  host: HTMLElement,
  onChange: () => void
): FullscreenAdapter {
  host = host.closest('.fullscreen-host') ?? host;
  return {
    isFullscreen: () => {
      if (fscreen.fullscreenElement === host) return true;
      try {
        // Throws in iOS Safari...
        return host.matches(
          // @ts-expect-error - `fullscreenPseudoClass` is missing from `@types/fscreen`.
          fscreen.fullscreenPseudoClass
        );
      } catch (error) {
        return false;
      }
    },
    canFullScreen: () => {
      return fscreen.fullscreenEnabled;
    },
    enter: () => {
      return fscreen.requestFullscreen(host);
    },
    exit: () => {
      return fscreen.exitFullscreen();
    },
    bindEvents: () => {
      fscreen.addEventListener('fullscreenchange', onChange);
      fscreen.addEventListener('fullscreenerror', onChange);
    },
    unbindEvents: () => {
      fscreen.removeEventListener('fullscreenchange', onChange);
      fscreen.removeEventListener('fullscreenerror', onChange);
    },
  };
}
