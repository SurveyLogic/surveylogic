export function resetMediaSession() {
  if ('mediaSession' in navigator) {
    const actionHandlers: MediaSessionAction[] = [
      'play',
      'pause',
      'previoustrack',
      'nexttrack',
      'stop',
      'seekbackward',
      'seekforward',
      'seekto',
    ];
    actionHandlers.forEach(action =>
      navigator.mediaSession.setActionHandler(action, null)
    );
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = 'none';
  }
}
