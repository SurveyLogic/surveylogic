import React from 'react';
import {InteractableRect} from './interactable-event';

export interface InteractablePointerEvent {
  nativeEvent: React.PointerEvent | PointerEvent;
  el: HTMLElement;
  startPoint: {x: number; y: number; scrollTop: number};
  currentRect: InteractableRect;
  aspectRatio: number | null | undefined;
}

export interface InteractablePointerMoveEvent extends InteractablePointerEvent {
  deltaX: number;
  deltaY: number;
}
