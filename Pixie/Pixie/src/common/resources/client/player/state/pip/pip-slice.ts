import {StateCreator} from 'zustand';
import {
  PlayerState,
  ProviderListeners,
} from '@common/player/state/player-state';
import {PipAdapter} from '@common/player/state/pip/pip-adapter';
import {createChromePipAdapter} from '@common/player/state/pip/chrome-pip-adapter';
import {createSafariPipAdapter} from '@common/player/state/pip/safari-pip-adapter';

export interface PipSlice {
  isPip: boolean;
  canPip: boolean;
  enterPip: () => void;
  exitPip: () => void;
  togglePip: () => void;
}

type BaseSliceCreator = StateCreator<
  PipSlice & PlayerState,
  [['zustand/immer', unknown]],
  [],
  PipSlice
>;

type StoreLice = BaseSliceCreator extends (...a: infer U) => infer R
  ? (...a: [...U, Set<Partial<ProviderListeners>>]) => R
  : never;

const adapterFactories = [createChromePipAdapter, createSafariPipAdapter];

export const createPipSlice: StoreLice = (set, get, store, listeners) => {
  let adapters: PipAdapter[] = [];

  const onPipChange = () => {
    set({isPip: adapters.some(a => a.isPip())});
  };

  const isSupported = (): boolean => {
    if (get().providerName !== 'htmlVideo') {
      return false;
    }
    return adapters.some(adapter => adapter.isSupported());
  };

  listeners.add({
    providerReady: ({el}) => {
      // when changing adapters, remove previous adapter events and exit pip
      adapters.every(a => a.unbindEvents());
      if (get().isPip) {
        adapters.every(a => a.exit());
      }
      // create new adapters, and if pip is supported on at least one, bind events
      adapters = adapterFactories.map(factory =>
        factory(el as HTMLVideoElement, onPipChange)
      );
      const canPip = isSupported();
      if (canPip) {
        adapters.every(a => a.bindEvents());
      }
      set({canPip});
    },
  });

  return {
    isPip: false,
    canPip: false,
    enterPip: async () => {
      if (get().isPip || !isSupported()) return;
      await adapters.find(a => a.isSupported())?.enter();
    },
    exitPip: async () => {
      if (!get().isPip) return;
      await adapters.find(a => a.isSupported())?.exit();
    },
    togglePip: () => {
      if (get().isPip) {
        get().exitPip();
      } else {
        get().enterPip();
      }
    },
  };
};
