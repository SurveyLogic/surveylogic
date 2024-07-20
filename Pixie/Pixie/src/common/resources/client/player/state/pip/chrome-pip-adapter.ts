import {PipAdapter} from '@common/player/state/pip/pip-adapter';
import {IS_CLIENT} from '@common/utils/platform';

export const createChromePipAdapter = (
  host: HTMLVideoElement,
  onChange: () => void
): PipAdapter => {
  return {
    isSupported: () => canUsePiPInChrome(),
    isPip: () => {
      return host === document.pictureInPictureElement;
    },
    enter: () => {
      if (canUsePiPInChrome()) {
        return host.requestPictureInPicture();
      }
    },
    exit: () => {
      if (canUsePiPInChrome()) {
        return document.exitPictureInPicture();
      }
    },
    bindEvents: () => {
      if (canUsePiPInChrome()) {
        host.addEventListener('enterpictureinpicture', onChange);
        host.addEventListener('leavepictureinpicture', onChange);
      }
    },
    unbindEvents: () => {
      if (canUsePiPInChrome()) {
        host.removeEventListener('enterpictureinpicture', onChange);
        host.removeEventListener('leavepictureinpicture', onChange);
      }
    },
  };
};

/**
 * Checks if the native HTML5 video player can enter picture-in-picture (PIP) mode when using
 * the Chrome browser.
 *
 * @see  https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture
 */
let _canUsePiPInChrome: boolean | undefined;
const canUsePiPInChrome = (): boolean => {
  if (!IS_CLIENT) return false;
  if (_canUsePiPInChrome == null) {
    const video = document.createElement('video');
    _canUsePiPInChrome =
      !!document.pictureInPictureEnabled && !video.disablePictureInPicture;
  }
  return _canUsePiPInChrome;
};
