import {
  HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {PlayerStoreContext} from '@common/player/player-context';
import {HtmlMediaInternalStateReturn} from '@common/player/providers/html-media/use-html-media-internal-state';

const defaultPlaybackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function useHtmlMediaEvents({
  ref,
  updateCurrentTime,
  updateBuffered,
  internalState,
}: HtmlMediaInternalStateReturn): HTMLAttributes<HTMLMediaElement> {
  const store = useContext(PlayerStoreContext);

  const onTextTracksChange = useCallback(() => {
    if (!ref.current) return;
    const tracks = Array.from(ref.current.textTracks).filter(
      t => t.label && (t.kind === 'subtitles' || t.kind === 'captions')
    );

    let trackId = -1;
    for (let id = 0; id < tracks.length; id += 1) {
      if (tracks[id].mode === 'hidden') {
        // Do not break in case there is a following track with showing.
        trackId = id;
      } else if (tracks[id].mode === 'showing') {
        trackId = id;
        break;
      }
    }

    const isVisible = trackId !== -1 && tracks[trackId].mode === 'showing';
    store.getState().emit('currentTextTrackChange', {trackId});
    store.getState().emit('textTrackVisibilityChange', {isVisible});
    store.getState().emit('textTracks', {tracks});
  }, [ref, store]);

  useEffect(() => {
    const el = ref.current;
    return () => {
      el?.textTracks.removeEventListener('change', onTextTracksChange);
    };
  }, [ref, onTextTracksChange]);

  return useMemo(() => {
    const emit = store.getState().emit;
    return {
      // set some common props used on audio/video/hls/dash providers
      autoPlay: false,
      onContextMenu: e => e.preventDefault(),
      controlsList: 'nodownload',
      preload: 'metadata',
      'x-webkit-airplay': 'allow',
      onEnded: () => {
        emit('playbackEnd');
        updateCurrentTime();
        internalState.current.timeRafLoop.stop();
      },
      onStalled: e => {
        if (e.currentTarget.readyState < 3) {
          emit('buffering', {isBuffering: true});
        }
      },
      onWaiting: () => {
        emit('buffering', {isBuffering: true});
      },
      onPlaying: () => {
        emit('play');
        emit('buffering', {isBuffering: false});
      },
      onPause: e => {
        emit('pause');
        emit('buffering', {isBuffering: false});
        internalState.current.timeRafLoop.stop();
      },
      onSuspend: () => {
        emit('buffering', {isBuffering: false});
      },
      onSeeking: () => {
        updateCurrentTime();
      },
      onSeeked: () => {
        updateCurrentTime();
      },
      onTimeUpdate: () => {
        updateCurrentTime();
      },
      onError: e => {
        emit('error', {sourceEvent: e});
      },
      onDurationChange: e => {
        updateCurrentTime();
        emit('durationChange', {duration: e.currentTarget.duration});
      },
      onRateChange: e => {
        emit('playbackRateChange', {rate: e.currentTarget.playbackRate});
      },
      onLoadedMetadata: e => {
        if (!internalState.current.playbackReady) {
          emit('providerReady', {el: e.currentTarget});
          internalState.current.playbackReady = true;
          updateBuffered();
          onTextTracksChange();
          e.currentTarget.textTracks.addEventListener('change', () => {
            onTextTracksChange();
          });
        }
        emit('cued');
        emit('playbackRates', {rates: defaultPlaybackRates});
      },
    };
  }, [
    internalState,
    store,
    updateCurrentTime,
    onTextTracksChange,
    updateBuffered,
  ]);
}
