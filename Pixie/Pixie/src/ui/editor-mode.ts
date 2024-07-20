import {state} from '../state/utils';
import {useStore} from '../state/store';
import {EditorMode} from '../config/editor-mode';

export function useEditorMode() {
  let isModal = useStore(s => s.config.ui?.mode === EditorMode.OVERLAY);
  const {width} = useStore(s => s.stageSize);
  const isMobile = width <= 700;
  if (isMobile && state().config.ui?.forceOverlayModeOnMobile) {
    isModal = true;
  }
  return {isModal, isMobile};
}
