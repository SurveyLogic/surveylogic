import {DraggableId, DragPreviewRenderer, useDraggable} from './use-draggable';
import {useDroppable} from './use-droppable';
import {RefObject, useEffect, useRef} from 'react';
import {getScrollParent, mergeProps} from '@react-aria/utils';
import {moveItemInArray} from '@common/utils/array/move-item-in-array';
import {droppables} from './drag-state';
import {moveItemInNewArray} from '@common/utils/array/move-item-in-new-array';
import {updateRects} from '@common/ui/interactions/dnd/update-rects';

let sortSession: null | {
  // items in this list will be moved when user is sorting
  sortables: DraggableId[];

  // sortable user started dragging to start this session
  activeSortable: DraggableId;
  activeIndex: number;

  // final index sortable was dropped in and should be moved to
  finalIndex: number;

  // drop position for displaying line preview
  dropPosition: DropPosition;
  // element that currently has a line preview at the top or bottom
  linePreviewEl?: HTMLElement;
  scrollParent?: Element;
  scrollListener: () => void;
} = null;

export type DropPosition = 'before' | 'after' | null;

export interface UseSortableProps {
  item: DraggableId;
  items: DraggableId[];
  onSortStart?: () => void;
  onSortEnd?: (oldIndex: number, newIndex: number) => void;
  onDragEnd?: () => void;
  onDropPositionChange?: (dropPosition: DropPosition) => void;
  ref: RefObject<HTMLElement>;
  type: string;
  preview?: RefObject<DragPreviewRenderer>;
  previewVariant?: 'line' | 'liveSort';
  disabled?: boolean;
}
export function useSortable({
  item,
  items,
  type,
  ref,
  onSortEnd,
  onSortStart,
  onDragEnd,
  preview,
  disabled,
  onDropPositionChange,
  previewVariant = 'liveSort',
}: UseSortableProps) {
  const dropPosition = useRef<DropPosition>(null);

  // todo: issue with sorting after scrolling menu editor item list

  // update sortables and active index, in case we lazy load more items while sorting
  useEffect(() => {
    if (sortSession && sortSession.sortables.length !== items.length) {
      sortSession.sortables = [...items];
      sortSession.activeIndex = items.indexOf(item);
    }
  }, [items, item]);

  const {draggableProps, dragHandleRef} = useDraggable({
    id: item,
    ref,
    type,
    preview,
    disabled,
    onDragStart: () => {
      dropPosition.current = null;
      sortSession = {
        sortables: [...items],
        activeSortable: item,
        activeIndex: items.indexOf(item),
        finalIndex: items.indexOf(item),
        dropPosition: null,
        scrollParent: ref.current ? getScrollParent(ref.current) : undefined,
        scrollListener: () => {
          updateRects(droppables);
        },
      };

      if (previewVariant === 'liveSort') {
        addSortStyles();
      }
      onSortStart?.();
      sortSession.scrollParent?.addEventListener(
        'scroll',
        sortSession.scrollListener
      );
    },
    onDragEnd: () => {
      if (!sortSession) return;

      if (previewVariant === 'liveSort') {
        removeSortStyles();
      }

      sortSession.dropPosition = null;
      onDropPositionChange?.(sortSession.dropPosition);
      if (sortSession.activeIndex !== sortSession.finalIndex) {
        onSortEnd?.(sortSession.activeIndex, sortSession.finalIndex);
      }
      sortSession.scrollParent?.removeEventListener(
        'scroll',
        sortSession.scrollListener
      );
      clearLinePreview();
      // call "onDragEnd" after "onSortEnd", so listener has a chance to use sort session data
      onDragEnd?.();
      sortSession = null;
    },
    getData: () => {},
  });

  const {droppableProps} = useDroppable({
    id: item,
    ref,
    types: [type],
    disabled,
    allowDragEventsFromItself: true,
    onDragOver: (target, e) => {
      if (!sortSession || previewVariant !== 'line') {
        return;
      }

      const previousPosition = sortSession.dropPosition;
      let newPosition: DropPosition = null;

      const rect = droppables.get(item)?.rect;
      if (rect) {
        const midY = rect.top + rect.height / 2;
        if (e.clientY <= midY) {
          newPosition = 'before';
        } else if (e.clientY >= midY) {
          newPosition = 'after';
        }
      }

      if (newPosition !== previousPosition) {
        const overIndex = sortSession.sortables.indexOf(item);
        sortSession.dropPosition = newPosition;
        onDropPositionChange?.(sortSession.dropPosition);

        clearLinePreview();
        if (ref.current) {
          if (sortSession.dropPosition === 'after') {
            addLinePreview(ref.current, 'bottom');
          } else {
            // if it's the first row, add preview to the top border, as there's no previous element
            if (overIndex === 0) {
              addLinePreview(ref.current, 'top');
              // otherwise add preview to the bottom border of the previous row
            } else {
              const droppableId = sortSession.sortables[overIndex - 1];
              const droppable = droppables.get(droppableId);
              if (droppable?.ref.current) {
                addLinePreview(droppable.ref.current, 'bottom');
              }
            }
          }
        }

        const itemIndex = items.indexOf(item);

        // don't move item at all if hovering over itself
        if (sortSession.activeIndex === itemIndex) {
          sortSession.finalIndex = sortSession.activeIndex;
          return;
        }

        // adjust final drop index based on whether we're dropping drag target after or before it's original index
        // this is needed, so we get the same index if target is dropped after current item or before next item
        const dragDirection =
          overIndex > sortSession.activeIndex ? 'after' : 'before';
        if (dragDirection === 'after') {
          sortSession.finalIndex =
            sortSession.dropPosition === 'before' ? itemIndex - 1 : itemIndex;
        } else {
          sortSession.finalIndex =
            sortSession.dropPosition === 'after' ? itemIndex + 1 : itemIndex;
        }
      }
    },
    onDragEnter: () => {
      if (!sortSession || previewVariant === 'line') return;

      const overIndex = sortSession.sortables.indexOf(item);
      const oldIndex = sortSession.sortables.indexOf(
        sortSession.activeSortable
      );

      moveItemInArray(sortSession.sortables, oldIndex, overIndex);
      const rects = sortSession.sortables.map(s => droppables.get(s)?.rect);

      sortSession.sortables.forEach((sortable, index) => {
        if (!sortSession) return;

        const newRects = moveItemInNewArray(
          rects,
          overIndex,
          sortSession.activeIndex
        );
        const oldRect = rects[index];
        const newRect = newRects[index];
        const sortableTarget = droppables.get(sortable);

        if (sortableTarget?.ref.current && newRect && oldRect) {
          const x = newRect.left - oldRect.left;
          const y = newRect.top - oldRect.top;
          sortableTarget.ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });

      sortSession.finalIndex = overIndex;
    },
    onDragLeave: () => {
      if (!sortSession || previewVariant !== 'line') {
        return;
      }
      sortSession.dropPosition = null;
      onDropPositionChange?.(sortSession.dropPosition);
    },
  });

  return {
    sortableProps: {...mergeProps(draggableProps, droppableProps)},
    dragHandleRef,
  };
}

const transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';

function addSortStyles() {
  if (!sortSession) return;
  sortSession.sortables.forEach((sortable, index) => {
    const droppable = droppables.get(sortable);
    if (!droppable?.ref.current) return;

    droppable.ref.current.style.transition = transition;

    if (sortSession?.activeIndex === index) {
      droppable.ref.current.style.opacity = '0.4';
    }
  });
}

// clear any styles and transforms applied to sortables during sorting
function removeSortStyles() {
  if (!sortSession) return;
  sortSession.sortables.forEach(sortable => {
    const droppable = droppables.get(sortable);
    if (droppable?.ref.current) {
      droppable.ref.current.style.transform = '';
      droppable.ref.current.style.transition = '';
      droppable.ref.current.style.opacity = '';
      droppable.ref.current.style.zIndex = '';
    }
  });
}

function clearLinePreview() {
  if (sortSession?.linePreviewEl) {
    sortSession.linePreviewEl.style.borderBottomColor = '';
    sortSession.linePreviewEl.style.borderTopColor = '';
    sortSession.linePreviewEl = undefined;
  }
}

function addLinePreview(el: HTMLElement, side: 'top' | 'bottom') {
  const color = 'rgb(var(--be-primary))';
  if (side === 'top') {
    el.style.borderTopColor = color;
  } else {
    el.style.borderBottomColor = color;
  }
  if (sortSession) {
    sortSession.linePreviewEl = el;
  }
}
