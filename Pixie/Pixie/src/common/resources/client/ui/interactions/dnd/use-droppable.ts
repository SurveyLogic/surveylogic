import React, {RefObject, useLayoutEffect, useRef} from 'react';
import {draggables, dragSession, droppables} from './drag-state';
import {readFilesFromDataTransfer} from './read-files-from-data-transfer';
import {asyncIterableToArray} from '@common/utils/array/async-iterable-to-array';
import {InteractableRect} from '../interactable-event';
import {DraggableId, MixedDraggable} from './use-draggable';
import {Simulate} from 'react-dom/test-utils';
import {UploadedFile} from '@common/uploads/uploaded-file';

export interface ConnectedDroppable {
  id: DraggableId;
  rect?: InteractableRect;
  disabled?: boolean;
  ref: RefObject<HTMLElement>;
}

// File dragged in from desktop
export interface NativeFileDraggable {
  type: 'nativeFile';
  el: null;
  ref: null;
  getData: () => Promise<UploadedFile[]>;
}

interface UseDroppableProps<T extends HTMLElement> {
  id: DraggableId;
  disabled?: boolean;
  types: ('nativeFile' | string)[];
  ref: RefObject<T>;
  // this will fire dragEnter/dragLeave/dragOver events when same element is both draggable and drop target and dragging target over itself. Used for showing line previews before/after element during sort.
  allowDragEventsFromItself?: boolean;
  onDragEnter?: (target: MixedDraggable) => void;
  onDragLeave?: (target: MixedDraggable) => void;
  onDragOver?: (
    target: MixedDraggable,
    e: React.DragEvent<HTMLElement>
  ) => void;
  // Handler that is called after draggable is held over droppable for a period of time.
  // This typically opens the item so that the user can drop within it.
  onDropActivate?: (e: MixedDraggable) => void;
  onDrop?: (target: MixedDraggable) => void | Promise<void> | false;
  acceptsDrop?: (target: MixedDraggable) => boolean;
}

interface DroppableState {
  dragOverElements: Set<Element>;
  dropActivateTimer: ReturnType<typeof setTimeout> | undefined;
}

const DROP_ACTIVATE_TIMEOUT = 400;

export function useDroppable<T extends HTMLElement>({
  id,
  disabled,
  ref,
  ...options
}: UseDroppableProps<T>) {
  const state = useRef<DroppableState>({
    dragOverElements: new Set<Element>(),
    dropActivateTimer: undefined,
  }).current;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useLayoutEffect(() => {
    droppables.set(id, {
      ...droppables.get(id),
      disabled,
      id,
      ref,
    });
    return () => {
      droppables.delete(id);
    };
  }, [id, optionsRef, disabled, ref]);

  // check if drop target accepts drag target
  const canDrop = (draggable: MixedDraggable): boolean => {
    const options = optionsRef.current;

    const allowEventsOnSelf =
      options.allowDragEventsFromItself ||
      ref.current !== draggable.ref?.current;

    return !!(
      draggable?.type &&
      allowEventsOnSelf &&
      options.types.includes(draggable.type) &&
      (!options.acceptsDrop || options.acceptsDrop(draggable))
    );
  };

  const fireDragLeave = (e: React.DragEvent<HTMLElement>) => {
    const draggable = getDraggable(e);
    if (draggable) {
      optionsRef.current.onDragLeave?.(draggable);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLElement>) => {
    e.stopPropagation();

    state.dragOverElements.add(e.target as Element);
    if (state.dragOverElements.size > 1) {
      return;
    }

    const draggable = getDraggable(e);
    if (draggable && canDrop(draggable)) {
      optionsRef.current.onDragEnter?.(draggable);

      clearTimeout(state.dropActivateTimer);
      if (typeof optionsRef.current.onDropActivate === 'function') {
        state.dropActivateTimer = setTimeout(() => {
          if (draggable) {
            optionsRef.current.onDropActivate?.(draggable);
          }
        }, DROP_ACTIVATE_TIMEOUT);
      }
    }
  };

  const onDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.stopPropagation();

    // Track all the targets of dragenter events in a set, and remove them
    // in dragleave. When the set becomes empty, we've left the drop target completely.
    // We must also remove any elements that are no longer in the DOM, because dragleave
    // events will never be fired for these. This can happen, for example, with drop
    // indicators between items, which disappear when the drop target changes.
    state.dragOverElements.delete(e.target as Element);
    for (const element of state.dragOverElements) {
      if (!e.currentTarget.contains(element)) {
        state.dragOverElements.delete(element);
      }
    }

    if (state.dragOverElements.size > 0) {
      return;
    }

    const draggable = getDraggable(e);
    if (draggable && canDrop(draggable)) {
      fireDragLeave(e);
      clearTimeout(state.dropActivateTimer);
    }
  };

  const onDrop = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    state.dragOverElements.clear();

    fireDragLeave(e);
    clearTimeout(state.dropActivateTimer);

    const draggable = getDraggable(e);
    if (draggable) {
      optionsRef.current.onDragLeave?.(draggable);

      // drop target does not accept this type of droppable
      if (!canDrop(draggable)) {
        if (dragSession.status !== 'inactive') {
          dragSession.status = 'dropFail';
        }
        // drop target accepts this type, but it might still reject the drop in callback
      } else {
        // allow callback to mark drop as failed
        const dropResult = optionsRef.current.onDrop?.(draggable);

        // drag session will only be active for draggables within the app, never for files dragged in from desktop
        if (dragSession.status !== 'inactive') {
          dragSession.status =
            dropResult === false ? 'dropFail' : 'dropSuccess';
        }
      }
    }
  };

  const droppableProps = {
    onDragOver: (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const draggable = getDraggable(e);
      if (draggable && canDrop(draggable)) {
        optionsRef.current.onDragOver?.(draggable, e);
      }
    },
    onDragEnter,
    onDragLeave,
    onDrop,
  };

  return {
    droppableProps: disabled ? {} : droppableProps,
  };
}

function getDraggable(
  e: React.DragEvent<HTMLElement>
): MixedDraggable | undefined {
  if (dragSession.dragTargetId != null) {
    return draggables.get(dragSession.dragTargetId);
  } else if (e.dataTransfer.types.includes('Files')) {
    return {
      type: 'nativeFile',
      el: null,
      ref: null,
      getData: () => {
        return asyncIterableToArray(readFilesFromDataTransfer(e.dataTransfer));
      },
    };
  }
}
