import {
  mergeProps,
  snapValueToStep,
  useGlobalListeners,
} from '@react-aria/utils';
import {useControlledState} from '@react-stately/utils';
import React, {
  HTMLAttributes,
  ReactNode,
  RefObject,
  useId,
  useRef,
  useState,
} from 'react';
import {clamp} from '@common/utils/number/clamp';
import {usePointerEvents} from '../../interactions/use-pointer-events';
import {useNumberFormatter} from '@common/i18n/use-number-formatter';
import type {NumberFormatOptions} from '@internationalized/number';
import {InputSize} from '../input-field/input-size';

export interface UseSliderProps<T = number[]> {
  formatOptions?: NumberFormatOptions;
  onPointerDown?: () => void;
  onChange?: (value: T) => void;
  onChangeEnd?: (value: T) => void;
  value?: T;
  defaultValue?: T;
  getValueLabel?: (value: number) => string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isDisabled?: boolean;
  size?: InputSize;
  label?: ReactNode;
  inline?: boolean;
  className?: string;
  width?: string;
  showValueLabel?: boolean;
  fillColor?: 'primary' | string;
  trackColor?: 'primary' | 'neutral' | string;
  showThumbOnHoverOnly?: boolean;
  thumbSize?: string;
}

export interface UseSliderReturn {
  domProps: HTMLAttributes<HTMLElement>;
  trackRef: RefObject<HTMLDivElement>;
  isPointerOver: boolean;
  showThumbOnHoverOnly?: boolean;
  thumbSize?: string;
  step: number;
  isDisabled: boolean;
  values: number[];
  minValue: number;
  maxValue: number;
  focusedThumb: number | undefined;
  labelId: string | undefined;
  groupId: string;
  thumbIds: string[];
  numberFormatter: Intl.NumberFormat;
  getThumbPercent: (index: number) => number;
  getThumbMinValue: (index: number) => number;
  getThumbMaxValue: (index: number) => number;
  getThumbValueLabel: (index: number) => string;
  setThumbValue: (index: number, value: number) => void;
  updateDraggedThumbs: (index: number, dragging: boolean) => void;
  isThumbDragging: (index: number) => boolean;
  setThumbEditable: (index: number, editable: boolean) => void;
  setFocusedThumb: (index: number | undefined) => void;
  getValueLabel?: (value: number) => string;
}

