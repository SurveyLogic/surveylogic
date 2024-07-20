import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {PlayerStoreContext} from '@common/player/player-context';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {useHtmlMediaInternalState} from '@common/player/providers/html-media/use-html-media-internal-state';
import {useHtmlMediaEvents} from '@common/player/providers/html-media/use-html-media-events';
import {useHtmlMediaApi} from '@common/player/providers/html-media/use-html-media-api';
import {MediaPlayer, MediaPlayerClass, supportsMediaSource} from 'dashjs';

export default function DashProvider() {
  const store = useContext(PlayerStoreContext);
  const cuedMedia = usePlayerStore(s => s.cuedMedia);

  // html medial element state
  const videoRef = useRef<HTMLVideoElement>(null!);
  const htmlMediaState = useHtmlMediaInternalState(videoRef);
  const htmlMediaEvents = useHtmlMediaEvents(htmlMediaState);
  const htmlMediaApi = useHtmlMediaApi(htmlMediaState);

  const dash = useRef<MediaPlayerClass | undefined>();
  const [dashReady, setDashReady] = useState(false);

  const destroyDash = useCallback(() => {
    if (dash.current) {
      dash.current.destroy();
      dash.current = undefined;
      setDashReady(false);
    }
  }, []);

  const setupDash = useCallback(() => {
    if (!supportsMediaSource()) {
      store.getState().emit('error');
      return;
    }

    const dashInstance = MediaPlayer().create();

    dashInstance.on(MediaPlayer.events.ERROR, (e: any) => {
      store.getState().emit('error', {sourceEvent: e});
    });

    dashInstance.on(MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
      const levels = dashInstance.getBitrateInfoListFor('video');
      if (!levels?.length) return;

      store.getState().emit('playbackQualities', {
        qualities: ['auto', ...levels.map(levelToPlaybackQuality)],
      });

      store.getState().emit('playbackQualityChange', {quality: 'auto'});
    });

    dashInstance.initialize(videoRef.current, undefined, false);

    // set dash instance after attaching to video element, so "attachSource" is called after
    dash.current = dashInstance;
    setDashReady(true);
  }, [store]);

  useEffect(() => {
    setupDash();
    return () => {
      destroyDash();
    };
  }, [setupDash, destroyDash]);

  useEffect(() => {
    if (dash.current && cuedMedia?.src) {
      dash.current.attachSource(cuedMedia.src);
    }
  }, [cuedMedia?.src, dashReady]);

  useEffect(() => {
    if (!dashReady) return;
    store.setState({
      providerApi: {
        ...htmlMediaApi,
        setPlaybackQuality: (quality: string) => {
          if (!dash.current) return;

          const levels = dash.current.getBitrateInfoListFor('video');
          const index = levels.findIndex(
            level => levelToPlaybackQuality(level) === quality
          );

          dash.current.updateSettings({
            streaming: {
              abr: {
                autoSwitchBitrate: {
                  video: index === -1,
                },
              },
            },
          });

          if (index >= 0) {
            dash.current.setQualityFor('video', index);
          }

          store.getState().emit('playbackQualityChange', {quality});
        },
      },
    });
  }, [store, htmlMediaApi, dashReady]);

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
