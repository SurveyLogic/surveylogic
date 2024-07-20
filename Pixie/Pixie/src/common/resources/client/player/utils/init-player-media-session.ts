import {Optional} from 'utility-types';
import {PlayerState} from '@common/player/state/player-state';
import {PlayerStoreOptions} from '@common/player/state/player-store-options';

export function initPlayerMediaSession(
  state: () => PlayerState,
  options: PlayerStoreOptions
) {
  if ('mediaSession' in navigator) {
    const actionHandlers: Optional<
      Record<MediaSessionAction, MediaSessionActionHandler>
    > = {
      play: () => state().play(),
      pause: () => state().pause(),
      previoustrack: () => state().playPrevious(),
      nexttrack: () => state().playNext(),
      stop: () => state().stop(),
      seekbackward: () => state().seek(state().getCurrentTime() - 10),
      seekforward: () => state().seek(state().getCurrentTime() + 10),
      seekto: details => state().seek(details.seekTime || 0),
    };
    for (const key in actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(
          key as MediaSessionAction,
          actionHandlers[key as MediaSessionAction]!
        );
      } catch (error) {}
    }
    const cuedMedia = state().cuedMedia;
    if (cuedMedia) {
      options.setMediaSessionMetadata?.(cuedMedia);
    }
  }
}
