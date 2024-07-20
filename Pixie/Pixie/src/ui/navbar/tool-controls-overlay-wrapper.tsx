import React from 'react';
import clsx from 'clsx';

type Props = {
  actionBtn?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function ToolControlsOverlayWrapper({
  actionBtn,
  children,
  className,
}: Props) {
  return (
    <div className={clsx(className, 'flex gap-16 items-center h-full')}>
      {actionBtn && <div className="flex-shrink-0">{actionBtn}</div>}
      <div className="w-full flex-auto">{children}</div>
      {actionBtn && <div className="w-96" />}
    </div>
  );
}