export function useSlider({
  minValue = 0,
  maxValue = 100,
  isDisabled = false,
  step = 1,
  formatOptions,
  onChangeEnd,
  onPointerDown,
  label,
  getValueLabel,
  showThumbOnHoverOnly,
  thumbSize,
  ...props
}: UseSliderProps): UseSliderReturn {
  const [isPointerOver, setIsPointerOver] = useState(false);
  const numberFormatter = useNumberFormatter(formatOptions);
  const {addGlobalListener, removeGlobalListener} = useGlobalListeners();
  const trackRef = useRef<HTMLDivElement>(null);

  // values will be stored in internal state as an array for both slider and range slider
  const [values, setValues] = useControlledState<number[]>(
    props.value ? props.value : undefined,
    props.defaultValue ?? ([minValue] as any),
    props.onChange as any
  );
  // need to also store values in ref, because state value would
  // lag behind by one between pointer down and move callbacks
  const valuesRef = useRef<number[] | null>(null);
  valuesRef.current = values;

  // indices of thumbs that are being dragged currently (state and ref for same reasons as above)
  const [draggedThumbs, setDraggedThumbs] = useState<boolean[]>(
    new Array(values.length).fill(false)
  );
  const draggedThumbsRef = useRef<boolean[] | null>(null);
  draggedThumbsRef.current = draggedThumbs;

  // formatted value for <output> and thumb aria labels
  function getFormattedValue(value: number) {
    return numberFormatter.format(value);
  }

  const isThumbDragging = (index: number) => {
    return draggedThumbsRef.current?.[index] || false;
  };

  const getThumbValueLabel = (index: number) =>
    getFormattedValue(values[index]);

  const getThumbMinValue = (index: number) =>
    index === 0 ? minValue : values[index - 1];
  const getThumbMaxValue = (index: number) =>
    index === values.length - 1 ? maxValue : values[index + 1];

  const setThumbValue = (index: number, value: number) => {
    if (isDisabled || !isThumbEditable(index) || !valuesRef.current) {
      return;
    }
    const thisMin = getThumbMinValue(index);
    const thisMax = getThumbMaxValue(index);

    // Round value to multiple of step, clamp value between min and max
    value = snapValueToStep(value, thisMin, thisMax, step);
    valuesRef.current = replaceIndex(valuesRef.current, index, value);
    setValues(valuesRef.current);
  };

  // update "dragging" status of specified thumb
  const updateDraggedThumbs = (index: number, dragging: boolean) => {
    if (isDisabled || !isThumbEditable(index)) {
      return;
    }

    const wasDragging = draggedThumbsRef.current?.[index];
    draggedThumbsRef.current = replaceIndex(
      draggedThumbsRef.current || [],
      index,
      dragging
    );
    setDraggedThumbs(draggedThumbsRef.current);

    // Call onChangeEnd if no handles are dragging.
    if (onChangeEnd && wasDragging && !draggedThumbsRef.current.some(Boolean)) {
      onChangeEnd(valuesRef.current || []);
    }
  };

  const [focusedThumb, setFocusedThumb] = useState<number | undefined>(
    undefined
  );

  const getValuePercent = (value: number) => {
    const x = Math.min(1, (value - minValue) / (maxValue - minValue));
    if (isNaN(x)) {
      return 0;
    }
    return x;
  };

  const getThumbPercent = (index: number) =>
    getValuePercent(valuesRef.current![index]);

  const setThumbPercent = (index: number, percent: number) => {
    setThumbValue(index, getPercentValue(percent));
  };

  const getRoundedValue = (value: number) =>
    Math.round((value - minValue) / step) * step + minValue;

  const getPercentValue = (percent: number) => {
    const val = percent * (maxValue - minValue) + minValue;
    return clamp(getRoundedValue(val), minValue, maxValue);
  };

  // allows disabling individual thumbs in range slider, instead of disable the whole slider
  const editableThumbsRef = useRef<boolean[]>(
    new Array(values.length).fill(true)
  );
  const isThumbEditable = (index: number) => editableThumbsRef.current[index];
  const setThumbEditable = (index: number, editable: boolean) => {
    editableThumbsRef.current[index] = editable;
  };

  // When the user clicks or drags the track, we want the motion to set and drag the
  // closest thumb. Hence, we also need to install useMove() on the track element.
  // Here, we keep track of which index is the "closest" to the drag start point.
  // It is set onMouseDown/onTouchDown; see trackProps below.
  const realTimeTrackDraggingIndex = useRef<number | null>(null);

  const currentPointer = useRef<number | null | undefined>(undefined);
  const handlePointerDown = (e: React.PointerEvent) => {
    if (
      e.pointerType === 'mouse' &&
      (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)
    ) {
      return;
    }

    onPointerDown?.();

    // We only trigger track-dragging if the user clicks on the track itself and nothing is currently being dragged.
    if (
      trackRef.current &&
      !isDisabled &&
      values.every((_, i) => !draggedThumbs[i])
    ) {
      const size = trackRef.current.offsetWidth;
      // Find the closest thumb
      const trackPosition = trackRef.current.getBoundingClientRect().left;
      const offset = e.clientX - trackPosition;
      const percent = offset / size;
      const value = getPercentValue(percent);

      // to find the closet thumb we split the array based on the first thumb position to the "right/end" of the click.
      let closestThumb;
      const split = values.findIndex(v => value - v < 0);
      if (split === 0) {
        // If the index is zero then the closest thumb is the first one
        closestThumb = split;
      } else if (split === -1) {
        // If no index is found they've clicked past all the thumbs
        closestThumb = values.length - 1;
      } else {
        const lastLeft = values[split - 1];
        const firstRight = values[split];
        // Pick the last left/start thumb, unless they are stacked on top of each other, then pick the right/end one
        if (Math.abs(lastLeft - value) < Math.abs(firstRight - value)) {
          closestThumb = split - 1;
        } else {
          closestThumb = split;
        }
      }

      // Confirm that the found closest thumb is editable, not disabled, and move it
      if (closestThumb >= 0 && isThumbEditable(closestThumb)) {
        // Don't un-focus anything
        e.preventDefault();

        realTimeTrackDraggingIndex.current = closestThumb;
        setFocusedThumb(closestThumb);
        currentPointer.current = e.pointerId;

        updateDraggedThumbs(realTimeTrackDraggingIndex.current, true);
        setThumbValue(closestThumb, value);

        addGlobalListener(window, 'pointerup', onUpTrack, false);
      } else {
        realTimeTrackDraggingIndex.current = null;
      }
    }
  };

  const currentPosition = useRef<number | null>(null);
  const {domProps: moveDomProps} = usePointerEvents({
    onPointerDown: handlePointerDown,
    onMoveStart() {
      currentPosition.current = null;
    },
    onMove(e, deltaX) {
      const size = trackRef.current?.offsetWidth || 0;

      if (currentPosition.current == null) {
        currentPosition.current =
          getThumbPercent(realTimeTrackDraggingIndex.current || 0) * size;
      }

      currentPosition.current += deltaX;

      if (realTimeTrackDraggingIndex.current != null && trackRef.current) {
        const percent = clamp(currentPosition.current / size, 0, 1);
        setThumbPercent(realTimeTrackDraggingIndex.current, percent);
      }
    },
    onMoveEnd() {
      if (realTimeTrackDraggingIndex.current != null) {
        updateDraggedThumbs(realTimeTrackDraggingIndex.current, false);
        realTimeTrackDraggingIndex.current = null;
      }
    },
  });

  const domProps = mergeProps(moveDomProps, {
    onPointerEnter: () => {
      setIsPointerOver(true);
    },
    onPointerLeave: () => {
      setIsPointerOver(false);
    },
  });

  const onUpTrack = (e: PointerEvent) => {
    const id = e.pointerId;
    if (id === currentPointer.current) {
      if (realTimeTrackDraggingIndex.current != null) {
        updateDraggedThumbs(realTimeTrackDraggingIndex.current, false);
        realTimeTrackDraggingIndex.current = null;
      }

      removeGlobalListener(window, 'pointerup', onUpTrack, false);
    }
  };

  const id = useId();
  const labelId = label ? `${id}-label` : undefined;
  const groupId = `${id}-group`;
  const thumbIds = [...Array(values.length)].map((v, i) => {
    return `${id}-thumb-${i}`;
  });

  return {
    domProps,
    trackRef,
    isDisabled,
    step,
    values,
    minValue,
    maxValue,
    focusedThumb,
    labelId,
    groupId,
    thumbIds,
    numberFormatter,
    getThumbPercent,
    getThumbMinValue,
    getThumbMaxValue,
    getThumbValueLabel,
    isThumbDragging,
    setThumbValue,
    updateDraggedThumbs,
    setThumbEditable,
    setFocusedThumb,
    getValueLabel,
    isPointerOver,
    showThumbOnHoverOnly,
    thumbSize,
  };
}

function replaceIndex<T>(array: T[], index: number, value: T) {
  if (array[index] === value) {
    return array;
  }

  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}
