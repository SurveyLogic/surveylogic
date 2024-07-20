import React, {RefObject, useLayoutEffect, useRef} from 'react';
import {draggables, dragMonitors, dragSession, droppables} from './drag-state';
import {
  InteractableEvent,
  interactableEvent,
  InteractableRect,
} from '../interactable-event';
import {activeInteraction, setActiveInteraction} from '../active-interaction';
import {domRectToObj} from '../utils/dom-rect-to-obj';
import {updateRects} from './update-rects';
import {useGlobalListeners} from '@react-aria/utils';
import {DragMonitor} from './use-drag-monitor';
import {NativeFileDraggable} from './use-droppable';

interface DragState {
  currentRect?: InteractableRect;
  lastPosition: {x: number; y: number};
  clickedEl?: HTMLElement;
}

export type DragPreviewRenderer = (
  draggable: ConnectedDraggable,
  callback: (node: HTMLElement) => void
) => void;

export type DraggableId = string | number | object;

export interface ConnectedDraggable<T = any> {
  type: string;
  id: DraggableId;
  getData: () => T;
  ref: RefObject<HTMLElement>;
}

// Either draggable from within the app, or file dragged in from the desktop
export type MixedDraggable = ConnectedDraggable | NativeFileDraggable;

interface UseDragProps extends ConnectedDraggable {
  disabled?: boolean;
  onDragStart?: (e: InteractableEvent, target: ConnectedDraggable) => void;
  onDragMove?: (e: InteractableEvent, target: ConnectedDraggable) => void;
  onDragEnd?: (e: InteractableEvent, target: ConnectedDraggable) => void;
  preview?: RefObject<DragPreviewRenderer>;
  hidePreview?: boolean;
}
export function useDraggable({
  id,
  disabled,
  ref,
  preview,
  hidePreview,
  ...options
}: UseDragProps) {
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const {addGlobalListener, removeAllGlobalListeners} = useGlobalListeners();

  const state = useRef<DragState>({
    lastPosition: {x: 0, y: 0},
  }).current;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useLayoutEffect(() => {
    if (!disabled) {
      draggables.set(id, {
        ...draggables.get(id),
        id,
        ref,
        type: optionsRef.current.type,
        getData: optionsRef.current.getData,
      });
    } else {
      draggables.delete(id);
    }
    return () => {
      draggables.delete(id);
    };
  }, [id, disabled, optionsRef, ref]);

  // notify monitors connected to the same drag type as this draggable
  const notifyMonitors = (callback: (m: DragMonitor) => void) => {
    dragMonitors.forEach(monitor => {
      if (monitor.type === draggables.get(id)?.type) {
        callback(monitor);
      }
    });
  };

  const onDragStart = (e: React.DragEvent<HTMLElement>) => {
    const draggable = draggables.get(id);
    const el = ref.current;
    const clickedOnHandle =
      !dragHandleRef.current ||
      !state.clickedEl ||
      dragHandleRef.current.contains(state.clickedEl);

    // if another interaction is in progress (rotate, resize, drag etc.), bail
    if (activeInteraction || !el || !draggable || !clickedOnHandle) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    updateRects(droppables);
    setActiveInteraction('drag');

    // hide default browser ghost image
    if (hidePreview) {
      hideNativeGhostImage(e);
    }
    // this will hide default browser cursor icon, if "dropEffect" is not set in dragOver/dragEnter
    e.dataTransfer.effectAllowed = 'move';

    state.lastPosition = {x: e.clientX, y: e.clientY};
    state.currentRect = domRectToObj(el.getBoundingClientRect());
    const ie = interactableEvent({rect: state.currentRect!, e});

    // If there is a preview option, use it to render a custom preview image that will
    // appear under the pointer while dragging. If not, the element itself is dragged by the browser.
    if (preview?.current) {
      preview.current(draggable, node => {
        e.dataTransfer.setDragImage(node, 0, 0);
      });
    }

    dragSession.status = 'dragging';
    dragSession.dragTargetId = id;
    if (ref.current) {
      ref.current.dataset.dragging = 'true';
    }

    optionsRef.current.onDragStart?.(ie, draggable);

    // wait until next frame so changes made in "onDragStart" are reflected in drag monitors
    requestAnimationFrame(() => {
      notifyMonitors(m => m.onDragStart?.(ie, draggable));
    });

    // firefox does not provide clientX/clientY in "onDrag", need to listen for dragOver on window instead
    addGlobalListener(window, 'dragover', onDragOver, true);
  };

  const onDragOver = (e: React.DragEvent<HTMLElement> | DragEvent) => {
    e.preventDefault();

    if (!state.currentRect) return;

    const deltaX = e.clientX - state.lastPosition.x;
    const deltaY = e.clientY - state.lastPosition.y;

    const newRect = {
      ...state.currentRect,
      left: state.currentRect.left + deltaX,
      top: state.currentRect.top + deltaY,
    };

    const ie = interactableEvent({rect: newRect, e, deltaX, deltaY});

    const target = draggables.get(id);
    if (target) {
      optionsRef.current.onDragMove?.(ie, target);
      notifyMonitors(m => m.onDragMove?.(ie, target));
    }

    state.lastPosition = {x: e.clientX, y: e.clientY};
    state.currentRect = newRect;
  };

  const onDragEnd = (e: React.DragEvent<HTMLElement>) => {
    removeAllGlobalListeners();
    if (!state.currentRect) return;

    setActiveInteraction(null);
    if (emptyImage) {
      emptyImage.remove();
    }

    const ie = interactableEvent({rect: state.currentRect, e});

    const draggable = draggables.get(id);
    if (draggable) {
      optionsRef.current.onDragEnd?.(ie, draggable);
      notifyMonitors(m => m.onDragEnd?.(ie, draggable, dragSession!.status));
    }

    // wait a frame before clearing so monitors have a chance to use drag session status
    requestAnimationFrame(() => {
      dragSession.dragTargetId = undefined;
      dragSession.status = 'inactive';
      if (ref.current) {
        delete ref.current.dataset.dragging;
      }
    });
  };

  const draggableProps = {
    draggable: !disabled,
    onDragStart,
    onDragEnd,
    onPointerDown: (e: React.PointerEvent) => {
      state.clickedEl = e.target as HTMLElement;
    },
  };

  return {draggableProps, dragHandleRef};
}

let emptyImage: HTMLImageElement | undefined;
function hideNativeGhostImage(e: React.DragEvent) {
  if (!emptyImage) {
    emptyImage = new Image();
    // image needs to be in the dom to prevent "globe" icon in chrome
    document.body.append(emptyImage);
    emptyImage.src =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  e.dataTransfer.setDragImage(emptyImage, 0, 0);
}
