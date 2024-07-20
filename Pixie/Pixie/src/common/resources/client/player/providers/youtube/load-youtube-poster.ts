import {loadImage} from '@common/utils/http/load-image';
import {PlayerStoreApi} from '@common/player/state/player-state';

export function loadYoutubePoster(videoId: string, store: PlayerStoreApi) {
  const media = store.getState().cuedMedia;
  if (!media?.poster && videoId) {
    findPosterUrl(videoId).then(url => {
      if (url) {
        store.getState().emit('posterLoaded', {url});
      }
    });
  }
}

const posterCache = new Map<string, string>();

async function findPosterUrl(videoId: string): Promise<string | undefined> {
  if (!videoId) return;
  if (posterCache.has(videoId)) {
    return posterCache.get(videoId);
  }

  const posterURL = (quality: string) =>
    `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;

  /**
   * We are testing that the image has a min-width of 121px because if the thumbnail does not
   * exist YouTube returns a blank/error image that is 120px wide.
   */
  return loadImage(posterURL('maxresdefault'), 121) // 1080p (no padding)
    .catch(() => loadImage(posterURL('sddefault'), 121)) // 640p (padded 4:3)
    .catch(() => loadImage(posterURL('hqdefault'), 121)) // 480p (padded 4:3)
    .then(img => {
      const poster = img.src;
      posterCache.set(videoId, poster);
      return poster;
    });
}
