import {
  MutableRefObject,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {createRafLoop} from '@common/utils/dom/create-ref-loop';
import {PlayerStoreContext} from '@common/player/player-context';
import {usePlayerStore} from '@common/player/hooks/use-player-store';

export interface HtmlMediaInternalStateReturn {
  ref: RefObject<HTMLMediaElement>;
  updateCurrentTime: () => void;
  updateBuffered: () => void;
  toggleTextTrackModes: (newTrackId: number, isVisible: boolean) => void;
  internalState: MutableRefObject<{
    currentTime: number;
    playbackReady: boolean;
    timeRafLoop: ReturnType<typeof createRafLoop>;
  }>;
}

export function useHtmlMediaInternalState(
  ref: RefObject<HTMLMediaElement>
): HtmlMediaInternalStateReturn {
  const store = useContext(PlayerStoreContext);
  const cuedMedia = usePlayerStore(s => s.cuedMedia);

  const internalState = useRef({
    currentTime: 0,
    buffered: 0,
    isMediaWaiting: false,
    playbackReady: false,
    /**
     * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
     * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
     * resolve that by retrieving time updates in a request animation frame loop.
     */
    timeRafLoop: createRafLoop(() => {
      updateCurrentTime();
      updateBuffered();
    }),
  });

  const updateBuffered = useCallback(() => {
    const timeRange = ref.current?.buffered;
    const seconds =
      !timeRange || timeRange.length === 0
        ? 0
        : timeRange.end(timeRange.length - 1);

    if (internalState.current.buffered !== seconds) {
      store.getState().emit('buffered', {seconds});
      internalState.current.buffered = seconds;
    }
  }, [ref, store]);

  const updateCurrentTime = useCallback(() => {
    const newTime = ref.current?.currentTime || 0;
    if (
      internalState.current.currentTime !== newTime &&
      !store.getState().isSeeking
    ) {
      store.getState().emit('progress', {currentTime: newTime});
      internalState.current.currentTime = newTime;
    }
  }, [internalState, store, ref]);

  const toggleTextTrackModes = useCallback(
    (newTrackId: number, isVisible: boolean) => {
      if (!ref.current) return;
      const {textTracks} = ref.current;

      if (newTrackId === -1) {
        Array.from(textTracks).forEach(track => {
          track.mode = 'disabled';
        });
      } else {
        const oldTrack = textTracks[store.getState().currentTextTrack];
        if (oldTrack) oldTrack.mode = 'disabled';
      }

      const nextTrack = textTracks[newTrackId];

      if (nextTrack) {
        nextTrack.mode = isVisible ? 'showing' : 'hidden';
      }

      store.getState().emit('currentTextTrackChange', {
        trackId: !isVisible ? -1 : newTrackId,
      });
      store
        .getState()
        .emit('textTrackVisibilityChange', {isVisible: isVisible});
    },
    [ref, store]
  );

  // stop current time loop on unmount
  useEffect(() => {
    const timeRafLoop = internalState.current.timeRafLoop;
    return () => {
      timeRafLoop.stop();
    };
  }, []);

  // reload metadata when new media is cued
  useEffect(() => {
    ref.current?.load();
  }, [cuedMedia?.src, ref]);

  return {
    ref,
    internalState,
    updateCurrentTime,
    toggleTextTrackModes,
    updateBuffered,
  };
}
