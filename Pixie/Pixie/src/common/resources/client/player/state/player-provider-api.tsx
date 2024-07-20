export interface PlayerProviderApi {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (value: number) => void;
  setMuted: (isMuted: boolean) => void;
  setPlaybackRate: (value: number) => void;
  setPlaybackQuality?: (value: string) => void;
  setTextTrackVisibility?: (isVisible: boolean) => void;
  setCurrentTextTrack?: (trackId: number) => void;
  getCurrentTime: () => number;
  getSrc: () => string | undefined;
  internalProviderApi?: any;
}
