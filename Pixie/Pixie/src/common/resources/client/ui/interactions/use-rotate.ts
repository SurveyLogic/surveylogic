import {RefObject} from 'react';
import {
  interactableEvent,
  InteractableEvent,
  InteractableRect,
} from './interactable-event';
import {usePointerEvents, UsePointerEventsProps} from './use-pointer-events';
import {activeInteraction, setActiveInteraction} from './active-interaction';
import {domRectToObj} from './utils/dom-rect-to-obj';

interface RotateState {
  currentRect?: InteractableRect;
  centerX?: number;
  centerY?: number;
  startAngle?: number;
}

let state: RotateState = {};

interface UseRotateProps {
  boundaryRect?: InteractableRect;
  boundaryRef?: RefObject<HTMLElement> | null;
  onRotateStart?: (e: InteractableEvent) => void;
  onRotate?: (e: InteractableEvent) => void;
  onRotateEnd?: (e: InteractableEvent) => void;
}
export function useRotate(props: UseRotateProps) {
  const pointerProps: UsePointerEventsProps = {
    onMoveStart: (e, rotatable) => {
      const target = e.target as HTMLElement;
      if (!target.dataset.rotateHandle || activeInteraction) {
        return false;
      }

      const rect = domRectToObj(rotatable.getBoundingClientRect());
      if (!rect) return false;

      const rotateVal = rotatable.style.transform.match(/rotate\((.+?)\)/)?.[1];
      const [rotation = '0'] = rotateVal ? rotateVal.split(',') : [];
      resetState({
        currentRect: rect,
        // store the center because the element has css `transform-origin: center center`
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        startAngle: parseFloat(rotation),
      });

      setActiveInteraction('rotate');

      // get the angle of the element when the drag starts
      state.startAngle = getDragAngle(e);

      props.onRotateStart?.(interactableEvent({rect, e}));
    },
    onMove: (e, deltaX, deltaY) => {
      if (!state.currentRect) return;

      const newRect = {...state.currentRect};
      newRect.angle = getDragAngle(e);
      newRect.left += deltaX;
      newRect.top += deltaY;

      props.onRotate?.(interactableEvent({rect: newRect, e, deltaX, deltaY}));

      state.currentRect = newRect;
    },
    onMoveEnd: e => {
      if (state.currentRect) {
        props.onRotateEnd?.(interactableEvent({rect: state.currentRect, e}));
      }
      resetState();
    },
  };

  const {domProps} = usePointerEvents(pointerProps);

  return {rotateProps: domProps};
}

function getDragAngle(e: {pageX: number; pageY: number}) {
  const center = {
    x: state.centerX || 0,
    y: state.centerY || 0,
  };
  const angle = Math.atan2(center.y - e.pageY, center.x - e.pageX);

  return angle - (state.startAngle || 0);
}

const resetState = (value: RotateState = {}) => {
  setActiveInteraction(null);
  state = value;
};
