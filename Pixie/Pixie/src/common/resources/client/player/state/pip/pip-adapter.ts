export interface PipAdapter {
  isSupported: () => boolean;
  isPip: () => boolean;
  enter: () => Promise<unknown> | undefined;
  exit: () => Promise<unknown> | undefined;
  bindEvents: () => void;
  unbindEvents: () => void;
}
