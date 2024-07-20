import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {PlayerStoreContext} from '@common/player/player-context';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import Hls, {LevelLoadedData} from 'hls.js';
import {useHtmlMediaInternalState} from '@common/player/providers/html-media/use-html-media-internal-state';
import {useHtmlMediaEvents} from '@common/player/providers/html-media/use-html-media-events';
import {useHtmlMediaApi} from '@common/player/providers/html-media/use-html-media-api';
import {HlsMediaItem} from '@common/player/media-item';

export default function HlsProvider() {
  const store = useContext(PlayerStoreContext);
  const cuedMedia = usePlayerStore(s => s.cuedMedia) as HlsMediaItem;

  // html medial element state
  const videoRef = useRef<HTMLVideoElement>(null!);
  const htmlMediaState = useHtmlMediaInternalState(videoRef);
  const htmlMediaEvents = useHtmlMediaEvents(htmlMediaState);
  const htmlMediaApi = useHtmlMediaApi(htmlMediaState);

  // need both so we can "loadSource" when hls is ready, while keeping other callbacks stable
  const hls = useRef<Hls | undefined>();
  const [hlsReady, setHlsReady] = useState(false);

  const destroyHls = useCallback(() => {
    if (hls) {
      hls.current?.destroy();
      hls.current = undefined;
      setHlsReady(false);
    }
  }, []);

  const setupHls = useCallback(() => {
    if (!Hls.isSupported()) {
      store.getState().emit('error');
      return;
    }

    const hlsInstance = new Hls({
      startLevel: -1,
    });

    hlsInstance.on(Hls.Events.ERROR, (event: any, data: any) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hlsInstance.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hlsInstance.recoverMediaError();
            break;
          default:
            destroyHls();
            break;
        }
      }

      store.getState().emit('error', {sourceEvent: event});
    });

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      if (!hlsInstance.levels?.length) return;

      store.getState().emit('playbackQualities', {
        qualities: ['auto', ...hlsInstance.levels.map(levelToPlaybackQuality)],
      });

      store.getState().emit('playbackQualityChange', {quality: 'auto'});
    });

    hlsInstance.on(
      Hls.Events.LEVEL_LOADED,
      (eventType: string, data: LevelLoadedData) => {
        if (!store.getState().providerReady) {
          const {type, live, totalduration: duration} = data.details;
          const inferredStreamType = live
            ? type === 'EVENT' && Number.isFinite(duration)
              ? 'live:dvr'
              : 'live'
            : 'on-demand';
          store.getState().emit('streamTypeChange', {
            streamType: cuedMedia.streamType || inferredStreamType,
          });
          store.getState().emit('durationChange', {duration});
        }
      }
    );

    hlsInstance.attachMedia(videoRef.current);

    hls.current = hlsInstance;
    // trigger initial load source
    setHlsReady(true);
  }, [destroyHls, store]);

  // setup and destroy hls on mount and unmount
  useEffect(() => {
    setupHls();
    return () => {
      destroyHls();
    };
  }, [setupHls, destroyHls]);

  // load source via hls when media src changes and hls is ready
  useEffect(() => {
    if (
      hls.current &&
      cuedMedia?.src &&
      (hls.current as any).url !== cuedMedia?.src
    ) {
      hls.current.loadSource(cuedMedia.src);
    }
  }, [cuedMedia?.src, hlsReady]);

  useEffect(() => {
    if (!hlsReady) return;
    store.setState({
      providerApi: {
        ...htmlMediaApi,
        setPlaybackQuality: (quality: string) => {
          if (!hls.current) return;
          hls.current.currentLevel = hls.current.levels.findIndex(
            level => levelToPlaybackQuality(level) === quality
          );
          store.getState().emit('playbackQualityChange', {quality});
        },
      },
    });
  }, [htmlMediaApi, store, hlsReady]);

  return (
    <video
      className="w-full h-full"
      ref={videoRef}
      playsInline
      poster={cuedMedia?.poster}
      {...htmlMediaEvents}
    />
  );
}

const levelToPlaybackQuality = (level: any) => {
  return level === -1 ? 'auto' : `${level.height}p`;
};
