import React from 'react';
import {isCtrlKeyPressed} from '@common/utils/keybinds/is-ctrl-key-pressed';
import {tools} from '../state/utils';

export function handleCanvasKeydown(e: React.KeyboardEvent) {
  switch (e.key) {
    case 'z':
      if (isCtrlKeyPressed(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) {
          tools().history.redo();
        } else {
          tools().history.undo();
        }
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('up');
      break;
    case 'ArrowRight':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('right');
      break;
    case 'ArrowDown':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('down');
      break;
    case 'ArrowLeft':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('left');
      break;
    case 'Delete':
      e.preventDefault();
      e.stopPropagation();
      tools().objects.delete();
      break;
    case 'v':
      if (isCtrlKeyPressed(e)) {
        e.preventDefault();
        e.stopPropagation();
        handlePaste();
      }
      break;
    default:
  }
}

async function handlePaste() {
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          const reader = new FileReader();
          reader.onload = event => {
            if (event.target?.result) {
              tools().import.addImageFromData(event.target.result as string);
            }
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
