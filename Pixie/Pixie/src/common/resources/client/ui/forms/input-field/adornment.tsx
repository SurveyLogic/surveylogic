import React from 'react';
import clsx from 'clsx';

type AdornmentProps = {
  children: React.ReactNode;
  direction: 'start' | 'end';
  position?: string;
  className?: string;
};
export function Adornment({
  children,
  direction,
  className,
  position = direction === 'start' ? 'left-0' : 'right-0',
}: AdornmentProps) {
  if (!children) return null;
  return (
    <div
      className={clsx(
        'absolute h-full min-w-42 flex items-center justify-center top-0 text-muted z-10',
        position,
        className
      )}
    >
      {children}
    </div>
  );
}
