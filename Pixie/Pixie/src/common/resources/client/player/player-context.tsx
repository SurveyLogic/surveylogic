import {createContext, ReactNode, useState} from 'react';
import {createPlayerStore} from '@common/player/state/player-store';
import {PlayerStoreOptions} from '@common/player/state/player-store-options';
import type {PlayerStoreApi} from '@common/player/state/player-state';

export const PlayerStoreContext = createContext<PlayerStoreApi>(null!);

interface PlayerContextProps {
  children: ReactNode;
  id: string | number;
  options: PlayerStoreOptions;
}
export function PlayerContext({children, id, options}: PlayerContextProps) {
  //lazily create store object only once
  const [store] = useState(() => {
    return createPlayerStore(id, options);
  });

  return (
    <PlayerStoreContext.Provider value={store}>
      {children}
    </PlayerStoreContext.Provider>
  );
}
