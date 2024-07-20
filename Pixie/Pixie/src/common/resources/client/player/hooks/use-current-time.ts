import {useEffect, useState} from 'react';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {usePlayerStore} from '@common/player/hooks/use-player-store';

export function useCurrentTime() {
  const {subscribe, getCurrentTime} = usePlayerActions();
  const providerKey = usePlayerStore(s =>
    s.providerName && s.cuedMedia?.id
      ? `${s.providerName}+${s.cuedMedia.id}`
      : null
  );

  const [currentTime, setCurrentTime] = useState(() => getCurrentTime());

  useEffect(() => {
    return subscribe({
      progress: ({currentTime}) => setCurrentTime(currentTime),
    });
  }, [subscribe]);

  // update current time when media or provider changes
  useEffect(() => {
    if (providerKey) {
      setCurrentTime(getCurrentTime());
    }
  }, [providerKey, getCurrentTime]);

  return currentTime;
}
