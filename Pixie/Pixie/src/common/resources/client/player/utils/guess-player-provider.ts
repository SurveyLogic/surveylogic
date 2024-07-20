import {MediaItem} from '@common/player/media-item';

const hlsRegex = /\.(m3u8)($|\?)/i;
const dashRegex = /\.(mpd)($|\?)/i;
const audioRegex =
  /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const youtubeUrlRegex =
  /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/;
const youtubeIdRegex = /^((?:\w|-){11})$/;
export function guessPlayerProvider(src: string): MediaItem['provider'] {
  if (youtubeUrlRegex.test(src) || youtubeIdRegex.test(src)) {
    return 'youtube';
  } else if (audioRegex.test(src)) {
    return 'htmlAudio';
  } else if (hlsRegex.test(src)) {
    return 'hls';
  } else if (dashRegex.test(src)) {
    return 'dash';
  } else {
    return 'htmlVideo';
  }
}
