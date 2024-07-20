/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Playback_controls
 */
export const enum YoutubeCommand {
  Play = 'playVideo',
  Pause = 'pauseVideo',
  Stop = 'stopVideo',
  Seek = 'seekTo',
  Load = 'loadVideoById',
  Mute = 'mute',
  Unmute = 'unMute',
  SetVolume = 'setVolume',
  SetPlaybackRate = 'setPlaybackRate',
  SetPlaybackQuality = 'setPlaybackQuality',
}

export interface YouTubeCommandArg {
  [YoutubeCommand.Play]: void;
  [YoutubeCommand.Pause]: void;
  [YoutubeCommand.Stop]: void;
  [YoutubeCommand.Seek]: number;
  [YoutubeCommand.Load]: string;
  [YoutubeCommand.Mute]: void;
  [YoutubeCommand.Unmute]: void;
  [YoutubeCommand.SetVolume]: number;
  [YoutubeCommand.SetPlaybackRate]: number;
  [YoutubeCommand.SetPlaybackQuality]: string;
}

/**
 * @see https://developers.google.com/youtube/iframe_api_reference#onStateChange
 */
export const enum YouTubePlayerState {
  Unstarted = -1,
  Ended = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  Cued = 5,
}

export interface YoutubeInternalState {
  duration: number;
  currentTime: number;
  videoId?: string;
  lastTimeUpdate: number;
  playbackRate: number;
  playbackReady: boolean;
  state: YouTubePlayerState;
}

export const enum YouTubePlaybackQuality {
  Unknown = 'unknown',
  Tiny = 'tiny',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Hd720 = 'hd720',
  Hd1080 = 'hd1080',
  Highres = 'highres',
  Max = 'max',
}

export interface YouTubeMessage {
  channel: string;
  event: 'initialDelivery' | 'onReady' | 'infoDelivery' | 'apiInfoDelivery';
  info?: YoutubeMessageInfo;
}

export interface YoutubeMessageInfo {
  availablePlaybackRates?: number[];
  availableQualityLevels?: YouTubePlaybackQuality[];
  currentTime?: number;
  currentTimeLastUpdated?: number;
  videoLoadedFraction?: number;
  volume?: number;
  videoUrl?: string;
  videoData?: {
    author: string;
    title: string;
    video_id: string;
    errorCode?: string;
  };
  duration?: number;
  muted?: boolean;
  playbackQuality?: YouTubePlaybackQuality;
  playbackRate?: number;
  playerState?: YouTubePlayerState;
}

export interface YoutubeProviderError {
  code?: string;
  videoId?: string;
}

export interface YoutubeProviderInternalApi {
  loadVideoById: (videoId: string) => void;
}
