import {
  arrow,
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  Placement,
  ReferenceType,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import {CSSProperties, Ref, useMemo, useRef} from 'react';
import {mergeRefs} from 'react-merge-refs';
import {Options as OffsetOptions} from '@floating-ui/core/src/middleware/offset';
import {UseFloatingProps} from '@floating-ui/react-dom/src/types';

interface Props {
  floatingWidth?: 'auto' | 'matchTrigger';
  ref?: Ref<HTMLElement>;
  disablePositioning?: boolean;
  placement?: Placement;
  offset?: OffsetOptions;
  showArrow?: boolean;
  maxHeight?: number;
  shiftCrossAxis?: boolean;
  fallbackPlacements?: Placement[];
}
export function useFloatingPosition({
  floatingWidth,
  ref,
  disablePositioning = false,
  placement = 'bottom',
  offset = 2,
  showArrow = false,
  maxHeight,
  shiftCrossAxis = true,
  fallbackPlacements,
}: Props) {
  const arrowRef = useRef<HTMLElement>(null);

  const floatingConfig: UseFloatingProps = {placement, strategy: 'fixed'};

  if (!disablePositioning) {
    floatingConfig.whileElementsMounted = autoUpdate;
    floatingConfig.middleware = [
      offsetMiddleware(offset),
      shift({padding: 16, crossAxis: shiftCrossAxis, mainAxis: true}),
      flip({
        padding: 16,
        fallbackPlacements,
      }),
      size({
        apply({rects, availableHeight, availableWidth, elements}) {
          if (floatingWidth === 'matchTrigger' && maxHeight != null) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxWidth: `${availableWidth}`,
              maxHeight: `${Math.min(availableHeight, maxHeight)}px`,
            });
          }
        },
        padding: 16,
      }),
    ];
    if (showArrow) {
      floatingConfig.middleware.push(arrow({element: arrowRef}));
    }
  }

  const floatingProps = useFloating(floatingConfig);

  const mergedReferenceRef = useMemo(
    () => mergeRefs<ReferenceType>([ref!, floatingProps.reference]),
    [floatingProps.reference, ref]
  );

  const {x: arrowX, y: arrowY} = floatingProps.middlewareData.arrow || {};

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[floatingProps.placement.split('-')[0]]!;

  const arrowStyle: CSSProperties = {
    left: arrowX,
    top: arrowY,
    right: '',
    bottom: '',
    [staticSide]: '-4px',
  };

  return {
    ...floatingProps,
    reference: mergedReferenceRef,
    arrowRef,
    arrowStyle,
  };
}
