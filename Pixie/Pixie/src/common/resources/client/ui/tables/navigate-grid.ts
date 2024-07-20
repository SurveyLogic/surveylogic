import React, {KeyboardEventHandler} from 'react';
import {getFocusableTreeWalker} from '@react-aria/focus';
import {focusWithoutScrolling} from '@react-aria/utils';
import {isCtrlKeyPressed} from '../../utils/keybinds/is-ctrl-key-pressed';

interface Props {
  cellCount: number;
  rowCount: number;
}
export function useGridNavigation(props: Props) {
  const {cellCount, rowCount} = props;
  const onKeyDown: KeyboardEventHandler<HTMLElement> = e => {
    switch (e.key) {
      case 'ArrowLeft':
        focusSiblingCell(e, {cell: {op: 'decrement'}}, props);
        break;
      case 'ArrowRight':
        focusSiblingCell(e, {cell: {op: 'increment'}}, props);
        break;
      case 'ArrowUp':
        focusSiblingCell(e, {row: {op: 'decrement'}}, props);
        break;
      case 'ArrowDown':
        focusSiblingCell(e, {row: {op: 'increment'}}, props);
        break;
      case 'PageUp':
        focusSiblingCell(e, {row: {op: 'decrement', count: 5}}, props);
        break;
      case 'PageDown':
        focusSiblingCell(e, {row: {op: 'increment', count: 5}}, props);
        break;
      case 'Tab':
        focusFirstElementAfterGrid(e);
        break;
      case 'Home':
        if (isCtrlKeyPressed(e)) {
          // move to first cell in first row
          focusSiblingCell(
            e,
            {
              row: {op: 'decrement', count: rowCount},
              cell: {op: 'decrement', count: cellCount},
            },
            props
          );
        } else {
          // move to first cell in current row
          focusSiblingCell(
            e,
            {cell: {op: 'decrement', count: cellCount}},
            props
          );
        }
        break;
      case 'End':
        if (isCtrlKeyPressed(e)) {
          // move to last cell in last row
          focusSiblingCell(
            e,
            {
              row: {op: 'increment', count: rowCount},
              cell: {op: 'increment', count: cellCount},
            },
            props
          );
        } else {
          // move to last cell in current row
          focusSiblingCell(
            e,
            {cell: {op: 'increment', count: cellCount}},
            props
          );
        }
        break;
    }
  };

  return {onKeyDown};
}

interface Operations {
  cell?: {
    op: 'increment' | 'decrement';
    count?: number;
  };
  row?: {
    op: 'increment' | 'decrement';
    count?: number;
  };
}
function focusSiblingCell(
  e: React.KeyboardEvent,
  operations: Operations,
  {cellCount, rowCount}: Props
) {
  if (document.activeElement?.tagName === 'input') return;
  e.preventDefault();
  const grid = e.currentTarget as HTMLElement;

  // focused element might be inside the cell and not the cell itself
  const currentCell = (e.target as HTMLElement).closest('[aria-colindex]');
  if (!currentCell || !grid) return;

  const row = currentCell.closest('[aria-rowindex]');
  if (!row) return;

  // grab row and cell index from aria attributes
  let rowIndex = parseInt(row.getAttribute('aria-rowindex') as string);
  let cellIndex = parseInt(currentCell.getAttribute('aria-colindex') as string);
  if (Number.isNaN(rowIndex) || Number.isNaN(cellIndex)) return;

  // adjust row index for next cell selector
  const rowOpCount = operations.row?.count ?? 1;
  if (operations.row?.op === 'increment') {
    rowIndex = Math.min(rowCount, rowIndex + rowOpCount);
  } else if (operations.row?.op === 'decrement') {
    rowIndex = Math.max(1, rowIndex - rowOpCount);
  }

  // adjust cell index for next cell selector
  const cellOpCount = operations.cell?.count ?? 1;
  if (operations.cell?.op === 'increment') {
    cellIndex = Math.min(cellCount, cellIndex + cellOpCount);
  } else if (operations.cell?.op === 'decrement') {
    cellIndex = Math.max(1, cellIndex - cellOpCount);
  }

  // find the next cell that should be focused
  const nextCell = grid.querySelector(
    `[aria-rowindex="${rowIndex}"] [aria-colindex="${cellIndex}"]`
  ) as HTMLElement | undefined;
  if (!nextCell) return;

  // find any focusable elements inside the cell
  const walker = getFocusableTreeWalker(nextCell);
  const nextFocusableElement = (walker.nextNode() || nextCell) as HTMLElement;

  // adjust tab index on current and next cells and focus either next cell or first focusable element inside that cell
  currentCell.setAttribute('tabindex', '-1');
  nextFocusableElement.setAttribute('tabindex', '0');
  nextFocusableElement.focus();
}

// grid is treated as a single tab stop, focus first element after grid, instead of moving focus withing grid on tab press
function focusFirstElementAfterGrid(e: React.KeyboardEvent) {
  const grid = e.currentTarget as HTMLElement;
  if (e.shiftKey) {
    grid.focus();
  } else {
    const walker = getFocusableTreeWalker(grid, {tabbable: true});
    let next: HTMLElement;
    let last: HTMLElement;
    do {
      last = walker.lastChild() as HTMLElement;
      if (last) {
        next = last;
      }
    } while (last);

    // @ts-ignore
    if (next && !next.contains(document.activeElement)) {
      focusWithoutScrolling(next);
    }
  }
}
