import {InteractableRect} from '../interactable-event';

export function interactableRectFromEl(el: HTMLElement) {
  const translateStr = el.style.transform.match(/translate\((.+?)\)/)?.[1];
  const translateValues = (translateStr || '').split(',');
  const top = translateValues[1] || '0';
  const left = translateValues[0] || '0';

  const rect: InteractableRect = {
    width: el.offsetWidth,
    height: el.offsetHeight,
    left: parseInt(left),
    top: parseInt(top),
    angle: 0,
  };
  const initialAspectRatio = rect.width / rect.height;

  return {rect, initialAspectRatio};
}
