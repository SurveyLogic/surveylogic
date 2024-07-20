import React, {RefObject, useRef} from 'react';
import {usePointerEvents} from '../../use-pointer-events';
import {InteractableRect} from '../../interactable-event';
import {restrictResizableWithinBoundary} from '../../utils/restrict-resizable-within-boundary';
import {activeInteraction} from '../../active-interaction';
import {updateRects} from '../update-rects';
import {mouseSelectables} from './use-mouse-selectable';
import {rectsIntersect} from '../../utils/rects-intersect';
import {DraggableId} from '../use-draggable';

interface SelectionState {
  startPoint?: {x: number; y: number; scrollTop: number};
  endPoint?: {x: number; y: number};
  boundaryRect?: InteractableRect & {heightWithoutScroll: number};
  scrollListener?: EventListener;
  rafId?: number;
  selectedIds?: Set<DraggableId>;
}

interface Props {
  onPointerDown?: (e: React.PointerEvent) => void;
  containerRef?: RefObject<HTMLDivElement>;
}
export function useMouseSelectionBox({onPointerDown, ...props}: Props = {}) {
  const defaultRef = useRef<HTMLDivElement>(null);
  const containerRef = props.containerRef || defaultRef;
  const boxRef = useRef<HTMLDivElement>(null);

  let state = useRef<SelectionState>({}).current;

  const drawSelectionBox = () => {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }

    if (!state.startPoint || !state.endPoint || !state.boundaryRect) return;

    const startPoint = state.startPoint;
    const endPoint = state.endPoint;
    const initialScrollTop = startPoint.scrollTop || 0;
    const currentScrollTop = containerRef.current?.scrollTop || 0;

    const newRect = {
      left: Math.min(startPoint.x, endPoint.x),
      top: Math.min(startPoint.y, endPoint.y),
      width: Math.abs(startPoint.x - endPoint.x),
      height: Math.abs(startPoint.y - endPoint.y),
    };

    // convert box coords to be relative to container and not viewport
    newRect.left -= state.boundaryRect.left;
    newRect.top -= state.boundaryRect.top;

    // take initial scroll of container into account
    newRect.top += initialScrollTop;

    // scroll diff between drag start and now (auto scroll or mouse wheel)
    const scrollDiff = currentScrollTop - initialScrollTop;
    const scrollValue = Math.abs(scrollDiff);

    // top needs to be changed only if scroll direction is top
    if (scrollDiff < 0) {
      newRect.top -= scrollValue;
    }

    // height needs to be changed regardless of direction and method
    newRect.height += scrollValue;

    const boundedRect = state.boundaryRect
      ? restrictResizableWithinBoundary(newRect, state.boundaryRect)
      : {...newRect};

    if (boxRef.current) {
      state.rafId = requestAnimationFrame(() => {
        if (boxRef.current) {
          boxRef.current.style.display = `block`;
          boxRef.current.style.transform = `translate(${boundedRect.left}px, ${boundedRect.top}px)`;
          boxRef.current.style.width = `${boundedRect.width}px`;
          boxRef.current.style.height = `${boundedRect.height}px`;
        }
        state.rafId = undefined;
      });
    }

    // convert rect back to absolute for intersection testing
    const absoluteRect = {
      ...boundedRect,
      left: boundedRect.left + state.boundaryRect.left,
      top: boundedRect.top + state.boundaryRect.top - currentScrollTop,
    };

    for (const [, selectable] of mouseSelectables) {
      const intersect = rectsIntersect(selectable.rect, absoluteRect);
      if (intersect && !state.selectedIds?.has(selectable.id)) {
        state.selectedIds?.add(selectable.id);
        selectable.onSelected?.();
      } else if (!intersect && state.selectedIds?.has(selectable.id)) {
        state.selectedIds?.delete(selectable.id);
        selectable.onDeselected?.();
      }
    }
  };

  const pointerEvents = usePointerEvents({
    minimumMovement: 4,
    onPointerDown,
    onMoveStart: e => {
      if (activeInteraction) {
        return false;
      }
      updateRects(mouseSelectables);
      state = {
        selectedIds: new Set(),
      };
      const el = containerRef.current;
      state.startPoint = {
        x: e.clientX,
        y: e.clientY,
        scrollTop: el?.scrollTop || 0,
      };

      state.scrollListener = e => {
        if (!state.startPoint) return;
        // update rects on scroll, because we are using relative position
        updateRects(mouseSelectables);
        if (state.boundaryRect?.height) {
          state.boundaryRect.height = (e.target as HTMLElement).scrollHeight;
        }
        // draw selection box (for autoscroll and mousewheel)
        drawSelectionBox();
      };

      if (el) {
        const rect = el.getBoundingClientRect();
        el.addEventListener('scroll', state.scrollListener);
        state.boundaryRect = {
          top: rect.top,
          left: rect.left,
          height: el.scrollHeight,
          heightWithoutScroll: rect.height,
          width: el.scrollWidth,
        };
      }
    },
    onMove: e => {
      state.endPoint = {x: e.clientX, y: e.clientY};

      if (state.boundaryRect && containerRef.current) {
        const reachedBottomEdge =
          e.clientY + 20 >
          state.boundaryRect.heightWithoutScroll + state.boundaryRect.top;
        const reachedTopEdge = e.clientY - 20 < state.boundaryRect.top;

        if (reachedBottomEdge) {
          containerRef.current.scrollBy({top: 10});
        } else if (reachedTopEdge) {
          containerRef.current.scrollBy({top: -10});
        }
      }

      drawSelectionBox();
    },
    onMoveEnd: () => {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
      }
      if (containerRef.current && state.scrollListener) {
        containerRef.current.removeEventListener(
          'scroll',
          state.scrollListener
        );
      }
      if (boxRef.current) {
        boxRef.current.style.display = `none`;
        boxRef.current.style.transform = '';
        boxRef.current.style.width = '';
        boxRef.current.style.height = '';
      }
      state = {};
    },
  });

  return {
    containerProps: {
      ...pointerEvents.domProps,
      ref: containerRef,
    },
    boxProps: {ref: boxRef},
  };
}
