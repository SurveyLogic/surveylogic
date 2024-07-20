import {RefObject, useLayoutEffect, useRef} from 'react';
import {droppables} from '../drag-state';
import {InteractableRect} from '../../interactable-event';
import {DraggableId} from '../use-draggable';

export interface ConnectedMouseSelectable {
  id: DraggableId;
  onSelected?: () => void;
  onDeselected?: () => void;
  ref: RefObject<HTMLElement>;
  rect?: InteractableRect;
}

export const mouseSelectables = new Map<
  DraggableId,
  ConnectedMouseSelectable
>();

export function useMouseSelectable(options: ConnectedMouseSelectable) {
  const {id, ref} = options;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useLayoutEffect(() => {
    if (!ref.current) return;
    // register droppable regardless if it's enabled or not, it might be used by mouse selection box
    mouseSelectables.set(id, {
      ...mouseSelectables.get(id),
      id,
      ref,
      // avoid stale closures
      onSelected: () => {
        optionsRef.current.onSelected?.();
      },
      onDeselected: () => optionsRef.current.onDeselected?.(),
    });
    return () => {
      droppables.delete(id);
    };
  }, [id, optionsRef, ref]);
}
