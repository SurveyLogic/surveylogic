import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {useCallback, useEffect, useState} from 'react';
import {YoutubeMediaItem} from '@common/player/media-item';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';

const queryString =
  'autoplay=0&controls=0&disablekb=1&enablejsapi=1&iv_load_policy=3&modestbranding=1&playsinline=1&rel=0&showinfo=0';

export function useYoutubeProviderSrc(
  loadVideoById: (videoId: string) => void
) {
  const {getState, emit} = usePlayerActions();
  const options = usePlayerStore(s => s.options);
  const media = usePlayerStore(s => s.cuedMedia) as
    | YoutubeMediaItem
    | undefined;

  const origin = options.youtube?.useCookies
    ? 'https://www.youtube.com'
    : 'https://www.youtube-nocookie.com';

  const [initialVideoId, setInitialVideoId] = useState(() => {
    if (media?.src && media.src !== 'resolve') {
      return youtubeIdFromSrc(media.src);
    }
  });

  const updateVideoIds = useCallback(
    (src: string) => {
      const videoId = youtubeIdFromSrc(src);
      if (!videoId) return;

      // use setState callback, so we don't need to use "initialVideoId" in the dependency array
      setInitialVideoId(prevId => {
        if (!prevId) {
          return videoId;
        } else {
          // changing src of iframe will cause it to fully reload, use "loadVideoById" api method instead
          loadVideoById(videoId);
          return prevId;
        }
      });
    },
    [loadVideoById]
  );

  useEffect(() => {
    if (media?.src && media.src !== 'resolve') {
      updateVideoIds(media.src);
    } else if (media) {
      emit('buffering', {isBuffering: true});
      options.youtube?.srcResolver?.(media).then(item => {
        // check if resolved media matches the one currently in the store to prevent race conditions.
        // check against current value in store, because this callback will close over old value
        if (item?.src && getState().cuedMedia?.id === item.id) {
          updateVideoIds(item.src);
        }
      });
    }
    // only update when media id changes to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, updateVideoIds, media?.id]);

  return {
    initialVideoUrl: initialVideoId
      ? `${origin}/embed/${initialVideoId}?${queryString}`
      : undefined,
    origin,
  };
}

function youtubeIdFromSrc(src: string) {
  return src.match(/((?:\w|-){11})/)?.[0];
}
