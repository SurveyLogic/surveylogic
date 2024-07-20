import React, {ReactElement} from 'react';
import {useStore} from '../../../state/store';
import {BasicShape, PathOptions} from '../../../config/default-shapes';
import {
  ScrollableView,
  ScrollableViewItem,
} from '../../../ui/navbar/scrollable-view';
import {IconButton} from '@common/ui/buttons/icon-button';
import {CustomEllipseIcon} from '../../../ui/icons/ellipse';
import {CustomCircleIcon} from '../../../ui/icons/circle';
import {CustomSquareIcon} from '../../../ui/icons/square';
import {CustomTriangleIcon} from '../../../ui/icons/triangle';
import {state, tools} from '../../../state/utils';

export function ShapeNav() {
  const shapes = useStore(s => s.config.tools?.shapes?.items) || [];
  const shapeBtns = shapes.map(shape => {
    return (
      <ScrollableViewItem key={shape.name}>
        <IconButton
          variant="outline"
          radius="rounded-2xl"
          size="xl"
          onClick={() => {
            tools().shape.addBasicShape(shape.name);
            state().setDirty(true);
          }}
        >
          <ShapeIcon shape={shape} />
        </IconButton>
      </ScrollableViewItem>
    );
  });
  return <ScrollableView>{shapeBtns}</ScrollableView>;
}

type ShapeIconProps = {
  shape: BasicShape;
};

function ShapeIcon({shape}: ShapeIconProps) {
  if (shape.type === 'Path') {
    return (
      <svg
        className="m-auto w-36 h-36"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -100 512 700"
      >
        <path
          className="fill-transparent stroke-current"
          d={(shape.options as PathOptions)?.path}
          strokeWidth={25}
        />
      </svg>
    );
  }
  return React.cloneElement(shapeIconMap[shape.name], {className: 'w-30 h-30'});
}

const shapeIconMap: Record<string, ReactElement> = {
  circle: <CustomCircleIcon viewBox="0 0 32 32" />,
  square: <CustomSquareIcon viewBox="0 0 32 32" />,
  triangle: <CustomTriangleIcon viewBox="0 0 32 32" />,
  ellipse: <CustomEllipseIcon viewBox="0 0 32 32" />,
};
