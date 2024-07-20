import {getFromLocalStorage} from '@common/utils/hooks/local-storage';
import {PlayerStoreOptions} from '@common/player/state/player-store-options';
import {PlayerState} from '@common/player/state/player-state';

export interface PersistablePlayerState {
  muted?: PlayerState['muted'];
  repeat?: PlayerState['repeat'];
  shuffling?: PlayerState['shuffling'];
  volume?: PlayerState['volume'];
}

export interface PlayerInitialData {
  state?: PersistablePlayerState;
  queue?: PlayerState['originalQueue'];
  cuedMediaId?: string | number;
}

export function getPlayerStateFromLocalStorage(
  id: string | number,
  options?: PlayerStoreOptions
): PlayerInitialData {
  const defaultVolume = options?.defaultVolume || 30;
  return {
    state: {
      muted: getFromLocalStorage(`player.${id}.muted`) ?? false,
      repeat: getFromLocalStorage(`player.${id}.repeat`) ?? 'all',
      shuffling: getFromLocalStorage(`player.${id}.shuffling`) ?? false,
      volume: getFromLocalStorage(`player.${id}.volume`) ?? defaultVolume,
    },
    queue: getFromLocalStorage(`player.${id}.queue`, []),
    cuedMediaId: getFromLocalStorage(`player.${id}.cuedMediaId`),
  };
}
