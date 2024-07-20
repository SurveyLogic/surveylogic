import {useLayoutEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {CornerHandle} from '../../../../objects/ui/corner-handle';
import {useStore} from '../../../../state/store';
import {MaskPart, MaskPosition} from './mask-part';
import {Line} from './cropzone-line';
import {CropzoneRefs} from './cropzone-refs';
import {tools} from '../../../../state/utils';
import {useMove} from '@common/ui/interactions/use-move';
import {
  resizeHandlePosition,
  useResize,
} from '@common/ui/interactions/use-resize';
import {mergeProps} from '@react-aria/utils';
import {aspectRatioFromStr} from '@common/ui/interactions/utils/calc-new-size-from-aspect-ratio';

export function Cropzone() {
  const refs = useRef<CropzoneRefs>({} as CropzoneRefs);
  const [isMoving, setIsMoving] = useState(true);
  const boundaryRect = useStore(s => s.canvasSize);
  const controlConfig = useStore(s => s.config.tools?.crop?.cropzone);
  const defaultRatio =
    useStore(s => s.config.tools?.crop?.defaultRatio) || null;
  const selectedAspectRatio = useStore(s => s.crop.selectedAspectRatio) || null;

  const {moveProps} = useMove({
    boundaryRect,
    onMoveStart: () => setIsMoving(true),
    onMove: e => tools().crop.drawZone(e.rect),
    onMoveEnd: () => setIsMoving(false),
  });

  const {resizeProps} = useResize({
    boundaryRect,
    minHeight: 50,
    minWidth: 50,
    aspectRatio: aspectRatioFromStr(selectedAspectRatio),
    onResizeStart: () => setIsMoving(true),
    onResize: e => tools().crop.drawZone(e.rect),
    onResizeEnd: () => setIsMoving(false),
  });

  // redraw cropzone if default aspect ratio or canvas size change
  useLayoutEffect(() => {
    tools().crop.registerRefs(refs);
    tools().crop.resetCropzone(defaultRatio);
  }, [defaultRatio, boundaryRect]);

  const className = clsx(
    'cropzone absolute z-cropzone isolate left-0 top-0 w-full h-full overflow-hidden',
    isMoving && 'moving'
  );

  return (
    <div
      className={className}
      onPointerDown={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div
        className="cropzone-transition border-white/50 absolute z-10 left-0 top-0 border"
        {...mergeProps(resizeProps, moveProps)}
        ref={el => (refs.current.innerZone = el)}
      >
        {!controlConfig?.hideTopLeft && (
          <CornerHandle position={resizeHandlePosition.topLeft} inset />
        )}
        {!controlConfig?.hideTopRight && (
          <CornerHandle position={resizeHandlePosition.topRight} inset />
        )}
        {!controlConfig?.hideBottomLeft && (
          <CornerHandle position={resizeHandlePosition.bottomLeft} inset />
        )}
        {!controlConfig?.hideBottomRight && (
          <CornerHandle position={resizeHandlePosition.bottomRight} inset />
        )}

        <Line name="lineVer1" refs={refs} />
        <Line name="lineVer2" refs={refs} />
        <Line name="lineHor1" refs={refs} />
        <Line name="lineHor2" refs={refs} />
      </div>

      <MaskPart refs={refs} position={MaskPosition.top} />
      <MaskPart refs={refs} position={MaskPosition.left} />
      <MaskPart refs={refs} position={MaskPosition.right} />
      <MaskPart refs={refs} position={MaskPosition.bottom} />
    </div>
  );
}
