import {InteractableRect} from '../interactable-event';
import {calcNewSizeFromAspectRatio} from './calc-new-size-from-aspect-ratio';

export function centerWithinBoundary(
  boundary: Omit<InteractableRect, 'angle'>,
  aspectRatio: number | null = null
): InteractableRect {
  // set rect to the size of specified boundary
  const rect: InteractableRect = {
    width: boundary.width,
    height: boundary.height,
    top: 0,
    left: 0,
    angle: 0,
  };
  // maybe resize rect based on aspect ratio
  if (aspectRatio) {
    const newSize = calcNewSizeFromAspectRatio(
      aspectRatio,
      rect.width,
      rect.height
    );
    rect.width = newSize.width;
    rect.height = newSize.height;
  }
  // center the rect
  rect.left = (boundary.width - rect.width) / 2;
  rect.top = (boundary.height - rect.height) / 2;
  return rect;
}
