import {RefObject} from 'react';
import {
  interactableEvent,
  InteractableEvent,
  InteractableRect,
} from './interactable-event';
import {usePointerEvents, UsePointerEventsProps} from './use-pointer-events';
import {activeInteraction, setActiveInteraction} from './active-interaction';
import {domRectToObj} from './utils/dom-rect-to-obj';
import {clamp} from '../../utils/number/clamp';

let state: {
  currentRect?: InteractableRect;
  boundaryRect?: InteractableRect;
} = {};

export interface UseMoveProps {
  restrictWithinBoundary?: boolean;
  minimumMovement?: number;
  boundaryRef?: RefObject<HTMLElement> | null;
  boundaryRect?: InteractableRect;
  onMoveStart?: (e: InteractableEvent) => void;
  onMove?: (e: InteractableEvent) => void;
  onMoveEnd?: (e: InteractableEvent) => void;
}
export function useMove({
  boundaryRef,
  boundaryRect,
  minimumMovement,
  restrictWithinBoundary = true,
  ...props
}: UseMoveProps) {
  const pointerProps: UsePointerEventsProps = {
    minimumMovement,
    onMoveStart: (e, el) => {
      if (activeInteraction) {
        return false;
      }
      state = {
        currentRect: domRectToObj(el.getBoundingClientRect()),
      };

      setActiveInteraction('move');

      if (boundaryRect) {
        state.boundaryRect = boundaryRect;
      } else if (boundaryRef?.current) {
        state.boundaryRect = domRectToObj(
          boundaryRef.current.getBoundingClientRect()
        );
      }

      // if we have a boundary, x, y will be relative to that boundary, otherwise it will be relative to window
      if (state.currentRect && state.boundaryRect) {
        state.currentRect.left -= state.boundaryRect.left;
        state.currentRect.top -= state.boundaryRect.top;
      }

      props.onMoveStart?.(interactableEvent({rect: state.currentRect!, e}));
    },
    onMove: (e, deltaX, deltaY) => {
      if (!state.currentRect) return;

      const newRect = {
        ...state.currentRect,
        left: state.currentRect.left + deltaX,
        top: state.currentRect.top + deltaY,
      };

      const boundedRect = {...newRect};

      if (state.boundaryRect && restrictWithinBoundary) {
        boundedRect.left = clamp(
          newRect.left,
          0,
          state.boundaryRect.width - newRect.width
        );
        boundedRect.top = clamp(
          newRect.top,
          0,
          state.boundaryRect.height - newRect.height
        );
      }

      props.onMove?.(interactableEvent({rect: boundedRect, e, deltaX, deltaY}));

      state.currentRect = newRect;
    },
    onMoveEnd: e => {
      if (!state.currentRect) return;
      props.onMoveEnd?.(interactableEvent({rect: state.currentRect, e}));
      setActiveInteraction(null);
      state = {};
    },
  };

  const {domProps} = usePointerEvents(pointerProps);
  return {moveProps: domProps};
}
