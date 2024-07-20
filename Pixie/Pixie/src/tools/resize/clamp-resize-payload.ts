import {state} from '../../state/utils';
import type {ResizePayload} from './resize-tool';

export function clampResizePayload(value: ResizePayload): ResizePayload {
  if (value.width < getMinWidth(value.usePercentages)) {
    value.width = getMinWidth(value.usePercentages);
    if (value.maintainAspect) {
      value.height = aspectToHeight(value.width, value.usePercentages);
    }
  }
  if (value.width > getMaxWidth(value.usePercentages)) {
    value.width = getMaxWidth(value.usePercentages);
    if (value.maintainAspect) {
      value.height = aspectToHeight(value.width, value.usePercentages);
    }
  }
  if (value.height < getMinHeight(value.usePercentages)) {
    value.height = getMinHeight(value.usePercentages);
    if (value.maintainAspect) {
      value.width = aspectToWidth(value.height, value.usePercentages);
    }
  }
  if (value.height > getMaxHeight(value.usePercentages)) {
    value.height = getMaxHeight(value.usePercentages);
    if (value.maintainAspect) {
      value.width = aspectToWidth(value.height, value.usePercentages);
    }
  }
  return value;
}

function getMinWidth(usePercentages: boolean) {
  const minWidth = state().config.tools?.resize?.minWidth || 50;
  if (usePercentages) {
    return Math.ceil((minWidth * 100) / state().original.width);
  }
  return minWidth;
}

function getMaxWidth(usePercentages: boolean) {
  const maxWidth = state().config.tools?.resize?.maxWidth || 2400;
  if (usePercentages) {
    return Math.ceil((maxWidth * 100) / state().original.width);
  }
  return maxWidth;
}

function getMinHeight(usePercentages: boolean) {
  const minHeight = state().config.tools?.resize?.minHeight || 50;
  if (usePercentages) {
    return Math.ceil((minHeight * 100) / state().original.height);
  }
  return minHeight;
}

function getMaxHeight(usePercentages: boolean) {
  const maxHeight = state().config.tools?.resize?.maxHeight || 2400;
  if (usePercentages) {
    return Math.ceil((maxHeight * 100) / state().original.height);
  }
  return maxHeight;
}

export function aspectToWidth(
  newHeight: number,
  usePercentages: boolean
): number {
  if (usePercentages) {
    // noinspection JSSuspiciousNameCombination
    return newHeight;
  }
  const hRatio = state().original.height / newHeight;
  return Math.floor(state().original.width / hRatio);
}

export function aspectToHeight(
  newWidth: number,
  usePercentages: boolean
): number {
  if (usePercentages) {
    // noinspection JSSuspiciousNameCombination
    return newWidth;
  }
  const wRatio = state().original.width / newWidth;
  return Math.floor(state().original.height / wRatio);
}
