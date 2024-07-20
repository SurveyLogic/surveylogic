import {PipAdapter} from '@common/player/state/pip/pip-adapter';
import {IS_CLIENT, IS_IPHONE} from '@common/utils/platform';

export const createSafariPipAdapter = (
  host: HTMLVideoElement,
  onChange: () => void
): PipAdapter => {
  return {
    isSupported: () => canUsePiPInSafari(),
    isPip: () => {
      return host.webkitPresentationMode === 'picture-in-picture';
    },
    enter: () => {
      if (canUsePiPInSafari()) {
        return host.webkitSetPresentationMode?.('picture-in-picture');
      }
    },
    exit: () => {
      if (canUsePiPInSafari()) {
        return host.webkitSetPresentationMode?.('inline');
      }
    },
    bindEvents: () => {
      if (canUsePiPInSafari()) {
        host.addEventListener('webkitpresentationmodechanged', onChange);
      }
    },
    unbindEvents: () => {
      if (canUsePiPInSafari()) {
        host.removeEventListener('webkitpresentationmodechanged', onChange);
      }
    },
  };
};

/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the desktop Safari browser, iOS Safari appears to "support" PiP through the check, however PiP
 * does not function.
 *
 * @see https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls
 */
let _canUsePiPInSafari: boolean | undefined;
const canUsePiPInSafari = (): boolean => {
  if (!IS_CLIENT) return false;
  const video = document.createElement('video');
  if (_canUsePiPInSafari == null) {
    _canUsePiPInSafari =
      // @ts-ignore
      !!video.webkitSupportsPresentationMode &&
      // @ts-ignore
      !!video.webkitSetPresentationMode &&
      !IS_IPHONE;
  }
  return _canUsePiPInSafari;
};
