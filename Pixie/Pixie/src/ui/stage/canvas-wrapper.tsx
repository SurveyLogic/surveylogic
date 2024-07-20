import React, {useEffect, useRef, useState} from 'react';
import {m, Variants} from 'framer-motion';
import {
  createUseGesture,
  dragAction,
  FullGestureState,
  pinchAction,
} from '@use-gesture/react';
import {StageOverlays} from './stage-overlays';
import {useStore} from '../../state/store';
import {fabricCanvas, tools} from '../../state/utils';
import {assetUrl} from '../../utils/asset-url';

const useGesture = createUseGesture([dragAction, pinchAction]);

export const CanvasWrapper = React.forwardRef<HTMLCanvasElement>(
  (props, canvasRef) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      return useStore.subscribe(
        s => s.loading,
        loading => {
          if (!loading) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        }
      );
    }, []);

    const variants: Variants = {
      visible: {
        opacity: 1,
        transition: {duration: 0.35, delay: 0.5},
      },
      hidden: {opacity: 0, transition: {duration: 0}},
    };

    return (
      <PanContainer>
        <m.div
          initial={{opacity: 0}}
          variants={variants}
          animate={isVisible ? 'visible' : 'hidden'}
          className="relative m-auto"
          style={{
            backgroundImage: `url(${assetUrl('images/empty-canvas-bg.png')})`,
          }}
        >
          <StageOverlays />
          <canvas ref={canvasRef} />
        </m.div>
      </PanContainer>
    );
  }
);

type PanContainerProps = {
  children: React.ReactNode;
};

function PanContainer({children}: PanContainerProps) {
  const ref = useRef<HTMLDivElement>(null!);

  const bind = useGesture({
    onPinch: e => {
      if (!tools().zoom.allowUserZoom || !shouldHandleGesture(e)) {
        return e.cancel();
      }
      if (e.direction[0] === 1) {
        tools().zoom.zoomIn(0.01);
      } else {
        tools().zoom.zoomOut(0.01);
      }
      e.event.stopPropagation();
      e.event.preventDefault();
    },
    onDrag: e => {
      if (e.pinching || !shouldHandleGesture(e)) {
        return e.cancel();
      }
      ref.current.scrollLeft -= e.delta[0];
      ref.current.scrollTop -= e.delta[1];
    },
  });

  return (
    <div
      ref={ref}
      className="flex items-center justify-center w-full h-full overflow-hidden touch-none"
      {...bind()}
    >
      {children}
    </div>
  );
}

function shouldHandleGesture(
  e: FullGestureState<'drag'> | FullGestureState<'pinch'>
): boolean {
  return !(
    fabricCanvas().findTarget(e.event, false) || fabricCanvas().isDrawingMode
  );
}
