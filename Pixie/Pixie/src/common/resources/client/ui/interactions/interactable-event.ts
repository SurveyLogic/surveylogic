import React from 'react';

type NativeEvent =
  | React.PointerEvent
  | PointerEvent
  | React.DragEvent<HTMLElement>
  | DragEvent;

export interface InteractableEvent {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  rect: InteractableRect;
  nativeEvent: NativeEvent;
}

export interface InteractableRect {
  left: number;
  top: number;
  width: number;
  height: number;
  angle?: number;
}

export function interactableEvent({
  e,
  rect,
  deltaX,
  deltaY,
}: {
  e: NativeEvent;
  rect: InteractableRect;
  deltaX?: number;
  deltaY?: number;
}): InteractableEvent {
  return {
    rect,
    x: e.clientX,
    y: e.clientY,
    deltaX: deltaX ?? 0,
    deltaY: deltaY ?? 0,
    nativeEvent: e,
  };
}
