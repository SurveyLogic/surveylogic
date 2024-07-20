import {MediaStreamType} from '@common/player/state/player-state';

interface BaseMediaItem<T = any> {
  id: string | number;
  groupId?: string | number;
  provider: 'youtube' | 'htmlAudio' | 'htmlVideo' | 'hls' | 'dash';
  meta?: T;
  poster?: string;
}

export interface YoutubeMediaItem<T = any> extends BaseMediaItem<T> {
  provider: 'youtube';
  src: 'resolve' | string;
}

export interface HlsMediaItem<T = any> extends BaseMediaItem<T> {
  provider: 'hls';
  src: string;
  streamType?: MediaStreamType;
}

export interface DashMediaItem<T = any> extends BaseMediaItem<T> {
  provider: 'dash';
  src: string;
  streamType?: MediaStreamType;
}

export interface HtmlAudioMediaItem<T = any> extends BaseMediaItem<T> {
  provider: 'htmlAudio';
  src: string;
}

export interface HtmlVideoMediaItem<T = any> extends BaseMediaItem<T> {
  provider: 'htmlVideo';
  src: string;
}

export type MediaItem<T = any> =
  | YoutubeMediaItem<T>
  | HtmlAudioMediaItem<T>
  | HtmlVideoMediaItem<T>
  | HlsMediaItem<T>
  | DashMediaItem<T>;
