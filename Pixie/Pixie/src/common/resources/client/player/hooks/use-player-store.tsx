import {StoreApi, useStore} from 'zustand';
import {useContext} from 'react';
import {PlayerStoreContext} from '@common/player/player-context';
import {PlayerState} from '@common/player/state/player-state';
import {FullscreenSlice} from '@common/player/state/fullscreen/fullscreen-slice';
import {PipSlice} from '@common/player/state/pip/pip-slice';

type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

type UsePlayerStore = {
  (): ExtractState<StoreApi<PlayerState>>;
  <U>(
    selector: (
      state: ExtractState<StoreApi<PlayerState & FullscreenSlice & PipSlice>>
    ) => U,
    equalityFn?: (a: U, b: U) => boolean
  ): U;
};

// @ts-ignore
export const usePlayerStore: UsePlayerStore = (selector, equalityFn) => {
  const store = useContext(PlayerStoreContext);
  return useStore(store, selector, equalityFn);
};
