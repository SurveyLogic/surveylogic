import {MediaItem} from '@common/player/media-item';
import {PlayerState} from '@common/player/state/player-state';

export function playerQueue(state: () => PlayerState) {
  const getPointer = (): number => {
    if (state().cuedMedia) {
      return (
        state().shuffledQueue.findIndex(
          item => item.id === state().cuedMedia?.id
        ) || 0
      );
    }
    return 0;
  };
  const getCurrent = (): MediaItem | undefined => {
    return state().shuffledQueue[getPointer()];
  };
  const getFirst = (): MediaItem | undefined => {
    return state().shuffledQueue[0];
  };
  const getLast = (): MediaItem | undefined => {
    return state().shuffledQueue[state().shuffledQueue.length - 1];
  };
  const getNext = (): MediaItem | undefined => {
    return state().shuffledQueue[getPointer() + 1];
  };
  const getPrevious = (): MediaItem | undefined => {
    return state().shuffledQueue[getPointer() - 1];
  };
  const isLast = (): boolean => {
    return getPointer() === state().originalQueue.length - 1;
  };

  return {
    getPointer,
    getCurrent,
    getFirst,
    getLast,
    getNext,
    getPrevious,
    isLast,
  };
}
