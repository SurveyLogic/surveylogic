import {usePlayerStore} from '@common/player/hooks/use-player-store';

export function useIsMediaCued(mediaId: string | number): boolean {
  return usePlayerStore(s => s.cuedMedia?.id === mediaId);
}
