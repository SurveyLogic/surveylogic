import {InteractableRect} from '../interactable-event';

export function domRectToObj(rect: DOMRect): InteractableRect {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}
