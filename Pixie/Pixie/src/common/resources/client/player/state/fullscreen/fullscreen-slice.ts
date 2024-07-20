import {StateCreator} from 'zustand';
import {
  PlayerState,
  ProviderListeners,
} from '@common/player/state/player-state';
import {ScreenOrientation} from '@common/player/state/fullscreen/screen-orientation';
import {IS_IPHONE} from '@common/utils/platform';
import {FullscreenAdapter} from '@common/player/state/fullscreen/fullscreen-adapter';
import {createNativeFullscreenAdapter} from '@common/player/state/fullscreen/create-native-fullscreen-adapter';
import {createIphoneFullscreenAdapter} from '@common/player/state/fullscreen/create-iphone-fullscreen-adapter';
import {PipSlice} from '@common/player/state/pip/pip-slice';

export interface FullscreenSlice {
  isFullscreen: boolean;
  canFullscreen: boolean;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;
}

type BaseSliceCreator = StateCreator<
  FullscreenSlice & PlayerState & PipSlice,
  [['zustand/immer', unknown]],
  [],
  FullscreenSlice
>;

type StoreLice = BaseSliceCreator extends (...a: infer U) => infer R
  ? (...a: [...U, Set<Partial<ProviderListeners>>]) => R
  : never;

const iPhoneProviderBlacklist = ['youtube'];

export const createFullscreenSlice: StoreLice = (
  set,
  get,
  store,
  listeners
) => {
  const orientation = new ScreenOrientation();
  let adapter: FullscreenAdapter | undefined;

  const onFullscreenChange = async () => {
    const isFullscreen = adapter?.isFullscreen();
    if (isFullscreen) {
      // lock orientation to landscape
      orientation.lock();
    } else {
      orientation.unlock();
    }
    set({isFullscreen});
  };

  const isSupported = (): boolean => {
    // iPhone only allows putting video element in fullscreen, and
    // there's no way to get access to it with YouTube iframe api
    if (IS_IPHONE && iPhoneProviderBlacklist.includes(get().providerName!)) {
      return false;
    }
    return adapter?.canFullScreen() ?? false;
  };

  listeners.add({
    providerReady: ({el}) => {
      // when changing adapters, remove previous adapter events and exit fullscreen
      adapter?.unbindEvents();
      if (get().isFullscreen) {
        adapter?.exit();
      }
      // create new adapter, and if fullscreen is supported, bind events
      adapter = IS_IPHONE
        ? createIphoneFullscreenAdapter(
            el as HTMLVideoElement,
            onFullscreenChange
          )
        : createNativeFullscreenAdapter(el, onFullscreenChange);
      const canFullscreen = isSupported();
      set({canFullscreen});
      if (canFullscreen) {
        adapter.bindEvents();
      }
    },
  });

  return {
    isFullscreen: false,
    canFullscreen: false,
    enterFullscreen: () => {
      if (!isSupported() || adapter?.isFullscreen()) return;

      // exit pip if it's active
      if (get().isPip) {
        get().exitPip();
      }
      return adapter?.enter();
    },
    exitFullscreen: () => {
      if (!adapter?.isFullscreen()) return;
      return adapter.exit();
    },
    toggleFullscreen: () => {
      if (get().isFullscreen) {
        get().exitFullscreen();
      } else {
        get().enterFullscreen();
      }
    },
  };
};
