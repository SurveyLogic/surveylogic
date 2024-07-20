export function youtubeIdFromSrc(src: string) {
  return src.match(/((?:\w|-){11})/)?.[0];
}
