import {MediaStreamType} from '@common/player/state/player-state';
import {YouTubePlayerState} from '@common/player/providers/youtube/youtube-types';

export interface PlayerEvents {
  play: void;
  pause: void;
  error: {sourceEvent?: any} | void;
  buffering: {isBuffering: boolean};
  buffered: {seconds: number};
  progress: {currentTime: number};
  playbackRateChange: {rate: number};
  playbackRates: {rates: number[]};
  playbackQualityChange: {quality: string};
  playbackQualities: {qualities: string[]};
  textTracks: {tracks: TextTrack[]};
  currentTextTrackChange: {trackId: number};
  textTrackVisibilityChange: {isVisible: boolean};
  durationChange: {duration: number};
  streamTypeChange: {streamType: MediaStreamType};
  posterLoaded: {url: string};
  seek: {time: number};
  playbackEnd: void;
  cued: void;
  providerReady: {el: HTMLElement};
  youtubeStateChange: {state: YouTubePlayerState};
}
