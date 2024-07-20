import {isMac} from '@react-aria/utils';

interface Event {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

export function isCtrlKeyPressed(e: Event) {
  if (isMac()) {
    return e.metaKey;
  }

  return e.ctrlKey;
}
