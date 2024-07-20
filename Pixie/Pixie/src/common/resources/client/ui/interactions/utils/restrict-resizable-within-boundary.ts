import {InteractableRect} from '../interactable-event';

export function restrictResizableWithinBoundary(
  rect: InteractableRect,
  boundaryRect: InteractableRect
) {
  const boundedRect = {...rect};

  // restrict to left edge of boundary
  boundedRect.left = Math.max(0, boundedRect.left);
  // compensate width when left is bounded
  const leftRestriction = boundedRect.left - rect.left;
  if (leftRestriction > 0) {
    boundedRect.width -= leftRestriction;
  }

  // restrict to top edge of boundary
  boundedRect.top = Math.max(0, boundedRect.top);
  // compensate height when top is bounded
  const topRestriction = boundedRect.top - rect.top;
  if (topRestriction > 0) {
    boundedRect.height -= topRestriction;
  }

  // restrict to right edge of boundary
  boundedRect.width = Math.min(
    boundedRect.width,
    boundaryRect.width - boundedRect.left
  );

  // restrict to bottom edge of boundary
  boundedRect.height = Math.min(
    boundedRect.height,
    boundaryRect.height - boundedRect.top
  );

  return boundedRect;
}
