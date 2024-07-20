export interface FullscreenAdapter {
  isFullscreen: () => boolean;
  canFullScreen: () => boolean;
  enter: () => void;
  exit: () => void;
  bindEvents: () => void;
  unbindEvents: () => void;
}
