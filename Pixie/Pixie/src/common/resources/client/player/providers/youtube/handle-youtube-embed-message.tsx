import {
  YoutubeInternalState,
  YouTubeMessage,
  YoutubeMessageInfo,
  YouTubePlayerState,
  YoutubeProviderError,
} from '@common/player/providers/youtube/youtube-types';
import {MutableRefObject, RefObject} from 'react';
import {PlayerStoreApi} from '@common/player/state/player-state';
import {isNumber} from '@common/utils/number/is-number';
import {loadYoutubePoster} from '@common/player/providers/youtube/load-youtube-poster';

export function handleYoutubeEmbedMessage(
  e: MessageEvent,
  internalStateRef: MutableRefObject<YoutubeInternalState>,
  iframeRef: RefObject<HTMLIFrameElement>,
  store: PlayerStoreApi
) {
  const data = JSON.parse(e.data) as YouTubeMessage;
  const info = data.info;
  const internalState = internalStateRef.current;
  const emit = store.getState().emit;
  if (!info) return;

  if (info.videoData?.video_id) {
    internalState.videoId = info.videoData.video_id;
  }

  if (info.videoData?.errorCode) {
    const event: YoutubeProviderError = {
      code: info.videoData.errorCode,
      videoId: internalState.videoId,
    };
    emit('error', {sourceEvent: event});
  }

  if (isNumber(info.duration) && info.duration !== internalState.duration) {
    internalState.duration = info.duration;
    emit('durationChange', {duration: internalState.duration});
  }

  if (
    isNumber(info.currentTime) &&
    info.currentTime !== internalState.currentTime
  ) {
    internalState.currentTime = info.currentTime;
    // don't fire progress events while seeking via seekbar
    if (!store.getState().isSeeking) {
      emit('progress', {currentTime: internalState.currentTime});
    }
  }

  if (isNumber(info.currentTimeLastUpdated)) {
    internalState.lastTimeUpdate = info.currentTimeLastUpdated;
  }

  if (isNumber(info.playbackRate)) {
    internalState.playbackRate = info.playbackRate;
    emit('playbackRateChange', {rate: info.playbackRate});
  }

  if (isNumber(info.videoLoadedFraction)) {
    emit('buffered', {
      seconds: info.videoLoadedFraction * internalState.duration,
    });
  }

  if (Array.isArray(info.availablePlaybackRates)) {
    emit('playbackRates', {rates: info.availablePlaybackRates});
  }

  if (isNumber(info.playerState)) {
    onYoutubeStateChange(info, internalStateRef, iframeRef, store);
    internalState.state = info.playerState;
  }
}

function onYoutubeStateChange(
  info: YoutubeMessageInfo,
  internalStateRef: MutableRefObject<YoutubeInternalState>,
  iframeRef: RefObject<HTMLIFrameElement>,
  store: PlayerStoreApi
) {
  const emit = store.getState().emit;
  const state = info.playerState!;

  emit('youtubeStateChange', {state});
  emit('buffering', {isBuffering: state === YouTubePlayerState.Buffering});
  switch (state) {
    case YouTubePlayerState.Ended:
      emit('playbackEnd');
      break;
    case YouTubePlayerState.Playing:
      // In case of autoplay which might skip `Cued` event
      emit('cued');
      emit('play');
      break;
    case YouTubePlayerState.Paused:
      emit('pause');
      break;
    case YouTubePlayerState.Cued:
      if (info.videoData?.video_id) {
        loadYoutubePoster(info.videoData?.video_id, store);
      }

      if (!internalStateRef.current.playbackReady) {
        emit('providerReady', {el: iframeRef.current!});
        internalStateRef.current.playbackReady = true;
      }
      emit('cued');
      break;
  }
}
