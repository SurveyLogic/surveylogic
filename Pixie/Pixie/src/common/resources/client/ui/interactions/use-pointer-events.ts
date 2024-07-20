import React, {HTMLAttributes, useRef} from 'react';
import {createEventHandler} from '../../utils/dom/create-event-handler';
import {useGlobalListeners} from '@react-aria/utils';

interface PointerState {
  lastPosition: {x: number; y: number};
  id?: number;
  started: boolean;
  el?: HTMLElement;
  originalTouchAction?: string;
  originalUserSelect?: string;
  longPressTimer?: any;
  longPressTriggered?: boolean;
}

interface UsePointerEventsReturn {
  domProps: HTMLAttributes<HTMLElement>;
}

export interface UsePointerEventsProps {
  onMoveStart?: (e: PointerEvent, el: HTMLElement) => false | void;
  onMove?: (e: PointerEvent, deltaX: number, deltaY: number) => void;
  onMoveEnd?: (e: PointerEvent) => void;
  onPointerDown?: (e: React.PointerEvent) => void | false;
  onPointerUp?: (e: PointerEvent, el: HTMLElement) => void;
  onPress?: (e: PointerEvent, el: HTMLElement) => void;
  onLongPress?: (e: PointerEvent | React.PointerEvent, el: HTMLElement) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  minimumMovement?: number;
}
export function usePointerEvents({
  onMoveStart,
  onMove,
  onMoveEnd,
  minimumMovement = 0,
  preventDefault,
  stopPropagation = true,
  onPress,
  onLongPress,
  ...props
}: UsePointerEventsProps): UsePointerEventsReturn {
  const stateRef = useRef<PointerState>({
    lastPosition: {x: 0, y: 0},
    started: false,
    longPressTriggered: false,
  });
  const state = stateRef.current;

  const {addGlobalListener, removeGlobalListener} = useGlobalListeners();

  const start = (e: PointerEvent) => {
    if (!state.el) return;
    const result = onMoveStart?.(e, state.el);

    // allow user to cancel interaction
    if (result === false) return;

    state.originalTouchAction = state.el.style.touchAction;
    state.el.style.touchAction = 'none';
    state.originalUserSelect = document.documentElement.style.userSelect;
    document.documentElement.style.userSelect = 'none';
    state.started = true;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button === 0 && state.id == null) {
      state.started = false;

      const result = props.onPointerDown?.(e);
      if (result === false) return;

      if (stopPropagation) {
        e.stopPropagation();
      }
      if (preventDefault) {
        e.preventDefault();
      }
      state.id = e.pointerId;
      state.el = e.currentTarget as HTMLElement;
      state.lastPosition = {x: e.clientX, y: e.clientY};

      // use global listeners, so we don't have to capture pointer,
      // which would prevent click events on child nodes

      if (onLongPress) {
        state.longPressTimer = setTimeout(() => {
          onLongPress(e, state.el!);
          state.longPressTriggered = true;
        }, 400);
      }

      if (onMoveStart || onMove) {
        addGlobalListener(window, 'pointermove', onPointerMove, false);
      }
      addGlobalListener(window, 'pointerup', onPointerUp, false);
      addGlobalListener(window, 'pointercancel', onPointerUp, false);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerId === state.id) {
      const deltaX = e.clientX - state.lastPosition.x;
      const deltaY = e.clientY - state.lastPosition.y;

      if (
        (Math.abs(deltaX) >= minimumMovement ||
          Math.abs(deltaY) >= minimumMovement) &&
        !state.started
      ) {
        start(e);
      }

      if (state.started) {
        onMove?.(e, deltaX, deltaY);
        state.lastPosition = {x: e.clientX, y: e.clientY};
      }
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerId === state.id) {
      // cancel long press timer, if exists
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer);
      }

      const longPressTriggered = state.longPressTriggered;
      state.longPressTriggered = false;

      // only call onMoveEnd if we actually started moving
      if (state.started) {
        onMoveEnd?.(e);
      }

      if (state.el) {
        // handle press only if event was not cancelled (via touch scroll on mobile for example)
        if (e.type !== 'pointercancel') {
          props.onPointerUp?.(e, state.el);

          // only call onPress if pointer did not leave onPointerDown element
          if (e.target && state.el.contains(e.target as HTMLElement)) {
            // trigger either onPress or onLongPress
            if (longPressTriggered) {
              onLongPress?.(e, state.el);
            } else {
              onPress?.(e, state.el);
            }
          }
        }

        document.documentElement.style.userSelect =
          state.originalUserSelect || '';
        state.el.style.touchAction = state.originalTouchAction || '';
      }
      state.id = undefined;
      state.started = false;
      removeGlobalListener(window, 'pointermove', onPointerMove, false);
      removeGlobalListener(window, 'pointerup', onPointerUp, false);
      removeGlobalListener(window, 'pointercancel', onPointerUp, false);
    }
  };

  return {
    domProps: {
      onPointerDown: createEventHandler(onPointerDown),
    },
  };
}
