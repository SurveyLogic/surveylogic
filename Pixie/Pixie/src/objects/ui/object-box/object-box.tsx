import React, {useCallback, useEffect, useRef} from 'react';
import {useStore} from '../../../state/store';
import {CornerHandle} from '../corner-handle';
import {ObjectControlConfig, PixieConfig} from '../../../config/default-config';
import {FloatingObjectControls} from '../floating-object-controls';
import {
  enableTextEditing,
  moveActiveObj,
  resizeActiveObj,
  rotateActiveObj,
  syncBoxPositionWithActiveObj,
} from './object-box-actions';
import {RotationControl} from './rotation-control';
import {ObjectModifiedEvent} from '../../object-modified-event';
import {fabricCanvas, state, tools} from '../../../state/utils';
import {useMove} from '@common/ui/interactions/use-move';
import {
  resizeHandlePosition,
  useResize,
} from '@common/ui/interactions/use-resize';
import {mergeProps} from '@react-aria/utils';
import {useRotate} from '@common/ui/interactions/use-rotate';

export function ObjectBox() {
  const boxRef = useRef<HTMLDivElement>(null!);
  const floatingControlsRef = useRef<HTMLDivElement>(null!);
  const activeObjId = useStore(s => s.objects.active.id);
  const isEditingText = useStore(s => s.objects.isEditingText);
  const zoom = useStore(s => s.zoom);
  const objTypeConfig = getObjTypeConfig();

  const doubleTapTimer = useRef<NodeJS.Timeout | null>(null);
  const doubleTapHandler = useCallback(() => {
    if (!doubleTapTimer.current) {
      doubleTapTimer.current = setTimeout(() => {
        doubleTapTimer.current = null;
      }, 300);
    } else {
      clearTimeout(doubleTapTimer.current);
      doubleTapTimer.current = null;
      enableTextEditing();
    }
  }, []);

  let {moveProps} = useMove({
    boundaryRef: state().canvasRef,
    restrictWithinBoundary: false,
    onMoveEnd: () => {
      state().objects.setActiveIsMoving(false);
    },
    onMove: e => {
      state().objects.setActiveIsMoving(true);
      moveActiveObj(e);
    },
  });
  // disable movement based on user specified config
  if (objTypeConfig.lockMovement) {
    moveProps = {};
  }

  const {resizeProps} = useResize({
    minWidth: 50,
    minHeight: 50,
    aspectRatio: objTypeConfig.unlockAspectRatio ? null : 'initial',
    boundaryRef: state().canvasRef,
    restrictWithinBoundary: false,
    onResizeEnd: () => {
      state().objects.setActiveIsMoving(false);
    },
    onResize: e => {
      state().objects.setActiveIsMoving(true);
      resizeActiveObj(e);
    },
  });

  const {rotateProps} = useRotate({
    boundaryRef: state().canvasRef,
    onRotateEnd: () => {
      state().objects.setActiveIsMoving(false);
    },
    onRotate: e => {
      state().objects.setActiveIsMoving(true);
      rotateActiveObj(e);
    },
  });

  useEffect(() => {
    // wait until fabric is initialized
    if (!fabricCanvas()) return;
    state().editor.on('object:modified', (e: ObjectModifiedEvent) => {
      if (e.sizeOrPositionChanged) {
        syncBoxPositionWithActiveObj(boxRef, floatingControlsRef);
      }
    });
  }, []);

  // reposition when obj is selected/deselected, or zoom or after user is done with editing text
  useEffect(() => {
    syncBoxPositionWithActiveObj(boxRef, floatingControlsRef);
  }, [activeObjId, zoom, isEditingText]);

  const display = activeObjId && !isEditingText ? 'block' : 'hidden';

  return (
    <div className={display}>
      <div
        ref={boxRef}
        {...mergeProps(rotateProps, resizeProps, moveProps)}
        onClick={doubleTapHandler}
        className="absolute z-obj-box border-2 border-white shadow-md cursor-move"
      >
        {!objTypeConfig.hideTopLeft && (
          <CornerHandle position={resizeHandlePosition.topLeft} />
        )}
        {!objTypeConfig.hideTopRight && (
          <CornerHandle position={resizeHandlePosition.topRight} />
        )}
        {!objTypeConfig.hideBottomLeft && (
          <CornerHandle position={resizeHandlePosition.bottomLeft} />
        )}
        {!objTypeConfig.hideBottomRight && (
          <CornerHandle position={resizeHandlePosition.bottomRight} />
        )}
        {!objTypeConfig.hideRotatingPoint && <RotationControl />}
      </div>
      <FloatingObjectControls ref={floatingControlsRef} />
    </div>
  );
}

function getObjTypeConfig(): ObjectControlConfig {
  const obj = tools().objects.getActive();
  if (!obj || !obj.name) return {};
  const userConfig = state().config.objectControls || {};
  const objName = obj.name as keyof PixieConfig['objectControls'];
  return {
    ...userConfig.global,
    ...(userConfig[objName] as ObjectControlConfig),
  };
}
