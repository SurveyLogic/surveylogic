import {MediaItem} from '@common/player/media-item';
import type {createPlayerStore} from '@common/player/state/player-store';
import {PlayerEvents} from '@common/player/state/player-events';
import {PlayerProviderApi} from '@common/player/state/player-provider-api';
import {PlayerStoreOptions} from '@common/player/state/player-store-options';

export type RepeatMode = 'one' | 'all' | false;

export type MediaStreamType =
  | null
  | 'on-demand'
  | 'live'
  | 'live:dvr'
  | 'll-live'
  | 'll-live:dvr';

export type ProviderListeners = {
  [K in keyof PlayerEvents]: PlayerEvents[K] extends void | undefined | never
    ? () => void
    : (payload: PlayerEvents[K]) => void;
};

export type PlayerStoreApi = ReturnType<typeof createPlayerStore>;

export interface PlayerState {
  options: PlayerStoreOptions;

  // queue
  originalQueue: MediaItem[];
  shuffledQueue: MediaItem[];
  cuedMedia?: MediaItem;

  // volume
  volume: number;
  setVolume: (value: number) => void;
  muted: boolean;
  setMuted: (isMuted: boolean) => void;

  isBuffering: boolean;
  isPlaying: boolean;
  streamType: MediaStreamType;
  // whether playback has started at least once
  playbackStarted: boolean;
  // whether provider is ready to start playback, this will get set to true when media metadata is loaded
  providerReady: boolean;
  mediaDuration: number;
  getCurrentTime: () => number;

  // playback rate and speed
  playbackRate: number;
  setPlaybackRate: (value: number) => void;
  playbackRates: number[];
  playbackQuality: string;
  setPlaybackQuality: (quality: string) => void;
  playbackQualities: string[];

  // will only be set to true on seekbar pointerDown and false on pointerUp
  isSeeking: boolean;
  setIsSeeking: (isSeeking: boolean) => void;
  pauseWhileSeeking: boolean;

  controlsVisible: boolean;
  setControlsVisible: (isVisible: boolean) => void;

  repeat: RepeatMode;
  toggleRepeatMode: () => void;

  shuffling: boolean;
  toggleShuffling: () => void;

  posterUrl?: string;

  textTrackIsVisible: boolean;
  setTextTrackVisibility: (isVisible: boolean) => void;
  textTracks: TextTrack[];
  currentTextTrack: number;
  setCurrentTextTrack: (id: number) => void;

  providerName?: MediaItem['provider'];
  providerApi?: PlayerProviderApi;

  // actions
  cue: (media: MediaItem) => Promise<void>;
  play: (media?: MediaItem) => Promise<void>;
  pause: () => void;
  stop: () => void;
  playPrevious: () => void;
  playNext: () => void;
  seek: (time: number | string) => void;
  overrideQueue: (
    mediaItems: MediaItem[],
    queuePointer?: number
  ) => Promise<void>;
  appendToQueue: (mediaItems: MediaItem[], afterCuedMedia?: boolean) => void;
  removeFromQueue: (mediaItems: MediaItem[]) => void;
  subscribe: (listeners: Partial<ProviderListeners>) => () => void;
  emit: <T extends keyof PlayerEvents>(
    event: T,
    ...payload: PlayerEvents[T] extends void | undefined | never
      ? []
      : [PlayerEvents[T]]
  ) => void;
  destroy: () => void;
  init: () => void;
}
