import {resizeHandlePosition} from '@common/ui/interactions/use-resize';

type Props = {
  position: resizeHandlePosition;
  inset?: boolean;
};

export function CornerHandle({position, inset = false}: Props) {
  const className = getPositionClass(position, inset);
  return (
    <div
      data-resize-handle={position}
      className={`border-white absolute w-20 h-20 ${className}`}
    />
  );
}

function getPositionClass(
  position: resizeHandlePosition,
  inset: boolean
): string {
  const left = inset ? 'left-0' : '-left-5';
  const top = inset ? 'top-0' : '-top-5';
  const bottom = inset ? 'bottom-0' : '-bottom-5';
  const right = inset ? 'right-0' : '-right-5';
  switch (position) {
    case resizeHandlePosition.topLeft:
      return `${left} ${top} border-l-4 border-t-4 cursor-nwse-resize`;
    case resizeHandlePosition.topRight:
      return `${right} ${top} border-r-4 border-t-4 cursor-nesw-resize`;
    case resizeHandlePosition.bottomRight:
      return `${right} ${bottom} border-r-4 border-b-4 cursor-se-resize`;
    case resizeHandlePosition.bottomLeft:
      return `${left} ${bottom} border-l-4 border-b-4 cursor-sw-resize`;
    default:
      return '';
  }
}
