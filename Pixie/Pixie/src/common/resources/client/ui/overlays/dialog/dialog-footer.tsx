import React, {ReactNode} from 'react';
import clsx from 'clsx';
import {DialogSize} from './dialog';

interface DialogFooterProps {
  children: ReactNode;
  startAction?: ReactNode;
  className?: string;
  dividerTop?: boolean;
  size?: DialogSize;
  padding?: string;
}
export function DialogFooter(props: DialogFooterProps) {
  const {children, startAction, className, dividerTop, padding, size} = props;

  return (
    <div
      className={clsx(
        className,
        dividerTop && 'border-t',
        getPadding(props),
        'flex items-center gap-10 flex-shrink-0'
      )}
    >
      <div>{startAction}</div>
      <div className="ml-auto flex items-center gap-10">{children}</div>
    </div>
  );
}

function getPadding({padding, size}: DialogFooterProps) {
  if (padding) {
    return padding;
  }
  switch (size) {
    case 'xs':
      return 'p-14';
    case 'sm':
      return 'p-18';
    default:
      return 'px-24 py-20';
  }
}
