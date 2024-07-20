import {RefObject} from 'react';
import {fabric} from 'fabric';
import {repositionFloatingControls} from '../floating-object-controls';
import {isText} from '../../utils/is-text';
import {ObjectOptions} from '../../object-modified-event';
import {state, tools} from '../../../state/utils';
import {
  InteractableEvent,
  InteractableRect,
} from '@common/ui/interactions/interactable-event';

export function rotateActiveObj(e: {
  rect: InteractableRect;
  prevRect?: InteractableRect;
}) {
  const obj = tools().objects.getActive();
  if (!obj || !e.rect.angle) return;
  const newAngle = fabric.util.radiansToDegrees(e.rect.angle);
  if (newAngle !== obj.angle) {
    tools().objects.setValues({angle: newAngle});
  }
}

export function moveActiveObj(e: {
  rect: InteractableRect;
  prevRect?: InteractableRect;
}) {
  const centerX = e.rect.width / 2;
  const centerY = e.rect.height / 2;
  tools().objects.setValues({
    left: (e.rect.left + centerX) / state().zoom,
    top: (e.rect.top + centerY) / state().zoom,
  });
}

export function resizeActiveObj(e: InteractableEvent) {
  const obj = tools().objects.getActive();
  if (!obj) return;

  const newValues: ObjectOptions = {};

  if (isText(obj)) {
    if (
      e.deltaX > 0 ||
      (obj.getScaledHeight() >= 20 && obj.getScaledWidth() >= 20)
    ) {
      newValues.fontSize = (obj.fontSize || 1) + e.deltaX;
    }
  } else {
    if (obj.width) {
      newValues.scaleX = e.rect.width / state().zoom / obj.width;
    }
    if (obj.height) {
      newValues.scaleY = e.rect.height / state().zoom / obj.height;
    }
  }
  tools().objects.setValues(newValues);
}

export function syncBoxPositionWithActiveObj(
  boxRef: RefObject<HTMLElement>,
  floatingControlsRef: RefObject<HTMLElement>
) {
  const obj = tools().objects.getActive();
  if (!obj || !boxRef.current) return;
  const el = boxRef.current;

  // bounding box position
  const angleRad = fabric.util.degreesToRadians(obj.angle ?? 0);
  let width = Math.round(obj.getScaledWidth() * state().zoom);
  let height = Math.round(obj.getScaledHeight() * state().zoom);
  let left = Math.round((obj.left ?? 0) * state().zoom);
  let top = Math.round((obj.top ?? 0) * state().zoom);

  const centerX = obj.originX === 'center' ? width / 2 : 0;
  const centerY = obj.originY === 'center' ? height / 2 : 0;

  if (obj.padding) {
    width += obj.padding * 2;
    height += obj.padding * 2;
    left -= obj.padding;
    top -= obj.padding;
  }

  // position bounding box
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.transform = `translate(${left - centerX}px, ${
    top - centerY
  }px) rotate(${angleRad}rad)`;

  tools().canvas.render();

  repositionFloatingControls(obj, floatingControlsRef.current);
}

export function enableTextEditing() {
  const obj = tools().objects.getActive();
  if (isText(obj)) {
    obj.enterEditing();
    obj.hiddenTextarea?.focus();
  }
}
