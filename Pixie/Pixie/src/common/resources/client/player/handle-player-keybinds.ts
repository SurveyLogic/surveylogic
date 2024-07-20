import {PlayerState} from '@common/player/state/player-state';
import {isCtrlOrShiftPressed} from '@common/utils/keybinds/is-ctrl-or-shift-pressed';

export function handlePlayerKeybinds(
  e: KeyboardEvent,
  state: () => PlayerState
) {
  if (
    ['input', 'textarea'].includes(
      (e.target as HTMLElement)?.tagName.toLowerCase()
    )
  )
    return;

  if (e.key === ' ' || e.key === 'k') {
    e.preventDefault();
    if (state().isPlaying) {
      state().pause();
    } else {
      state().play();
    }
  }

  if (e.key === 'ArrowRight' && isCtrlOrShiftPressed(e)) {
    e.preventDefault();
    state().playNext();
  }

  if (e.key === 'ArrowLeft' && isCtrlOrShiftPressed(e)) {
    e.preventDefault();
    state().playPrevious();
  }
}
