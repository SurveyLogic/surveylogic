import {MediaItem} from '@common/player/media-item';

export function isSameMedia(a?: MediaItem, b?: MediaItem): boolean {
  if (!a || !b) return false;
  return a.id === b.id && a.groupId === b.groupId;
}
