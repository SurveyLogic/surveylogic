import {useViewportSize} from '@react-aria/utils';

export function useOverlayViewport(): Record<string, string> {
  const {width, height} = useViewportSize();
  return {
    '--be-viewport-height': `${height}px`,
    '--be-viewport-width': `${width}px`,
  };
}
