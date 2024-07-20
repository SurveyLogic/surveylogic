import {MediaItem, YoutubeMediaItem} from '@common/player/media-item';
import {PlayerInitialData} from '@common/player/utils/player-local-storage';
import type {PlayerState} from '@common/player/state/player-state';
import {YouTubePlayerState} from '@common/player/providers/youtube/youtube-types';
import {PlayerEvents} from '@common/player/state/player-events';

// all listeners specified by user will get full player state passed
// along with original event payload, so it needs a separate type
type ListenersWithState = {
  [K in keyof PlayerEvents]: PlayerEvents[K] extends void | undefined | never
    ? (payload: {state: PlayerState}) => void
    : (payload: PlayerEvents[K] & {state: PlayerState}) => void;
};
// makes it easier to access sourceEvent for user without having to use "in" operator to narrow types
type Listeners = Omit<ListenersWithState, 'error'> & {
  error: (payload: {state: PlayerState; sourceEvent?: any}) => void;
};

export interface PlayerStoreOptions {
  initialData?: PlayerInitialData;
  listeners?: Partial<Listeners>;
  defaultVolume?: number;
  pauseWhileSeeking?: boolean;
  onDestroy?: () => void;
  setMediaSessionMetadata?: (mediaItem: MediaItem) => void;
  onBeforePlay?: () => Promise<void> | undefined;
  loadMoreMediaItems?: (
    mediaItem?: MediaItem
  ) => Promise<MediaItem[] | undefined>;
  youtube?: {
    srcResolver?: (mediaItem: YoutubeMediaItem) => Promise<YoutubeMediaItem>;
    onStateChange?: (state: YouTubePlayerState) => void;
    useCookies?: boolean;
  };
}
